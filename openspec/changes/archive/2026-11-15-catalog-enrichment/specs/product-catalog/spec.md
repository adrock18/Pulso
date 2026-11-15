# Spec Delta

## ADDED Requirements

### Requirement: What's in the box
Each product SHALL have an optional list of box contents. The product detail page SHALL display these as a visual grid when present.

#### Scenario: Product with box contents
- **WHEN** a user views a product detail page for a product with box contents
- **THEN** a "What's in the box" section displays each included item (e.g. "Trimmer body", "Precision comb", "USB cable")

#### Scenario: Product without box contents
- **WHEN** a product has no box contents data
- **THEN** the "What's in the box" section is not displayed

### Requirement: Technology highlights
Each product SHALL have an optional list of technology highlights (e.g. "BeardSense", "DualCut", "SkinIQ"). The product detail page SHALL display these as badges.

#### Scenario: Product with technology highlights
- **WHEN** a user views a product with technology highlights
- **THEN** the highlights are displayed as prominent badges near the product name

#### Scenario: Technology highlights on listing cards
- **WHEN** products are shown in the listing view
- **THEN** up to 2 technology highlights are visible on each product card

### Requirement: Warranty display
Each product SHALL have an optional warranty field. When present, it SHALL be displayed on the product detail page.

#### Scenario: Product with warranty
- **WHEN** a product has a warranty value (e.g. "2 years")
- **THEN** a warranty badge is visible on the product detail page

### Requirement: Recommendation percentage
The system SHALL compute and display the percentage of reviewers who gave a product 4 or 5 stars.

#### Scenario: Product with reviews
- **WHEN** a product has reviews and at least one is 4 or 5 stars
- **THEN** the product detail page displays "X% recommend this product"

#### Scenario: Product with no reviews
- **WHEN** a product has no reviews
- **THEN** no recommendation percentage is shown

### Requirement: Advanced catalog filters
The product listing SHALL support filtering by battery type, minimum runtime, washable status, and product series.

#### Scenario: Filter by battery type
- **WHEN** a user selects "Li-Ion" from the battery type filter
- **THEN** only products with a `battery_type` spec value of "Li-Ion" are displayed

#### Scenario: Filter by minimum runtime
- **WHEN** a user selects "60+ minutes" from the runtime filter
- **THEN** only products whose `battery_runtime_minutes` spec value is 60 or greater are displayed

#### Scenario: Filter by washable
- **WHEN** a user selects "Washable" from the filter
- **THEN** only products with a `washable` spec applicability of AVAILABLE are displayed

#### Scenario: Filter by series
- **WHEN** a user selects "Series 3000" from the filter
- **THEN** only products whose family name contains "3000" are displayed

#### Scenario: Combined filters
- **WHEN** a user applies gender, category, and battery type filters together
- **THEN** only products matching all selected filters are displayed

### Requirement: Expanded product categories
The catalog SHALL include OneBlade and Hair Clipper categories in addition to the existing 6 categories.

#### Scenario: OneBlade products
- **WHEN** a user browses the OneBlade category
- **THEN** OneBlade products are displayed with their unique spec keys (e.g. blade_replacement_months, dual_sided_blade)

#### Scenario: Hair Clipper products
- **WHEN** a user browses the Hair Clipper category
- **THEN** Hair Clipper products are displayed with their unique spec keys (e.g. cutting_lengths, motor_type)

## MODIFIED Requirements

### Requirement: Category filtering
The system SHALL support filtering products by category. Categories include beard trimmers, multi-grooming kits, body groomers, electric shavers, hair dryers, hair straighteners, OneBlade, and hair clippers.

#### Scenario: Filter by category
- **WHEN** a user selects "Body Groomers"
- **THEN** only products in the body groomers category are displayed

#### Scenario: Category counts
- **WHEN** the category filter is displayed
- **THEN** each category shows the count of products it contains

### Requirement: Seed data
The system SHALL be seeded with 18 real Philips personal care products across 8 categories (beard trimmers, multi-grooming kits, body groomers, electric shavers, hair dryers, hair straighteners, OneBlade, hair clippers) with gender tags, accurate sourced specifications, price ranges, box contents, technology highlights, and warranty information.

#### Scenario: Seeded catalog
- **WHEN** the seed script runs
- **THEN** 18 Philips products exist in the database with real specifications, gender tags, price ranges, box contents, highlights, warranty, and each spec having a source and last-verified date

#### Scenario: Gender distribution in seed data
- **WHEN** the seed data is loaded
- **THEN** products span both men's and women's categories
