# Design

## Context

ProductPulse has a frontend showcase built with React + Vite + Tailwind: 12 products across 6 categories, a comparison page with client-side spec matching, a community review feed, login/register form shells, and a product catalog with sidebar filters — all reading from static in-memory data (`apps/web/src/data/products.js`). The backend is a skeleton Express server with Helmet, CORS, rate limiting, and a single health-check endpoint. Prisma schema is defined but no migrations or seed data exist. See proposal.md for motivation and full scope decisions.

## Goals / Non-Goals

**Goals:**
- Build the complete backend (routes, controllers, services, Prisma + Neon) for the 5-feature MVP
- Wire the existing frontend pages to live API endpoints, replacing static data imports
- Ensure the comparison engine is architecturally clean as a backend service — it is the core differentiator
- Seed 12 real Philips products with sourced specifications across 6 categories

**Non-Goals:**
- Product evolution / family trees (removed)
- Seller analytics (removed)
- Anonymous no-account review path (removed)
- Password reset, OAuth, email verification
- Receipt upload or automated verification
- Multi-brand support (Philips only for now)
- Rebuilding existing frontend pages — wire them, don't rewrite them

## Decisions

### 1. Prisma data model — expanded for gender and price

**Decision:** Keep the existing schema and add `gender` (String) and `priceRange` (String, optional) to Product. Add `gender` (String, optional) to ProductFamily. Review.userId remains non-nullable (all reviewers are authenticated). `isAnonymous` boolean on Review for display preference.

**Why `gender` as String (not enum):** The frontend already uses string values ("men", "women"). A string field is simpler to seed and filter. If more genders are needed later, no migration is required.

**Prisma models (key changes from existing schema):**

```prisma
model ProductFamily {
  id          String    @id @default(cuid())
  name        String
  brand       String
  category    String
  gender      String?           // "men" or "women"
  description String?
  products    Product[]
}

model Product {
  id                  String          @id @default(cuid())
  name                String
  model               String
  description         String?
  image               String?
  gender              String          // "men" or "women"
  priceRange          String?         // e.g. "₹1,495 – ₹1,799"
  familyId            String
  family              ProductFamily   @relation(fields: [familyId], references: [id])
  specs               Spec[]
  reviews             Review[]
  serials             ProductSerial[]
  avgRating           Float           @default(0)
  reviewCount         Int             @default(0)
  verifiedReviewCount Int             @default(0)
  createdAt           DateTime        @default(now())
}
```

All other models (User, Spec, ProductSerial, UserProduct, Review) remain as defined in the existing `schema.prisma`.

### 2. API endpoint structure

**Decision:** REST endpoints with gender/category filter support on the product listing.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /api/products | Public | List products with search, gender, and category filters |
| GET | /api/products/:id | Public | Product detail with specs |
| GET | /api/comparison?a=:idA&b=:idB | Public | Dynamic comparison |
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login, returns JWT |
| GET | /api/auth/me | Auth | Current user profile |
| POST | /api/reviews | Auth | Submit review |
| GET | /api/products/:id/reviews | Public | Reviews for a product |
| PUT | /api/reviews/:id | Auth (owner) | Edit own review |
| POST | /api/verification | Auth | Submit serial for verification |
| GET | /api/user-products | Auth | User's verified products |
| GET | /api/analytics/products/:id | Public | Product rating analytics |
| GET | /api/analytics/trends | Admin | Product trend indicators |
| POST | /api/admin/products | Admin | Create product |
| PUT | /api/admin/products/:id | Admin | Update product |
| POST | /api/admin/products/:id/specifications | Admin | Add/update specs |
| POST | /api/admin/serials | Admin | Add serial records |

`GET /api/products` accepts optional query params: `?q=` (search), `?gender=` (men/women), `?category=` (beard-trimmer, multi-grooming, etc.).

### 3. Comparison engine architecture

**Decision:** Comparison logic lives entirely in a backend service (`comparisonService`), not in the frontend. The API returns structured data; the frontend only renders it.

**Why:** Keeps business logic testable and server-side. The frontend swaps product IDs in the query string and re-fetches — no client-side spec matching.

**Migration note:** The existing `buildComparison()` function in `ComparePage.jsx` implements the same canonical-key matching logic client-side. During wiring, this function is removed and replaced with an API call to `GET /api/comparison?a=...&b=...`. The visual spec bars and diff highlighting in the frontend remain — they consume the structured response.

**Response shape:**
```json
{
  "productA": { "id": "...", "name": "...", "avgRating": 4.2, "reviewCount": 12 },
  "productB": { "id": "...", "name": "...", "avgRating": 3.8, "reviewCount": 7 },
  "categories": [
    {
      "name": "Battery",
      "specs": [
        {
          "key": "battery_runtime_minutes",
          "label": "Runtime",
          "unit": "minutes",
          "productA": { "value": "60", "applicability": "AVAILABLE" },
          "productB": { "value": "90", "applicability": "AVAILABLE" },
          "isDifferent": true
        }
      ]
    }
  ]
}
```

### 4. Anonymity as a display preference

**Decision:** `isAnonymous` boolean on Review. The `userId` is always stored. Public API responses replace the reviewer name with "Anonymous" when `isAnonymous` is true. Admin API responses always include the real user.

**Why over alternative (separate anonymous User type):** Simpler model. One review table, one user table. Anonymity is a view-layer concern, not an identity concern.

### 5. Serial verification flow

**Decision:** Serials are pre-seeded and stored as bcrypt hashes. Verification hashes the submitted serial, looks up the match, checks `claimed === false`, then atomically sets `claimed = true` and creates a UserProduct link. The review can then reference this UserProduct for the "Verified Purchase" label.

**Why bcrypt hashes (not SHA-256):** Serials are short, predictable strings. SHA-256 is fast enough to brute-force a serial space. bcrypt adds cost per attempt.

### 6. Frontend wiring strategy

**Decision:** The existing pages use a flat `pages/` structure (ProductsPage, ProductDetailPage, ComparePage, CommunityPage, LoginPage, RegisterPage) with shared components in `components/`. This stays as-is — no migration to `features/` modules.

**Wiring approach:** Each page replaces its static `products.js` imports with calls to `api.js` (the fetch wrapper that already exists in `services/api.js` with auth-token injection). Pages gain loading states and error handling. Specific transitions:

- **ProductsPage**: Replace `PRODUCTS` array filtering with `GET /api/products?q=&gender=&category=` — server handles search and filtering. Client keeps sort and view-mode state.
- **ProductDetailPage**: Replace `PRODUCTS.find()` with `GET /api/products/:id`. Reviews section fetches from `GET /api/products/:id/reviews`.
- **ComparePage**: Remove `buildComparison()`. Fetch from `GET /api/comparison?a=...&b=...`. Product selector dropdown fetches from `GET /api/products`.
- **CommunityPage**: Fetch reviews from a new endpoint or aggregate client-side from per-product review endpoints. Stats computed from API data.
- **LoginPage / RegisterPage**: Wire forms to `POST /api/auth/login` and `POST /api/auth/register`. Add auth context/provider.

**Why not rebuild pages:** The existing UI matches the product vision. Rebuilding wastes effort and risks regressions. The wiring-only approach preserves working layouts.

## Risks / Trade-offs

- **[Denormalized ratings can drift]** → Mitigation: Update avgRating/reviewCount in the same transaction as review create/update/delete. Add a reconciliation seed script for demos.
- **[bcrypt serial hashing is slow on bulk seed]** → Mitigation: Use a low cost factor (10) for demo seed data. Document that production would use higher.
- **[Frontend wiring may break existing pages]** → Mitigation: Wire one page at a time. Keep `products.js` as fallback until each page is confirmed working against the API. Remove static data file only after all pages are wired.
- **[12 products increases seed complexity]** → Mitigation: Seed data already exists as a verified JS object in `products.js`. The seed script can reference its structure directly.
- **[No password reset in MVP]** → Acceptable for initial release. Admin can reset via Prisma Studio if needed.
