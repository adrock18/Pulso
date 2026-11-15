# Proposal

## Why

Comparing Pulso's 12 products against the Philips India website reveals gaps in data richness, product range, and filtering. Philips lists ~90 products across 12 categories with data like "what's in the box", technology badges (BeardSense, DualCut), warranty info, recommendation percentages, and spec-driven filters (runtime range, battery type, precision level). Pulso has none of these. Closing the most impactful gaps makes the catalog feel like a real product intelligence tool rather than a thin demo.

## What Changes

- **Product model enrichment**: Add `warranty`, `highlights` (technology badges), and `boxContents` (what's in the box) fields to Product. Populate for all 12 existing products from Philips source data.
- **New spec keys**: Add `charging_indicator`, `quick_charge_minutes`, `precision_step_mm`, `beard_sense`, `intimate_comb`, `click_on_combs`. Populate where applicable.
- **Advanced catalog filters**: Server-side filtering by battery type, runtime range, washable, and series. Frontend filter UI in the sidebar.
- **Product detail enrichment**: "What's in the box" section, technology badges, warranty badge, recommendation percentage display.
- **Seed 6 new products** in 2 missing categories: OneBlade (3 models) and Hair Clippers (3 models) — the two largest gaps vs Philips India.

## Out of Scope

- Epilators, IPL, Air Stylers (women's categories beyond current scope)
- Buy/price tracking or e-commerce links
- User manuals / FAQ sections
- Product image galleries (multiple images per product)
- The remaining ~70 Philips models (incremental future work)

## Capabilities

### New Capabilities
_None — this enriches existing capabilities._

### Modified Capabilities
- `product-catalog`: Add new product fields (warranty, highlights, boxContents), advanced filters (battery type, runtime range, washable, series), 6 new products in 2 new categories, and enriched product detail page sections.

## Impact

- **Data model**: Product gains `warranty` (String?), `highlights` (String[], stored as JSON), `boxContents` (String[], stored as JSON). New spec keys added to seed data.
- **API**: `GET /api/products` gains filter params: `batteryType`, `runtimeMin`, `washable`, `series`. `GET /api/products/:id` response includes new fields.
- **Frontend**: ProductDetailPage adds "What's in the box" grid, technology badges, warranty badge. ProductsPage sidebar adds 4 new filter sections.
- **Seed**: 6 new products (3 OneBlade, 3 Hair Clippers) with full specs. Existing 12 products gain boxContents, highlights, warranty.
