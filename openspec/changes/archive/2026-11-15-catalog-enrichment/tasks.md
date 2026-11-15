# Tasks

## 1. Schema and Data Model

- [x] 1.1 Update Prisma schema: add `warranty String?`, `highlights String?`, and `boxContents String?` to Product. Run `npx prisma validate` to confirm schema is valid.
- [x] 1.2 Run `npx prisma migrate dev --name catalog-enrichment` to apply the migration. Verify the migration file exists and tables are updated.

## 2. Seed Data Enrichment

- [x] 2.1 Research Philips India product pages for the 12 existing products. For each, collect: box contents list, technology highlights, and warranty info from philips.co.in. Document findings before updating seed.
- [x] 2.2 Update `scripts/seed.js` to populate `warranty`, `highlights` (JSON array), and `boxContents` (JSON array) for all 12 existing products. Add new spec keys where applicable: `charging_indicator`, `quick_charge_minutes`, `precision_step_mm`, `beard_sense`, `intimate_comb`, `click_on_combs`. Verify by running seed and confirming new fields are populated.
- [x] 2.3 Add 3 OneBlade products to the seed script: OneBlade First Shave (QP1624/10), OneBlade (QP2724/10), OneBlade Pro (QP6651/61). Create ProductFamily records (category: `oneblade`, gender: `men`). Include full specs with OneBlade-specific keys: `blade_replacement_months`, `dual_sided_blade`, `click_on_combs`, `use_on_body`. Include boxContents, highlights, warranty. Add 2 serials per product. Verify by running seed and confirming 3 OneBlade products with specs exist.
- [x] 2.4 Add 3 Hair Clipper products to the seed script: Hair Clipper Series 3000 (HC3520/15), Hair Clipper Series 5000 (HC5632/15), Hair Clipper Series 7000 (HC7650/15). Create ProductFamily records (category: `hair-clipper`, gender: `men`). Include full specs with clipper-specific keys: `cutting_lengths`, `motor_type`, `hair_clipper_comb`, `cordless_use`. Include boxContents, highlights, warranty. Add 2 serials per product. Verify by running seed and confirming 3 Hair Clipper products with specs exist.
- [x] 2.5 Add product images for the 6 new products to `apps/web/public/products/`. Use placeholder images or download from philips.co.in. Verify images load in the browser.

## 3. Backend API Updates

- [x] 3.1 Update `productService.listProducts()` to accept new filter params: `batteryType` (string), `runtimeMin` (number), `washable` (boolean), `series` (string). Implement spec-join filters using Prisma `some` relation queries. Verify by calling `GET /api/products?batteryType=Li-Ion` and confirming only Li-Ion products return.
- [x] 3.2 Update `productService.getProductById()` to parse and include `warranty`, `highlights` (parsed from JSON), and `boxContents` (parsed from JSON) in the response. Add `recommendationPct` computed from reviews (percentage of 4+ star reviews). Verify by calling `GET /api/products/:id` and confirming new fields appear.
- [x] 3.3 Update product Zod validators to accept the new query params. Verify with invalid params (e.g. `runtimeMin=abc`) returning 400.
- [x] 3.4 Update the `CATEGORIES` array in `apps/web/src/data/products.js` to include `{ id: 'oneblade', label: 'OneBlade', gender: 'men', icon: '⚡' }` and `{ id: 'hair-clipper', label: 'Hair Clippers', gender: 'men', icon: '💇' }`. Verify categories show in nav dropdowns and sidebar.

## 4. Frontend — Product Detail Enrichment

- [x] 4.1 Add "What's in the box" section to ProductDetailPage. Show a visual grid of included items when `boxContents` is present. Style as a card grid with icons or simple text badges. Verify by viewing a product with box contents data.
- [x] 4.2 Add technology highlight badges to ProductDetailPage. Display near the product name as colored badges (e.g. "BeardSense", "DualCut"). Verify by viewing a product with highlights.
- [x] 4.3 Add warranty badge to ProductDetailPage. Show as a shield icon with warranty text (e.g. "2-year warranty"). Verify by viewing a product with warranty data.
- [x] 4.4 Add recommendation percentage to ProductDetailPage. Fetch from the analytics API or compute from review data. Display as "X% recommend this product" near the rating. Verify by viewing a product with reviews.

## 5. Frontend — Advanced Filters

- [x] 5.1 Add battery type filter to ProductsPage sidebar. Populate options from a static list: Li-Ion, Ni-MH. Send `batteryType` param to API. Verify filter works.
- [x] 5.2 Add runtime range filter to ProductsPage sidebar. Options: "30+ min", "60+ min", "90+ min". Send `runtimeMin` param to API. Verify filter works.
- [x] 5.3 Add washable filter to ProductsPage sidebar. Toggle or checkbox. Send `washable=true` param to API. Verify filter works.
- [x] 5.4 Add series filter to ProductsPage sidebar. Populate from a static list based on product families (1000, 3000, 5000, 7000, 9000). Send `series` param to API. Verify filter works.

## 6. Testing

- [x] 6.1 Add Playwright tests for new features: "What's in the box" section visible on detail page, technology badges visible, advanced filters filter correctly, OneBlade and Hair Clipper categories navigable. Run full suite and verify all tests pass.
- [x] 6.2 Run the existing 24 smoke tests to confirm no regressions. Verify 36/36 pass (24 original + 12 new).

## Workflow follow-up

- Archive the change after all tasks are complete and reviewed.
