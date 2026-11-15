# Pulso — Product Intelligence Platform

Pulso is a product intelligence platform for Philips personal care products. It combines manufacturer-published specifications, customer reviews, dynamic product comparisons, and feedback analytics — all in one place.

**Live:** Deployed on Render + Neon (PostgreSQL)

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 + React Router + Recharts |
| Backend | Express 5 + Prisma ORM |
| Database | PostgreSQL on Neon |
| Auth | bcryptjs + JWT |
| Validation | Zod |
| Security | Helmet + express-rate-limit |

## Features

- **Product Catalog** — 12 Philips products across 6 categories (beard trimmers, multi-grooming kits, body groomers, electric shavers, hair dryers, hair straighteners) with gender segmentation, search, and filtering
- **Dynamic Comparison** — Select any two products, compare specs by canonical keys, visual spec bars, differences highlighted. Swap either product without page reload
- **Authentication** — Register, login, JWT sessions. Admin role for protected operations
- **Reviews** — Authenticated review submission with anonymity toggle, aspect ratings, serial number verification for "Verified Purchase" badge. One review per user per product
- **Analytics** — Rating distribution charts, aspect averages, verified/unverified counts. Admin trends dashboard
- **Community** — Cross-product review feed with filter tabs (All / Verified / Most Helpful)

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- A PostgreSQL database (Neon recommended for zero-config)

### 1. Clone and install

```bash
git clone <repo-url> pulso
cd pulso
npm install
```

### 2. Configure environment

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values:
#   DATABASE_URL=postgresql://...  (your Neon connection string)
#   JWT_SECRET=your-secret-key
#   CLIENT_URL=http://localhost:5173
```

```bash
# Frontend
cp apps/web/.env.example apps/web/.env
# Default VITE_API_BASE_URL=http://localhost:5000/api is usually correct
```

### 3. Set up the database

```bash
cd apps/api
npx prisma migrate dev    # Create tables
cd ../..
npm run seed              # Populate with demo data
```

### 4. Run locally

```bash
npm run dev               # Starts both API (port 5000) and web (port 5173)
```

Or separately:
```bash
npm run dev:api           # API only
npm run dev:web           # Frontend only
```

## Demo Walkthrough

### Browse Products
1. Visit `http://localhost:5173`
2. Browse by category (Men's Grooming → Beard Trimmers) or use the search
3. Click a product to see grouped specs with source attribution

### Compare Products
1. Go to **Compare** in the nav
2. Select two products from the dropdowns
3. See specs matched by canonical keys with differences highlighted and visual bars for numeric values

### Write a Review
1. Register at `/register` (or login: `user@productpulse.com` / `user123`)
2. Navigate to any product detail page
3. Fill out the review form with ratings, text, and optionally a serial number for verification
4. Demo serial format: `SN-{MODEL}-001` (e.g., `SN-BT321115-001`)

### Admin Features
1. Login as admin: `admin@productpulse.com` / `admin123`
2. Visit `/admin/trends` for product trend indicators

## Seed Data

- **12 products** with 140 specifications across 12 product families
- **24 serial numbers** (2 per product, bcrypt-hashed)
- **2 users**: admin and demo
- **8 demo reviews** with varied ratings, retailers, anonymity, and verification

## API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /api/health | Public | Health check |
| GET | /api/products | Public | List with search/filter |
| GET | /api/products/:id | Public | Product detail with specs |
| GET | /api/products/:id/reviews | Public | Product reviews |
| GET | /api/comparison?a=&b= | Public | Dynamic comparison |
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Auth | Current user |
| POST | /api/reviews | Auth | Submit review |
| PUT | /api/reviews/:id | Auth | Edit own review |
| GET | /api/reviews/recent | Public | Recent reviews feed |
| POST | /api/verification | Auth | Verify serial |
| GET | /api/user-products | Auth | Verified products |
| GET | /api/analytics/products/:id | Public | Product analytics |
| GET | /api/analytics/trends | Admin | Product trends |

## Known Limitations

- No password reset or OAuth (demo only)
- No review moderation UI (reviews default to PUBLISHED)
- No admin CRUD UI (use seed scripts + Prisma Studio)
- Serial verification uses bcrypt compare in a loop (fine for demo scale, not production scale)
- No pagination on product listing
- Philips products only (single brand)
