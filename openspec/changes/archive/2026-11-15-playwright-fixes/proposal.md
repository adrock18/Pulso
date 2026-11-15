# Proposal

## Why

Playwright smoke tests revealed 3 real issues in the Pulso frontend. The app pages render correctly but have: a React HTML nesting violation (button inside button in dropdown triggers), test infrastructure gaps, and the Compare page selector using a non-standard Select component that doesn't show placeholder text as expected.

## What Changes

- **Fix nested button in GenderDropdown**: The DropdownMenuTrigger wraps a Button (which renders as `<button>`), creating `<button><button>`. Fix by using a `<div>` or non-button element as the trigger.
- **Fix Compare page Select component**: The Select placeholder isn't matching expected text pattern. Ensure the selectors show product options correctly.
- **Fix login redirect timing**: After login, ensure navigation and user name display complete before test assertions.
- **Add Playwright test suite**: Smoke tests covering all pages, navigation, auth flow, and console error detection. Fix test selectors to be robust.

## Out of Scope

- New features or backend changes
- Design rework — the visual enhancements are kept

## Capabilities

### New Capabilities

_None — this is a fix/test change, not new behavior._

### Modified Capabilities

_None — no spec-level behavior changes._
