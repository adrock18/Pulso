# dynamic-comparison Specification

## Purpose

Enables dynamic side-by-side comparison of any two products by matching specifications through canonical keys, with instant product swapping.

## Requirements

### Requirement: Compare any two products
The system SHALL accept two product IDs and return a structured comparison of their specifications, matched by canonical key and grouped by category. The two products MUST belong to the same product category.

#### Scenario: Valid same-category comparison
- **WHEN** a user selects two products from the same category (e.g. two beard trimmers)
- **THEN** the system returns the comparison with animated spec reveals and an exploded product view

#### Scenario: Cross-category comparison blocked
- **WHEN** a user selects Product A from beard trimmers and tries to select Product B from hair dryers
- **THEN** the Product B selector only shows products from the same category as Product A

#### Scenario: Category-filtered product selector
- **WHEN** Product A is selected
- **THEN** the Product B dropdown filters to show only products in the same category, with a label indicating the filter (e.g. "Showing beard trimmers only")

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
The frontend SHALL allow the user to replace either product in the comparison with a smooth crossover animation.

#### Scenario: Swap products with animation
- **WHEN** a user clicks the swap button between the two products
- **THEN** Product A and Product B cards animate to cross positions (A moves right, B moves left) and the comparison reloads

#### Scenario: Change one product
- **WHEN** a user changes one of the two products in the comparison selector
- **THEN** the new product slides in from the edge while the comparison data fades and reloads

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

### Requirement: Animated exploded product view
When a comparison loads, each product SHALL display an animated exploded view showing its component parts derived from the product's box contents data.

#### Scenario: Exploded view on load
- **WHEN** a comparison between two products loads successfully
- **THEN** each product's image animates apart into labeled component parts (e.g. "Blade", "Handle", "Comb") using spring-based animations over ~1.5 seconds

#### Scenario: Parts map to spec groups
- **WHEN** the exploded view is displayed
- **THEN** each visible part connects visually to its related spec category (e.g. the blade part highlights when hovering the Blade spec group)

#### Scenario: Reduced motion preference
- **WHEN** the user has `prefers-reduced-motion: reduce` set
- **THEN** the exploded view displays the parts in their final positions immediately without animation

#### Scenario: Product without box contents
- **WHEN** a product has no box contents data
- **THEN** the product image is displayed normally without an exploded view

### Requirement: Spec reveal animations
Specification groups SHALL animate into view sequentially when a comparison loads, with numeric values showing animated bar growth.

#### Scenario: Sequential category reveal
- **WHEN** comparison data loads
- **THEN** spec categories appear one at a time with a staggered slide-in animation (each category ~100ms after the previous)

#### Scenario: Animated spec bars
- **WHEN** a numeric spec is displayed (e.g. battery runtime)
- **THEN** the comparison bar grows from zero to its value with spring physics over ~600ms

#### Scenario: Difference highlighting
- **WHEN** two specs have different values
- **THEN** the difference row shows a brief pulse glow animation on load, and the better value gets a subtle winner indicator

### Requirement: Head-to-head verdict
The comparison SHALL display a summary verdict card showing which product wins in each spec category.

#### Scenario: Verdict card display
- **WHEN** a comparison is loaded
- **THEN** a verdict section shows each category with a winner indicator (Product A or Product B), the number of specs each product wins, and an overall score

#### Scenario: Tied category
- **WHEN** two products have identical values in every spec of a category
- **THEN** the verdict shows that category as a tie

#### Scenario: Verdict with unknown specs
- **WHEN** one product has UNKNOWN specs in a category
- **THEN** the unknown specs are not counted toward either product's wins
