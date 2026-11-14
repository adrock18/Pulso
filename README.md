# Pulso

Product intelligence platform for Philips trimmers — real specs, verified reviews, dynamic comparisons.

## What It Does

- **Browse products** with real, sourced specifications grouped by category
- **Compare any two products** side-by-side with canonical spec matching and difference highlighting
- **Submit verified reviews** — prove ownership via serial number, choose to display anonymously or by name
- **View analytics** — rating distributions, aspect averages, product trends

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, shadcn/ui, React Router, Recharts |
| Backend | Express 5, Prisma ORM, Zod validation |
| Database | PostgreSQL (Neon) |
| Auth | JWT + bcryptjs |
| Hosting | Render (Static Site + Web Service) |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database ([Neon](https://neon.tech) free tier recommended)

### Setup

```bash
# Clone and install
git clone https://github.com/adrock18/Pulso.git
cd Pulso
npm install

# Configure environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your DATABASE_URL, JWT_SECRET

# Set up database
cd apps/api
npx prisma migrate dev
npx prisma db seed
cd ../..

# Start development
npm run dev
```

Open **http://localhost:5173** — frontend and backend both start with one command.

## Project Structure

```
pulso/
├── apps/
│   ├── web/          React frontend (Vite + Tailwind + shadcn/ui)
│   └── api/          Express backend (Prisma + Zod + JWT)
├── scripts/          Seed data
├── docs/             Architecture documentation
├── CHANGELOG.md
└── README.md
```

## Features

### Product Catalog
Browse 4 Philips trimmers with real specifications. Each spec shows its source and verification date. Specs are grouped by category (Battery, Blade, Build, General) and display three states: available values, "Unknown" for unestablished data, and "N/A" for non-applicable specs.

### Dynamic Comparison Engine
Select any two products and compare specifications side-by-side. The engine matches specs by canonical keys — not hardcoded tables. Swap either product instantly. Differences are highlighted. Unknown data is never treated as a disadvantage.

### Authentication
Register and log in with JWT-based sessions. Admin role for protected operations. All authorization enforced server-side.

### Reviews with Serial Verification
Authenticated users submit reviews with an anonymity toggle. Optionally provide a product serial number for "Verified Purchase" status. One review per user per product. Anonymity and verification are independent — a verified reviewer can still choose to appear anonymous.

### Product Analytics
Rating distribution, aspect-level averages (Battery, Build Quality, Ease of Use, Performance, Value for Money), verified vs. unverified review counts. Admin view of product trends.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/products | Public | List products with search |
| GET | /api/products/:id | Public | Product detail with specs |
| GET | /api/comparison?a=&b= | Public | Compare two products |
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login, returns JWT |
| GET | /api/auth/me | Auth | Current user profile |
| POST | /api/reviews | Auth | Submit review |
| GET | /api/products/:id/reviews | Public | Product reviews |
| PUT | /api/reviews/:id | Owner | Edit own review |
| POST | /api/verification | Auth | Verify serial number |
| GET | /api/analytics/products/:id | Public | Product analytics |
| GET | /api/analytics/trends | Admin | Product trends |

## Roadmap

- [x] Project scaffold (monorepo, Express, React, Prisma, shadcn/ui)
- [ ] Product catalog with seed data and API
- [ ] Dynamic comparison engine
- [ ] Authentication (register, login, JWT, admin role)
- [ ] Reviews with serial verification and anonymity toggle
- [ ] Product analytics with Recharts
- [ ] Deployment to Render + Neon

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system diagrams, data model, design decisions, and security architecture.

## License

Private project.
