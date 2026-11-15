# Proposal

## Why

ProductPulse has a frontend showcase — 12 products, 6 pages, comparison, community feed — all reading from static in-memory data. There is no backend, no database, no authentication, and no real review system. This change builds the full backend (Express + Prisma + Neon), wires the existing frontend to live API endpoints, and establishes the 5-feature MVP: product catalog, dynamic comparison engine, authentication, reviews with serial verification, and product analytics.

## What Changes

- **Backend foundation**: Express server with routes, controllers, services, and Prisma ORM connected to Neon PostgreSQL. Zod validation on all inputs. Helmet, CORS, rate limiting.
- **Product catalog**: 12 Philips personal care products across 6 categories (beard trimmers, multi-grooming kits, body groomers, electric shavers, hair dryers, hair straighteners) with gender segmentation (men/women). Seeded with real sourced specifications. Prisma model adds `gender` and `priceRange` fields.
- **Dynamic comparison engine**: Backend service matching specs by canonical key, grouped by category, handling AVAILABLE/UNKNOWN/NOT_APPLICABLE. Frontend switches from client-side comparison to API-driven.
- **Authentication**: Register, login, JWT sessions, admin role. Frontend auth context replaces current placeholder forms.
- **Reviews with serial verification**: Authenticated submission, anonymity toggle, one per user per product, serial-based "Verified Purchase" label. Denormalized rating summaries.
- **Product analytics**: Public rating distribution and aspect averages. Admin-only product trends.
- **Frontend wiring**: Existing pages (ProductsPage, ProductDetailPage, ComparePage, CommunityPage, LoginPage, RegisterPage) switch from `products.js` static imports to `api.js` fetch calls.

## Out of Scope

- Product evolution / family trees
- Seller analytics
- Multi-brand support (Philips only)
- Password reset, OAuth, email verification
- Receipt upload or automated verification
- Admin CRUD UI (use seed scripts + Prisma Studio)
- Review moderation UI (reviews default to PUBLISHED)
- Three-way comparisons
- AI sentiment analysis

## Capabilities

### New Capabilities
- `product-catalog`: Browse, search, filter, and view product detail pages with grouped specifications for Philips personal care products across 6 categories with gender segmentation
- `dynamic-comparison`: Select any two products, compare specs by canonical keys, swap either product, handle AVAILABLE/UNKNOWN/NOT_APPLICABLE states
- `user-auth`: User registration, login, JWT-based sessions, admin role flag; no password reset or OAuth
- `reviews`: Authenticated review submission with anonymity toggle, optional serial verification for "Verified Purchase" label, one review per user per product, user can edit own reviews
- `product-analytics`: Rating distribution, aspect averages, admin view of product trends

### Modified Capabilities

_None — no existing specs to modify._

## Impact

- **Data model**: Prisma schema adds `gender` (String) and `priceRange` (String?) to Product. ProductFamily gains `gender` (String?). Full migration + seed for 12 products.
- **API surface**: 18 REST endpoints covering products, comparison, auth, reviews, verification, analytics, and admin operations
- **Frontend**: 6 existing pages rewired from static data to API calls. Auth context/provider added. Review submission form activated. Analytics charts added with Recharts.
- **Seed data**: 12 products with specs, 2 serials per product (24 total), admin + demo users, 6–8 demo reviews
