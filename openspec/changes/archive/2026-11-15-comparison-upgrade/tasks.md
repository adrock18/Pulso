# Tasks

## 1. Dependencies and Backend

- [x] 1.1 Install `framer-motion` in `apps/web`: `npm install framer-motion --workspace=apps/web`. Verify by importing `{ motion }` in a test file and running `npx vite build`.
- [x] 1.2 Update `comparisonService.js`: add a category match check — if `productA.family.category !== productB.family.category`, throw a 400 error "Products must be in the same category to compare". Add the `category` field to both productA and productB in the response. Verify by calling the API with two products from different categories and confirming 400.
- [x] 1.3 Update the comparison API response to include `boxContents` (parsed from JSON) and `highlights` (parsed from JSON) for both products. The exploded view needs boxContents; highlight badges shown on each product card. Verify by calling `GET /api/comparison?a=...&b=...` and confirming boxContents arrays appear.

## 2. Component Architecture

- [x] 2.1 Create `apps/web/src/components/compare/ExplodedView.jsx`: Takes `product` prop (with image, boxContents). Renders the product image centered with box content items as pills arranged in a radial burst. Animation: image fades in (0-300ms), parts burst outward with staggered spring (300-1500ms, 80ms stagger), connector lines draw from parts to center (1500-1800ms). Uses CSS `perspective` + `translateZ` for 3D depth and `framer-motion` for spring timing. Respects `prefers-reduced-motion` (parts appear in final positions with simple fade). Falls back to plain image if no boxContents. Verify by rendering it in isolation with a mock product.
- [x] 2.2 Create `apps/web/src/components/compare/SpecCategoryCard.jsx`: Takes `category` (name + specs array), `productAModel`, `productBModel`, and `animationDelay`. Renders one spec category with a staggered slide-in entry animation (`motion.div` from x:-20, opacity:0). Each spec row renders two bars that grow from width 0 with spring physics (`useInView` trigger). Diff rows get a brief pulse glow. Winner per row gets a subtle checkmark. Verify by rendering with mock category data.
- [x] 2.3 Create `apps/web/src/components/compare/VerdictCard.jsx`: Takes `categories` array (the full comparison), computes winner per category using the rules from design.md (higher is better, except LOWER_IS_BETTER set; UNKNOWN/NOT_APPLICABLE excluded). Shows each category with a winner badge and win count. Shows overall leader with a score bar. Animated entry with a spring. Verify with mock comparison data.
- [x] 2.4 Create `apps/web/src/components/compare/SwapButton.jsx`: A circular button centered between the two product selectors. On click, triggers the swap callback. The button itself rotates 180 degrees on click with a spring animation. Uses `ArrowLeftRight` icon from lucide-react. Verify renders and rotates on click.

## 3. Compare Page Rewrite

- [x] 3.1 Rewrite `ComparePage.jsx` — Product selection with smart category matching: When Product A is selected, fetch Product B options with `GET /api/products?category=${productA.family.category}`. Show a label like "Showing beard trimmers" on the Product B selector. If Product A changes category, clear Product B selection. Keep the URL params (`?a=...&b=...`) working. Verify by selecting a beard trimmer as A and confirming B only shows beard trimmers.
- [x] 3.2 Rewrite `ComparePage.jsx` — Comparison body: Replace the static table rendering with the new animated components. Layout: ExplodedView for each product at the top, then SpecCategoryCards staggered below, then VerdictCard at the bottom. Use `AnimatePresence` for mount/unmount transitions when comparison data changes. Loading state shows a skeleton with pulsing bars. Verify by selecting two products and seeing the animated reveal.
- [x] 3.3 Rewrite `ComparePage.jsx` — Swap animation: Use Framer Motion `layoutId` on the two product selector columns so swapping triggers a cross-path animation. The SwapButton in the center triggers `setIdA(idB); setIdB(idA)`. Framer Motion handles the position swap animation automatically via layout. Verify by clicking swap and seeing cards cross paths.
- [x] 3.4 Add `prefers-reduced-motion` support: Use `useReducedMotion()` from framer-motion. When true, set all animation durations to 0 and transitions to `{ duration: 0 }`. ExplodedView shows parts in final position. SpecBars show full width immediately. No pulse effects. Verify by enabling "Reduce motion" in OS settings and confirming no animations play.

## 4. Polish and Testing

- [x] 4.1 Mobile responsive: On screens < 640px, stack the product selectors vertically, reduce ExplodedView to a simpler 2-column parts list (no radial burst), and make the verdict card single-column. Verify by resizing the browser to mobile width.
- [x] 4.2 Update Playwright tests: Add tests for smart category matching (select beard trimmer A, verify B shows only beard trimmers), comparison animation loads (comparison body visible after selecting two products), and cross-category rejection (API returns 400). Run full suite and verify all pass.
- [x] 4.3 Build verification: Run `npx vite build` and confirm no errors. Check bundle size impact of framer-motion. Run the existing 36 Playwright tests for regression.

## Workflow follow-up

- Archive after all tasks are complete and reviewed.
