# user-auth Specification

## Purpose

Provides user registration, login, and JWT-based session management with an admin role for protected operations.

## Requirements

### Requirement: User registration
The system SHALL allow new users to register with a name, email, and password. Passwords MUST be hashed with bcryptjs before storage.

#### Scenario: Successful registration
- **WHEN** a user submits a valid name, email, and password
- **THEN** a new user account is created with the password hashed, and a JWT is returned

#### Scenario: Duplicate email
- **WHEN** a user attempts to register with an email already in use
- **THEN** the system returns an error indicating the email is taken

#### Scenario: Invalid input
- **WHEN** a user submits a registration with missing or invalid fields
- **THEN** the system returns validation errors describing what is wrong

### Requirement: User login
The system SHALL authenticate users by email and password and return a JWT on success.

#### Scenario: Successful login
- **WHEN** a user submits a valid email and correct password
- **THEN** the system returns a JWT containing the user's ID and role

#### Scenario: Wrong password
- **WHEN** a user submits a valid email with an incorrect password
- **THEN** the system returns an authentication error without revealing whether the email exists

#### Scenario: Non-existent email
- **WHEN** a user submits an email not linked to any account
- **THEN** the system returns the same authentication error as a wrong password

### Requirement: JWT-protected routes
Protected API endpoints SHALL require a valid JWT in the Authorization header. Requests without a valid token MUST be rejected with 401.

#### Scenario: Valid token
- **WHEN** a request includes a valid, unexpired JWT
- **THEN** the request proceeds and the authenticated user's identity is available to the handler

#### Scenario: Missing or invalid token
- **WHEN** a request to a protected endpoint lacks a token or includes an invalid/expired token
- **THEN** the system returns 401 Unauthorized

### Requirement: Current user endpoint
The system SHALL provide an endpoint that returns the authenticated user's profile (ID, name, email, role).

#### Scenario: Get current user
- **WHEN** an authenticated user requests their profile
- **THEN** the system returns their ID, name, email, and role

### Requirement: Admin role
The system SHALL support an admin role. Admin-only endpoints MUST reject non-admin users with 403.

#### Scenario: Admin access
- **WHEN** a user with role ADMIN accesses an admin-only endpoint
- **THEN** the request proceeds normally

#### Scenario: Non-admin rejected
- **WHEN** a user with role USER accesses an admin-only endpoint
- **THEN** the system returns 403 Forbidden

### Requirement: Server-side authorization enforcement
Authorization MUST be enforced on the backend. Frontend visibility controls are NOT a substitute for server-side checks.

#### Scenario: Direct API call without frontend
- **WHEN** a non-admin user calls an admin-only API endpoint directly (bypassing the frontend)
- **THEN** the server rejects the request with 403
