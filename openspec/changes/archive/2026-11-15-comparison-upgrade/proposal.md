# Proposal

## Why

The comparison page is Pulso's core differentiator, but it currently renders like every other comparison site — static tables with text values. SmartPrix, 91mobiles, and GSMArena all do the same: two columns, rows of specs, done. Pulso should feel different. The comparison should be visual, animated, and intelligent — products split apart to reveal their components, specs animate into view, and the system prevents nonsensical comparisons (trimmer vs hair dryer).

## What Changes

- **Smart category matching**: When a user selects Product A, the Product B dropdown only shows products in the same category (beard trimmers vs beard trimmers, not vs hair dryers). Cross-category comparison is blocked with a clear message.
- **Animated product exploded view**: When a comparison loads, each product's image animates apart into its component parts (blade, motor, comb, handle) using CSS 3D transforms and Framer Motion springs. Each part gets a label and connects to its relevant spec group.
- **Spec reveal animations**: Instead of a static table, spec categories slide in sequentially. Numeric values animate as growing bars with spring physics. Differences pulse with a subtle glow. The "winner" per spec gets a subtle highlight.
- **Head-to-head verdict section**: An animated summary card showing which product wins in each category (battery, build, performance), with an overall score visualization.
- **Swap animation**: When swapping products, the cards physically cross paths with a smooth animation instead of instantly switching.
- **Responsive and progressive**: CSS 3D transforms for the exploded view (light, GPU-accelerated), Framer Motion for spring animations (small library, tree-shakeable). Three.js NOT used — too heavy for this use case. Falls back gracefully on reduced-motion and low-end devices.

## Out of Scope

- Three.js / WebGL (too heavy, no 3D models available)
- Actual 3D product models or CAD renders
- Three-way comparison
- Price comparison or buy links
- Comparison history or saved comparisons

## Capabilities

### New Capabilities
_None._

### Modified Capabilities
- `dynamic-comparison`: Add smart category matching (same-category only), animated exploded view, spec reveal animations, head-to-head verdict, swap animation.

## Impact

- **Dependencies**: Add `framer-motion` (~40KB tree-shaken) to `apps/web`
- **Backend**: `GET /api/comparison` response adds a `category` field. `GET /api/products` adds optional `?sameCategory=<category>` param to return only products in the same category for the selector dropdown.
- **Frontend**: Complete rewrite of ComparePage.jsx with animated components. New components: `ExplodedView`, `SpecReveal`, `VerdictCard`, `SwapTransition`.
- **Accessibility**: All animations respect `prefers-reduced-motion`. Content readable without animation. Keyboard and screen reader support maintained.
