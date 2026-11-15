# Design

## Context

The frontend has gender navigation, sidebar filters, breadcrumbs, and a discovery homepage. The remaining work is polish: grid/list toggle, comparison page with visual spec bars, working community filters, mobile responsiveness, similar products, and auth page improvements. All changes are frontend-only with static data.

## Decisions

### 1. Comparison page — visual spec bars for numeric values
Show numeric specs (battery runtime, weight, charge time) as horizontal bars instead of plain text. Bar width proportional to value relative to the higher of the two products. Non-numeric specs stay as text. This is the GSMArena/RTings approach.

### 2. Mobile navigation — sheet-based drawer
Use a hamburger icon that opens a full-height side drawer with the nav links, gender sections, and auth buttons. shadcn Dialog or a custom slide-in. Keep the desktop dropdown menus unchanged.

### 3. Similar products — same-category recommendation
On product detail pages, show up to 3 products from the same category (excluding the current product), sorted by rating. Simple, no ML needed.

### 4. Community filter tabs — client-side filtering
The All/Verified/Most Helpful tabs filter the static review array in memory. "Verified" filters by `isVerified === true`. "Most Helpful" sorts by `helpful` descending.

### 5. Grid/List toggle — layout state in URL
Store view preference in a `view=grid|list` search param so it persists on navigation. List view shows horizontal product cards with more spec detail visible.
