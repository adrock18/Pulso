# Spec Delta

## Purpose

Provides browsing, searching, and detailed viewing of Philips personal care products with grouped specifications, gender segmentation, and category filtering.

## ADDED Requirements

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
The system SHALL support filtering products by category. Categories include beard trimmers, multi-grooming kits, body groomers, electric shavers, hair dryers, and hair straighteners.

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
The system SHALL be seeded with 12 real Philips personal care products across 6 categories (beard trimmers, multi-grooming kits, body groomers, electric shavers, hair dryers, hair straighteners) with gender tags, accurate sourced specifications, and price ranges.

#### Scenario: Seeded catalog
- **WHEN** the seed script runs
- **THEN** 12 Philips products exist in the database with real specifications, gender tags, price ranges, and each spec having a source and last-verified date

#### Scenario: Gender distribution in seed data
- **WHEN** the seed data is loaded
- **THEN** products span both men's and women's categories
