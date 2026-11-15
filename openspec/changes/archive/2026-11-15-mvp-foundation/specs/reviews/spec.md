# Spec Delta

## Purpose

Enables authenticated users to submit, view, and edit product reviews with an anonymity toggle and optional serial-based purchase verification.

## ADDED Requirements

### Requirement: Authenticated review submission
The system SHALL require authentication to submit a review. Each review MUST be linked to the authenticated user's account.

#### Scenario: Submit review while logged in
- **WHEN** an authenticated user submits a review for a product
- **THEN** the review is created and linked to their user account

#### Scenario: Submit review without authentication
- **WHEN** an unauthenticated user attempts to submit a review
- **THEN** the system returns 401 Unauthorized

### Requirement: Review fields
A review SHALL include: product (required), overall rating 1–5 (required), aspect ratings for Battery/Build Quality/Ease of Use/Performance/Value for Money (optional), positive experience text (optional), negative experience text (optional), purchase date (optional), retailer from a known list (optional).

#### Scenario: Minimal review
- **WHEN** a user submits a review with only the product and overall rating
- **THEN** the review is accepted and created

#### Scenario: Full review
- **WHEN** a user submits a review with all fields filled
- **THEN** all fields are stored and displayed on the product page

### Requirement: Anonymity toggle
The review form SHALL include an anonymity choice. Users MUST be able to select either "Anonymous" or display their name. The system always stores the real user link; anonymity controls only the public display.

#### Scenario: Submit as anonymous
- **WHEN** a user submits a review and selects "Anonymous"
- **THEN** the review is publicly displayed without the reviewer's name

#### Scenario: Submit with name visible
- **WHEN** a user submits a review and selects "Show my name"
- **THEN** the review is publicly displayed with the reviewer's display name

#### Scenario: Admin sees real identity
- **WHEN** an admin views a review submitted anonymously
- **THEN** the admin can see the actual user who submitted the review

### Requirement: One review per user per product
The system SHALL enforce a maximum of one review per user per product.

#### Scenario: Duplicate review attempt
- **WHEN** a user who already has a review for a product tries to submit another
- **THEN** the system rejects the submission with an error indicating they already reviewed this product

### Requirement: Edit own review
Authenticated users SHALL be able to edit their own reviews, including changing the anonymity setting.

#### Scenario: Edit own review
- **WHEN** an authenticated user edits their existing review
- **THEN** the review is updated with the new content

#### Scenario: Edit another user's review
- **WHEN** a user attempts to edit a review that belongs to another user
- **THEN** the system returns 403 Forbidden

### Requirement: Serial number verification
A user MAY optionally submit a product serial number with their review. If the serial exists in the seeded registry and has not been claimed, the review SHALL receive a "Verified Purchase" label and the serial SHALL be marked as claimed.

#### Scenario: Valid unclaimed serial
- **WHEN** a user submits a review with a serial number that exists and is unclaimed
- **THEN** the review is labeled "Verified Purchase" and the serial is marked as claimed

#### Scenario: Already claimed serial
- **WHEN** a user submits a review with a serial number that has already been claimed
- **THEN** the system rejects the serial verification and the review is created without the "Verified Purchase" label

#### Scenario: Invalid serial
- **WHEN** a user submits a review with a serial number not found in the registry
- **THEN** the serial verification fails and the review is created without the "Verified Purchase" label

#### Scenario: Review without serial
- **WHEN** a user submits a review without providing a serial number
- **THEN** the review is created without the "Verified Purchase" label

### Requirement: Serial number privacy
Serial numbers MUST be stored as hashed values. Raw serial numbers MUST NOT appear in any public API response.

#### Scenario: Serial not exposed in review response
- **WHEN** a verified-purchase review is returned by the API
- **THEN** the response includes the "Verified Purchase" label but does not include the serial number

### Requirement: Public review display
Product pages SHALL display reviews with: the reviewer's display name or "Anonymous", the "Verified Purchase" label when applicable, overall rating, aspect ratings, experience text, purchase date, and retailer.

#### Scenario: Mixed review list
- **WHEN** a product has reviews from anonymous users, named users, verified and unverified purchases
- **THEN** all reviews are displayed with correct labels for each combination

### Requirement: Denormalized rating summaries
The system SHALL maintain denormalized average rating, review count, and verified review count on each product, updated when reviews are created, edited, or deleted.

#### Scenario: Rating summary after new review
- **WHEN** a new review is published for a product
- **THEN** the product's average rating, review count, and verified review count are updated

### Requirement: Retailer dropdown from known list
The retailer field on reviews SHALL be a selection from: Flipkart, Amazon India, Myntra, Croma, Reliance Digital, Official Brand Store, Other.

#### Scenario: Valid retailer selection
- **WHEN** a user selects "Flipkart" as the retailer
- **THEN** the review stores "Flipkart" as the retailer value

#### Scenario: Invalid retailer value
- **WHEN** an API request submits a retailer value not in the known list
- **THEN** the system rejects the value with a validation error
