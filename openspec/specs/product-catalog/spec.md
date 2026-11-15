# product-catalog Specification

## Purpose

Provides browsing, searching, and detailed viewing of Philips personal care products with grouped specifications, gender segmentation, and category filtering.

## Requirements

### Requirement: Product listing
The system SHALL display a list of products showing name, brand, model number, image, average rating, review count, category, gender, and price range.

#### Scenario: Browse all products
- **WHEN** a user visits the product listing page
- **THEN** all products are displayed with name, brand, model, image, average rating, review count, category, and price range

#### Scenario: Empty catalog
- **WHEN** no products exist in the database
- **THEN** the listing page displays a message indicating no products are available

### Requirement: Product search
The system SHALL allow searching products by name, brand, or model number and return matching results.

#### Scenario: Search by name
- **WHEN** a user searches for "BT3211"
- **THEN** the results include products whose name or model contains "BT3211"

#### Scenario: No search results
- **WHEN** a user searches for a term that matches no products
- **THEN** the system displays a "no results found" message

### Requirement: Gender-based browsing
The system SHALL support filtering products by gender (men/women). Each product SHALL belong to a gender segment.

#### Scenario: Filter by gender
- **WHEN** a user selects "Men's Grooming"
- **THEN** only products tagged with the men gender are displayed

#### Scenario: Filter by gender and category
- **WHEN** a user selects "Men's Grooming" and then "Beard Trimmers"
- **THEN** only men's beard trimmer products are displayed

### Requirement: Category filtering
The system SHALL support filtering products by category. Categories include beard trimmers, multi-grooming kits, body groomers, electric shavers, hair dryers, hair straighteners, OneBlade, and hair clippers.

#### Scenario: Filter by category
- **WHEN** a user selects "Body Groomers"
- **THEN** only products in the body groomers category are displayed

#### Scenario: Category counts
- **WHEN** the category filter is displayed
- **THEN** each category shows the count of products it contains

### Requirement: Product detail with grouped specifications
The system SHALL display a product detail page showing all product information and specifications grouped by category (e.g. Battery, Blade, Build).

#### Scenario: View product detail
- **WHEN** a user navigates to a product detail page
- **THEN** the page displays the product name, brand, model, description, image, price range, and specifications grouped by category

#### Scenario: Unknown specification value
- **WHEN** a product has a specification with applicability UNKNOWN
- **THEN** the detail page displays that specification as "Unknown" — not as missing or as a disadvantage

#### Scenario: Not-applicable specification
- **WHEN** a product has a specification with applicability NOT_APPLICABLE
- **THEN** the detail page displays that specification as "N/A"

### Requirement: Specification source attribution
Each specification SHALL have a source and last-verified date. The detail page SHALL display this attribution.

#### Scenario: Specification with source
- **WHEN** a product specification is displayed on the detail page
- **THEN** the source and last-verified date are visible to the user

### Requirement: Price range display
Each product SHALL have an optional price range field. When present, the price range SHALL be displayed on listing cards and detail pages.

#### Scenario: Product with price range
- **WHEN** a product has a price range value
- **THEN** the price range is visible on the product card and detail page

#### Scenario: Product without price range
- **WHEN** a product has no price range value
- **THEN** no price information is displayed and the product is not treated as inferior

### Requirement: Seed data
The system SHALL be seeded with 18 real Philips personal care products across 8 categories (beard trimmers, multi-grooming kits, body groomers, electric shavers, hair dryers, hair straighteners, OneBlade, hair clippers) with gender tags, accurate sourced specifications, price ranges, box contents, technology highlights, and warranty information.

#### Scenario: Seeded catalog
- **WHEN** the seed script runs
- **THEN** 18 Philips products exist in the database with real specifications, gender tags, price ranges, box contents, highlights, warranty, and each spec having a source and last-verified date

#### Scenario: Gender distribution in seed data
- **WHEN** the seed data is loaded
- **THEN** products span both men's and women's categories

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
