# Architecture

## System Overview

```
+------------------------------------------------------------------+
|                         CLIENT BROWSER                           |
+------------------------------------------------------------------+
           |                                          |
           v                                          v
+---------------------+                  +-------------------------+
|    REACT FRONTEND   |   HTTP/JSON      |    EXPRESS BACKEND      |
|    (Render Static)  | ---------------> |    (Render Web Service) |
+---------------------+                  +-------------------------+
| Vite + Tailwind v4  |                  | Helmet + CORS           |
| React Router        |   /api/*         | Rate Limiting           |
| shadcn/ui           |                  | Zod Validation          |
| Recharts            |                  | JWT Auth                |
+---------------------+                  +-------+--------+--------+
                                                 |        |
                                          +------+  +-----+------+
                                          |         |            |
                                    +-----v---+ +---v------+ +--v-------+
                                    | Prisma  | | bcryptjs | | jsonweb- |
                                    |  ORM    | | (hashing)| | token    |
                                    +----+----+ +----------+ +----------+
                                         |
                                    +----v-----------+
                                    |  PostgreSQL    |
                                    |  (Neon Cloud)  |
                                    +----------------+
```

## Request Lifecycle

```
User Action --> React Component --> API Client (fetch + JWT)
                                        |
                                        v
                                  Express Router
                                        |
                                        v
                                  Middleware Chain:
                                    1. Helmet (security headers)
                                    2. CORS (origin check)
                                    3. Rate Limit (throttle)
                                    4. JSON Parser (body)
                                    5. Auth (JWT verify, if protected)
                                        |
                                        v
                                  Controller (validate with Zod)
                                        |
                                        v
                                  Service (business logic)
                                        |
                                        v
                                  Prisma (database query)
                                        |
                                        v
                                  Response --> JSON --> React State --> UI
```

## Project Structure

```
pulso/
+-- package.json              Root workspace config
+-- apps/
|   +-- web/                  FRONTEND
|   |   +-- src/
|   |   |   +-- components/   Shared UI (shadcn/ui)
|   |   |   +-- pages/        Route-level views
|   |   |   +-- services/     API client layer
|   |   |   +-- App.jsx       Router + layout
|   |   +-- vite.config.js    Dev server + API proxy
|   |
|   +-- api/                  BACKEND
|       +-- src/
|       |   +-- controllers/  Request handlers
|       |   +-- services/     Business logic
|       |   +-- middleware/    Auth, validation
|       |   +-- routes/       Express routes
|       |   +-- validators/   Zod schemas
|       |   +-- server.js     Entry point
|       +-- prisma/
|           +-- schema.prisma Data model
+-- docs/                     This file
+-- scripts/                  Seed data
```

## Data Model

```
+----------------+       +------------------+       +--------------+
| ProductFamily  |       |     Product      |       |    Spec      |
+----------------+       +------------------+       +--------------+
| id             |<------| familyId         |------>| productId    |
| name           |  1:N  | name             |  1:N  | key (canon.) |
| brand          |       | model            |       | value        |
| category       |       | avgRating *      |       | unit         |
+----------------+       | reviewCount *    |       | category     |
                         | verifiedCount *  |       | applicability|
                         +------------------+       | source       |
                               |    |               | verifiedAt   |
                               |    |               +--------------+
                          1:N  |    |  1:N
                               |    |
                    +----------+    +----------+
                    v                          v
             +-------------+           +---------------+
             |   Review    |           | ProductSerial |
             +-------------+           +---------------+
             | productId   |           | hashedSerial  |
             | userId      |           | productId     |
             | isAnonymous |           | claimed       |
             | overallRating|          +-------+-------+
             | aspectRatings|                  |
             | isVerified  |                   | 1:1
             | retailer    |                   v
             +------+------+           +---------------+
                    |                  | UserProduct   |
                    |                  +---------------+
                    v                  | userId        |
              +-----------+            | serialId      |
              |   User    |            | productId     |
              +-----------+            +---------------+
              | name      |
              | email     |
              | password  |
              | role      |
              +-----------+

  * = denormalized, updated in same transaction as review writes
```

## Core Feature: Comparison Engine

The comparison engine matches product specifications by canonical string keys, enabling dynamic comparison of any two products without hardcoded pairs.

```
INPUT: productId_A, productId_B
         |
         v
+------------------+
| Fetch both       |
| products + specs |
+--------+---------+
         |
         v
+------------------+
| Build spec map   |  Product A: { battery_runtime: 60, blade_count: 1 }
| by canonical key |  Product B: { battery_runtime: 90, blade_count: 3 }
+--------+---------+
         |
         v
+------------------+
| Union all keys,  |  Battery: [runtime, charging_time]
| group by spec    |  Blade: [blade_count, blade_type]
| category         |  Build: [weight, material]
+--------+---------+
         |
         v
+------------------+
| For each spec:   |
| - Align A vs B   |  AVAILABLE  --> show value
| - Handle states  |  UNKNOWN    --> "Unknown" (not blank)
| - Flag diffs     |  N/A        --> "N/A" (not a disadvantage)
+--------+---------+
         |
         v
  { productA, productB, categories: [{ name, specs }] }
```

## Authentication

```
REGISTER                          LOGIN
--------                          -----
Name + Email + Password           Email + Password
         |                                |
         v                                v
  Zod validates input              Zod validates input
         |                                |
         v                                v
  Check email unique               Find user by email
         |                                |
         v                                v
  bcrypt.hash(password)            bcrypt.compare(password, hash)
         |                                |
         v                                v
  Create User in DB                Generate JWT on match
         |                                |
         v                                v
  Generate + return JWT            Return { token, user }

JWT PAYLOAD: { userId, role, iat, exp }

PROTECTED ROUTE:
  Request --> Extract Bearer token --> jwt.verify --> Attach user --> Controller
  Missing/invalid token --> 401
  Wrong role --> 403
```

## Review Identity Model

Anonymity and verification are orthogonal concerns:

```
  Anonymity (display preference)     Verification (serial check)
  +-- Anonymous                      +-- Verified Purchase
  +-- Show name                      +-- Unverified

  These combine independently in public display:
    "Anonymous -- Verified Purchase"
    "Anonymous"
    "Rahul M. -- Verified Purchase"
    "Rahul M."

  The system always stores the real userId.
  Admin can always see who wrote any review.
```

## Security

```
+-- Frontend (no secrets) --+     +-- Backend (enforces all) --------+
|                           |     |                                   |
| - Display-only access     |     | - Zod validates ALL input        |
|   controls (not security) |     | - JWT verified on protected routes|
| - JWT in localStorage     |     | - Role checked for admin endpoints|
| - Auth header on requests |     | - Passwords hashed (bcryptjs)    |
+---------------------------+     | - Serials hashed (bcryptjs)      |
                                  | - No serials/emails in public API|
                                  | - Rate limiting on all endpoints |
                                  | - CORS + Helmet headers          |
                                  +-----------------------------------+
```

## Design Decisions

| Decision | Choice | Why | Alternative Rejected |
|----------|--------|-----|---------------------|
| Architecture | React + Express (not Next.js) | Clear client-server separation. Explicit HTTP calls. Each concern is independently demonstrable | Next.js blurs client/server boundary |
| Database | PostgreSQL + Prisma (not MongoDB) | Deeply relational data: products, families, specs, reviews with complex joins. SQL aggregations for analytics | MongoDB `$lookup` pipelines for relational data |
| Auth | JWT + bcryptjs (not sessions/OAuth) | Stateless, no session store. Token carries userId + role. Simple to implement and reason about | Session store adds infrastructure; OAuth adds third-party dependency |
| Validation | Zod | Composable schemas, clear error messages. Works on both client and server | Joi/Yup lack TypeScript-first design |
| UI Components | shadcn/ui (not MUI/Chakra) | You own the source code. Tailwind-native. Professional look without identifiable template aesthetic | MUI brings Emotion, bundle size, and "Material" look |
| Spec storage | Canonical key table (not JSON column) | Enables dynamic comparison via key matching. Indexable, enforceable uniqueness, queryable | JSON column: no uniqueness, complex comparison queries |
| Serial hashing | bcrypt (not SHA-256) | Short predictable serial space. SHA-256 is fast enough to brute-force. bcrypt adds cost per attempt | SHA-256 too fast for small keyspace |
| Ratings | Denormalized on Product (not computed) | Product listing avoids aggregation joins. Updated atomically with review writes | Computing on read: N+1 queries on every list render |
| Hosting | Render + Neon (not AWS/Vercel) | Single platform for frontend + backend. Free tier. Zero-config Postgres | AWS too complex; Vercel + separate backend = two platforms |
