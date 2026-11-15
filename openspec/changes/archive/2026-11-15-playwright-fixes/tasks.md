# Tasks

## 1. Playwright Setup and Bug Fixes

- [x] 1.1 Install Playwright and Chromium browser. Create playwright.config.js with webServer config for both API and Vite. Verify Playwright runs.
- [x] 1.2 Write 24 smoke tests covering: Homepage (hero, nav, categories, top rated, no errors), Products Page (API loading, gender filter, no errors), Product Detail (specs, 404, no errors), Compare Page (heading, empty state, comparison data, no errors), Community Page (loads, no errors), Auth Pages (login form, register form, login flow, no errors), Navigation (Men's Grooming dropdown, Compare link, Community link).
- [x] 1.3 Fix VITE_API_BASE_URL in apps/web/.env — change from `/api` (relative, hits Vite dev server) to `http://localhost:5000/api` (absolute, hits Express).
- [x] 1.4 Fix nested button in GenderDropdown — replace `<Button>` inside `<DropdownMenuTrigger asChild>` with plain `<button>` to avoid `<button><button>` HTML nesting violation.
- [x] 1.5 Increase rate limiter in dev mode from 100 to 1000 requests per 15-minute window to prevent test throttling.
- [x] 1.6 Remove `animate-page-in` class from `<main>` wrapper to prevent content staying invisible if CSS animation doesn't fire.
- [x] 1.7 Run full Playwright suite — 24/24 tests passing.

## Workflow follow-up

- Archive the change after review.
