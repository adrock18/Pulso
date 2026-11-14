# Changelog

All notable changes to ProductPulse are documented here.

---

## [Unreleased]

### Added
- Project scaffold: monorepo with Express backend + React frontend
- Prisma schema with full data model (User, ProductFamily, Product, Spec, ProductSerial, UserProduct, Review)
- Express server with Helmet, CORS, rate limiting, health check
- React + Vite + Tailwind CSS v4 + React Router setup
- shadcn/ui component library integration
- API client with auth header injection
- Home page, product listing, product detail, comparison, login, and register pages (static frontend)
- Architecture documentation in docs/

### Technical Decisions
- Tailwind v4 with shadcn/ui for consistent, professional UI
- Vite dev server proxies `/api` to Express — single `npm run dev` starts everything
- Prisma with PostgreSQL (Neon) for relational data model
- JWT-based auth with bcryptjs password hashing
- Spec-driven development using OpenSpec for requirements management
