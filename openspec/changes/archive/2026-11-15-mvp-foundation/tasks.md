# Tasks

## 1. Schema Update and Database Setup

- [x] 1.1 Update Prisma schema: add `gender String` and `priceRange String?` to Product, add `gender String?` to ProductFamily. Run `npx prisma validate` to confirm the schema is valid.
- [x] 1.2 Configure DATABASE_URL in `apps/api/.env` pointing to Neon. Run `npx prisma migrate dev --name init` to create the initial migration. Verify by confirming the migration file exists and the database tables are created.
- [x] 1.3 Update CLAUDE.md to reflect expanded scope: 12 products across 6 categories with gender segmentation, `gender` and `priceRange` fields in data model, community page route. Verify by reading the updated file and confirming new fields and product count are documented.

## 2. Seed Data

- [x] 2.1 Create the seed script at `scripts/seed.js` that populates 12 Philips personal care products matching the data in `apps/web/src/data/products.js`: 3 beard trimmers (BT3211, BT5515, BT9810), 3 multi-grooming kits (MG3730, MG5940, MG7745), 2 body groomers (BG3010, BG5020), 2 electric shavers (S1223, S5588), 1 hair dryer (BHD308), 1 hair straightener (BHS378). Create ProductFamily records, Product records with gender and priceRange, and Spec records with source and verifiedAt. Verify by running the seed and confirming 12 products with specs exist in the database.
- [x] 2.2 Seed demo serial numbers: 2 serials per product (24 total), stored as bcrypt hashes. Verify by running seed and confirming ProductSerial records exist.
- [x] 2.3 Seed an admin user (admin@productpulse.com, role ADMIN) and a demo user (user@productpulse.com, role USER). Verify by running seed and confirming both users exist with correct roles.
- [x] 2.4 Seed 6–8 demo reviews across products with varied ratings, retailers, anonymity choices, and verification statuses. Update denormalized avgRating/reviewCount/verifiedReviewCount on each reviewed product in the same seed transaction. Verify by confirming reviews exist with correct labels and product rating summaries are accurate.

## 3. Product Catalog API

- [x] 3.1 Implement `GET /api/products` endpoint with optional query params: `?q=` (search by name/brand/model, case-insensitive), `?gender=` (filter), `?category=` (filter). Returns product list with id, name, brand, model, image, gender, category, priceRange, avgRating, reviewCount, verifiedReviewCount. Add Zod validation for query params. Verify by calling with and without filters and confirming correct results.
- [x] 3.2 Implement `GET /api/products/:id` endpoint. Returns full product detail including specs grouped by category, with applicability state, source, and verifiedAt for each spec. Returns 404 for non-existent ID. Add Zod validation for the ID param. Verify by calling with a valid ID (grouped specs returned) and an invalid ID (404 returned).
- [x] 3.3 Wire ProductsPage: replace `PRODUCTS` import and client-side filtering with `GET /api/products` API calls. Server handles search, gender, and category filtering. Client keeps sort order and view-mode (grid/list) state. Add loading and error states. Verify by loading the page, seeing 12 products, and confirming search and filter controls work against the API.
- [x] 3.4 Wire ProductDetailPage: replace `PRODUCTS.find()` with `GET /api/products/:id`. Render grouped specs, source attribution, and price range from API data. Add loading and error states. Verify by navigating to a product and confirming specs, source attribution, and "Product Not Found" for invalid IDs work.

## 4. Dynamic Comparison Engine

- [x] 4.1 Implement `comparisonService` in `apps/api/src/services/comparisonService.js`. Accepts two product IDs, fetches both with specs, matches specs by canonical key, groups by category, computes `isDifferent` for each spec row, handles AVAILABLE/UNKNOWN/NOT_APPLICABLE, includes rating summaries. Returns the structured response shape from design.md. Returns error for missing product IDs or same-product comparison. Verify with unit tests: matching keys aligned, missing keys shown, applicability states handled, differences flagged, same-ID rejected.
- [x] 4.2 Implement `GET /api/comparison?a=:idA&b=:idB` endpoint. Validates both IDs with Zod, delegates to comparisonService, returns structured comparison or appropriate error (400 for same ID, 404 for missing product). Verify by calling with valid IDs (structured comparison returned), same ID (400), and non-existent ID (404).
- [x] 4.3 Wire ComparePage: remove the client-side `buildComparison()` function. Replace with `GET /api/comparison?a=...&b=...` API call. Product selector dropdowns fetch options from `GET /api/products`. Keep the existing visual spec bars and diff highlighting — they consume the structured API response. Add loading state. Verify by selecting two products and confirming the comparison renders with correct grouping, highlighting, and applicability labels from the API.
- [x] 4.4 Verify product swapping: changing either dropdown re-fetches the comparison from the API without page reload. Prevent selecting the same product on both sides. Verify by selecting Product A and B, then swapping Product B for Product C — comparison updates in-place.

## 5. Authentication

- [x] 5.1 Implement auth utilities: password hashing with bcryptjs, JWT sign/verify functions using JWT_SECRET from env, Zod schemas for register and login input. Verify with unit tests: hash + compare round-trips, JWT sign + verify round-trips, Zod rejects invalid input.
- [x] 5.2 Implement `POST /api/auth/register` endpoint. Validates input with Zod, checks for duplicate email, hashes password, creates User, returns JWT. Verify by registering a new user (JWT returned), registering with duplicate email (error), and registering with invalid input (validation errors).
- [x] 5.3 Implement `POST /api/auth/login` endpoint. Validates input, looks up user by email, compares password hash, returns JWT on success. Returns identical error message for wrong password and non-existent email. Verify by logging in with correct credentials (JWT), wrong password (auth error), and non-existent email (same auth error).
- [x] 5.4 Implement auth middleware (`requireAuth`, `requireAdmin`) that extracts and verifies JWT from Authorization header. `requireAuth` attaches user to request or returns 401. `requireAdmin` additionally checks role === ADMIN or returns 403. Implement `GET /api/auth/me` behind `requireAuth`. Verify by calling /me with valid token (profile returned), expired token (401), no token (401).
- [x] 5.5 Wire auth pages and add auth context: create an auth context/provider that tracks current user, exposes login/logout/register functions, and loads user on mount via `GET /api/auth/me`. Wire LoginPage form to `POST /api/auth/login` and RegisterPage form to `POST /api/auth/register`. On success, store JWT in localStorage and redirect to home. Update nav bar to show user name + logout when logged in, login/register when logged out. Verify by registering, logging in, seeing user name in nav, logging out, and confirming protected state resets.

## 6. Reviews + Serial Verification

- [x] 6.1 Implement `POST /api/verification` endpoint (requireAuth). Accepts a serial string, hashes it, looks up match in ProductSerial, checks not claimed, atomically sets claimed=true and creates UserProduct link. Returns the verified product info. Returns error for invalid/claimed serial. Add Zod validation. Verify by submitting a valid unclaimed serial (UserProduct created, serial marked claimed), resubmitting same serial (error), and submitting invalid serial (error).
- [x] 6.2 Implement `GET /api/user-products` endpoint (requireAuth). Returns the authenticated user's verified products. Verify by calling after verification (list includes verified product) and with a user who has none (empty list).
- [x] 6.3 Implement `POST /api/reviews` endpoint (requireAuth). Validates with Zod: productId required, overallRating 1–5 required, aspect ratings optional integers 1–5, isAnonymous boolean, retailer from known list, optional serial string. Enforces one review per user per product via unique constraint. If serial provided, runs verification inline (hash, lookup, claim) and sets isVerified + links UserProduct. Updates denormalized rating fields on Product in the same transaction. Verify by submitting a review with serial (verified label), without serial (unverified), duplicate attempt (rejected), and invalid input (validation errors).
- [x] 6.4 Implement `GET /api/products/:id/reviews` endpoint (public). Returns reviews for a product with display name or "Anonymous" based on isAnonymous, "Verified Purchase" label based on isVerified, all rating and text fields. Excludes serial numbers and user emails from response. Verify by calling for a product with mixed reviews and confirming correct labels, no private data exposed.
- [x] 6.5 Implement `PUT /api/reviews/:id` endpoint (requireAuth, owner only). Allows updating review content, anonymity toggle, and ratings. Recalculates denormalized product ratings in the same transaction. Returns 403 if user is not the review owner. Verify by editing own review (updated), editing another user's review (403).
- [x] 6.6 Wire review submission form on ProductDetailPage. Show form only when user is logged in (using auth context). Include all fields: overall rating (required), aspect ratings (optional), positive/negative text, purchase date, retailer dropdown (known list), anonymity toggle (default anonymous), optional serial number input. Submit to `POST /api/reviews`. Show success/error feedback. Verify by submitting a review while logged in and confirming it appears in the review list.
- [x] 6.7 Wire review list on ProductDetailPage: fetch from `GET /api/products/:id/reviews` instead of filtering static DEMO_REVIEWS. Display each review with correct "Anonymous" or display name, "Verified Purchase" label when applicable, ratings, text, retailer. Show edit button only on the user's own review (via auth context). Verify by viewing a product page with mixed reviews and confirming all label combinations render correctly.

## 7. Product Analytics

- [x] 7.1 Implement `GET /api/analytics/products/:id` endpoint (public). Returns rating distribution (count per star 1–5), aspect averages (null for aspects with no data), total review count, verified count, unverified count. Verify by calling for a product with reviews and confirming correct distribution and averages; calling for a product with no reviews and confirming zeros/nulls.
- [x] 7.2 Implement `GET /api/analytics/trends` endpoint (requireAdmin). Returns all products with trend indicators based on recent review volume and average rating direction. Verify by calling as admin (trends returned), as non-admin user (403), and unauthenticated (401).
- [x] 7.3 Build product analytics section on ProductDetailPage using Recharts. Fetch from `GET /api/analytics/products/:id`. Show rating distribution as a bar chart, aspect averages as a bar chart, and verified/unverified counts. Verify by viewing a product with reviews and confirming charts render with correct data.
- [x] 7.4 Build admin trends page at `/admin/trends` (only accessible when logged in as admin). Add route to App.jsx. Fetch from `GET /api/analytics/trends`. Display all products with trend indicators. Redirect non-admin users. Verify by logging in as admin and seeing trend data; logging in as regular user and being redirected.

## 8. Community Page Wiring

- [x] 8.1 Wire CommunityPage: replace static `getAllReviews()` and `PRODUCTS` imports with API calls. Fetch recent reviews across products (aggregate from per-product review endpoints or add a dedicated `GET /api/reviews/recent` endpoint). Compute stats from API data. Keep the existing All/Verified/Most Helpful filter tabs working against fetched data. Verify by loading the community page and confirming reviews, stats sidebar, and filter tabs work with live data.

## 9. Deploy

- [x] 9.1 Prepare the project for deployment: verify build scripts in both web and api package.json, configure Vite build output, configure Express to serve in production mode with appropriate CORS and env settings. Ensure `.gitignore` covers node_modules, .env, and build artifacts. Verify by running build in both apps without errors.
- [ ] 9.2 Deploy the backend to Render as a Web Service and the frontend to Render as a Static Site. Configure environment variables on Render (DATABASE_URL, JWT_SECRET, CLIENT_URL for backend; VITE_API_BASE_URL for frontend build). Run Prisma migrations and seed on the deployed database. Verify by accessing the deployed frontend URL and confirming it loads and communicates with the backend API.
- [x] 9.3 Write a README.md with: project overview, tech stack, local setup instructions (clone, install, env config, db setup, seed, run), demo walkthrough (key user flows to try), and known limitations. Verify by following the setup instructions from scratch on a clean environment.

## Workflow follow-up

- Archive the change after all tasks are complete and reviewed.
- Verify the archived specs match the implemented behavior.
