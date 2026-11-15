# product-analytics Specification

## Purpose

Provides aggregate review analytics per product — rating distribution, aspect averages, and admin-visible product trend indicators.

## Requirements

### Requirement: Product rating distribution
The system SHALL return a rating distribution (count of reviews per star rating 1–5) for a given product.

#### Scenario: Rating distribution for a reviewed product
- **WHEN** a user or admin requests analytics for a product with reviews
- **THEN** the response includes the count of 1-star, 2-star, 3-star, 4-star, and 5-star reviews

#### Scenario: Rating distribution for a product with no reviews
- **WHEN** analytics are requested for a product with zero reviews
- **THEN** the response includes a distribution of all zeros

### Requirement: Aspect rating averages
The system SHALL return average ratings per aspect (Battery, Build Quality, Ease of Use, Performance, Value for Money) for a given product, computed only from reviews that provided that aspect rating.

#### Scenario: Aspect averages
- **WHEN** a product has reviews with aspect ratings
- **THEN** the response includes average rating per aspect, excluding reviews that did not rate that aspect

#### Scenario: No aspect ratings provided
- **WHEN** no reviews for a product include a particular aspect rating
- **THEN** that aspect is returned as null or absent, not as zero

### Requirement: Verified vs unverified review counts
The analytics response SHALL include the count of verified-purchase reviews and unverified reviews separately.

#### Scenario: Mixed verification counts
- **WHEN** a product has 3 verified and 7 unverified reviews
- **THEN** the analytics response returns verifiedCount: 3, unverifiedCount: 7

### Requirement: Admin product trends
The admin SHALL be able to view which products are trending up or down based on recent review volume and average rating changes.

#### Scenario: Product trending up
- **WHEN** an admin views product trends and a product has received increasing review counts or rising average ratings in recent submissions
- **THEN** that product is indicated as trending up

#### Scenario: Product with no recent activity
- **WHEN** a product has no reviews in the recent period
- **THEN** the product trend is indicated as stable or inactive

### Requirement: Analytics access control
Product analytics (rating distribution, aspect averages, verified counts) SHALL be publicly accessible. Product trend data SHALL be accessible only to admin users.

#### Scenario: Public analytics access
- **WHEN** an unauthenticated user requests product analytics
- **THEN** the response includes rating distribution, aspect averages, and review counts

#### Scenario: Admin trend access
- **WHEN** an admin requests product trends
- **THEN** the response includes trend indicators for each product

#### Scenario: Non-admin trend access
- **WHEN** a non-admin user requests product trends
- **THEN** the system returns 403 Forbidden
