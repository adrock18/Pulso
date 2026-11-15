# Design

## Context

Pulso has 12 products with grouped specs, a working comparison engine, reviews, and analytics. The Philips India website reveals data gaps: no box contents, no technology badges, no warranty info, no spec-based filters, and missing product categories (OneBlade, Hair Clippers). This change enriches the existing catalog without restructuring it. See proposal.md for scope.

## Goals / Non-Goals

**Goals:**
- Enrich the Product model with new fields without breaking existing pages
- Add server-side spec-based filters without changing the existing filter contract
- Seed 6 new products in 2 new categories using the established seed pattern
- Show new data on product detail and listing pages

**Non-Goals:**
- E-commerce features (buy links, cart)
- Multiple product images
- User manuals or FAQ per product
- Rebuilding the filter UI from scratch

## Decisions

### 1. Store highlights and boxContents as JSON strings in Prisma

**Decision:** Add `warranty String?`, `highlights String?` (JSON array), and `boxContents String?` (JSON array) to the Product model. Parse on read in the service layer.

**Why over alternative (separate tables):** These are small, read-only lists that always load with the product. A separate `ProductHighlight` or `BoxItem` table adds joins for no benefit. JSON columns avoid schema complexity for denormalized display data.

**Prisma changes:**
```prisma
model Product {
  // ... existing fields ...
  warranty     String?   // e.g. "2 years"
  highlights   String?   // JSON: ["BeardSense", "DualCut"]
  boxContents  String?   // JSON: ["Trimmer body", "Precision comb", "USB cable"]
}
```

### 2. Advanced filters via spec-value queries

**Decision:** The advanced filters (battery type, runtime, washable) query the Spec table joined through Product, not new Product columns. This avoids denormalizing spec data onto Product.

**API extension to `GET /api/products`:**
```
?batteryType=Li-Ion        → Spec WHERE key='battery_type' AND value='Li-Ion'
?runtimeMin=60             → Spec WHERE key='battery_runtime_minutes' AND CAST(value AS int) >= 60
?washable=true             → Spec WHERE key='washable' AND applicability='AVAILABLE'
?series=3000               → ProductFamily WHERE name CONTAINS '3000'
```

**Why spec-join (not Product columns):** Battery type and runtime are already stored as Spec records. Denormalizing them onto Product would duplicate data and require sync. Prisma supports `some` relation filters on Spec.

### 3. Recommendation percentage computed at read time

**Decision:** Compute `recommendationPct` (percentage of 4+ star reviews) in the analytics service or inline in the product detail response. Not stored as a column.

**Why:** It changes every time a review is added. Computing on read from the denormalized `reviewCount` and a simple query is cheap at this scale.

### 4. New product categories added to static data

**Decision:** Add `oneblade` and `hair-clipper` to the `CATEGORIES` array in `apps/web/src/data/products.js`. No database migration needed — `category` is a string on ProductFamily.

### 5. OneBlade and Hair Clipper spec keys

**OneBlade** introduces: `blade_replacement_months`, `dual_sided_blade`, `click_on_combs`, `use_on_body`.
**Hair Clipper** introduces: `cutting_lengths`, `motor_type`, `hair_clipper_comb`, `cordless_use`.

These are new canonical keys in the existing Spec table — no schema change needed.

## Risks / Trade-offs

- **[JSON columns lose query-ability]** → Acceptable: highlights and boxContents are never filtered or sorted, only displayed. If filtering by technology is needed later, a separate table can be added.
- **[Spec-join filters are slower than column filters]** → At 18 products this is negligible. Index on `[key, value]` would help at scale.
- **[6 new products increase seed time]** → Marginal: bcrypt serials are the bottleneck, adding 12 more serials adds ~2 seconds.
