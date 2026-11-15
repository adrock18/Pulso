# Spec Delta

## Purpose

Enables dynamic side-by-side comparison of any two products by matching specifications through canonical keys, with instant product swapping.

## ADDED Requirements

### Requirement: Compare any two products
The system SHALL accept two product IDs and return a structured comparison of their specifications, matched by canonical key and grouped by category.

#### Scenario: Valid comparison
- **WHEN** a user selects two valid product IDs for comparison
- **THEN** the system returns both products' details with their specifications aligned by canonical key, grouped into categories (e.g. Battery, Blade, Build)

#### Scenario: Invalid product ID
- **WHEN** a user requests a comparison with a product ID that does not exist
- **THEN** the system returns an error indicating the product was not found

#### Scenario: Same product compared to itself
- **WHEN** a user selects the same product for both sides of the comparison
- **THEN** the system returns an error or prevents the comparison

### Requirement: Canonical key matching
The comparison engine SHALL match specifications across products using canonical string keys (e.g. `battery_runtime_minutes`), not by display name or position.

#### Scenario: Matching keys across products
- **WHEN** Product A has spec key `battery_runtime_minutes` = "60" and Product B has the same key = "90"
- **THEN** the comparison aligns these as the same specification and shows both values side by side

#### Scenario: Spec exists on one product only
- **WHEN** Product A has a spec key that Product B does not have
- **THEN** the comparison shows the value for Product A and indicates the spec is absent for Product B

### Requirement: Three-state applicability handling
The comparison SHALL distinguish AVAILABLE, UNKNOWN, and NOT_APPLICABLE states for each specification. Missing information MUST NOT be interpreted as a disadvantage.

#### Scenario: Unknown spec in comparison
- **WHEN** one product's spec has applicability UNKNOWN
- **THEN** the comparison displays "Unknown" for that cell — not blank, not "worse"

#### Scenario: Not-applicable spec in comparison
- **WHEN** one product's spec has applicability NOT_APPLICABLE
- **THEN** the comparison displays "N/A" for that cell

### Requirement: Highlight differences
The comparison SHALL identify and visually highlight specifications where the two products differ.

#### Scenario: Differing values
- **WHEN** two products have the same canonical key but different values
- **THEN** the comparison visually marks that row as a difference

#### Scenario: Matching values
- **WHEN** two products have the same canonical key and the same value
- **THEN** the comparison does not mark that row as a difference

### Requirement: Product swapping
The frontend SHALL allow the user to replace either product in the comparison without a full page reload.

#### Scenario: Swap one product
- **WHEN** a user changes one of the two products in the comparison selector
- **THEN** the comparison updates to reflect the new product pairing without navigating away from the page

### Requirement: Include rating context
The comparison response SHALL include each product's average rating and review count alongside the spec comparison.

#### Scenario: Comparison with ratings
- **WHEN** a comparison is returned
- **THEN** each product includes its average rating and total review count

### Requirement: No hardcoded pairs
The comparison engine MUST NOT contain hardcoded product pairs or predefined comparison tables.

#### Scenario: Dynamic pairing
- **WHEN** a new product is added to the catalog via seed data
- **THEN** the comparison engine can compare it with any existing product without code changes
