# Design

## Context

The comparison page at `/compare` currently renders a static spec table with visual bars for numeric values. It works but looks like every other comparison site. The page fetches from `GET /api/comparison?a=...&b=...` and `GET /api/products`. Products have `boxContents` (JSON array of parts), `highlights` (tech badges), and `family.category`. See proposal.md for the vision.

## Goals / Non-Goals

**Goals:**
- Make the comparison page feel like a premium product experience, not a spreadsheet
- Prevent nonsensical cross-category comparisons automatically
- Every animation serves a purpose: revealing structure, showing differences, guiding attention
- All animations respect `prefers-reduced-motion` and degrade gracefully

**Non-Goals:**
- Three.js or WebGL (too heavy, no 3D models)
- Custom illustration per product (use the box contents data generically)
- Three-way comparison
- Saving or sharing comparisons

## Decisions

### 1. Animation stack: Framer Motion + CSS 3D transforms

**Decision:** Use `framer-motion` for spring-based layout animations (spec reveals, product swaps, verdict) and CSS `transform: perspective() rotateX/Y() translateZ()` for the exploded view. No Three.js.

**Why this combination:**
- Framer Motion (~40KB tree-shaken) gives spring physics, `AnimatePresence` for mount/unmount, `layout` animations for position swaps, and `useReducedMotion` hook
- CSS 3D transforms are GPU-accelerated, need no JS runtime, and work on every modern browser
- Together they cover the full animation spectrum without WebGL overhead

**Alternative rejected (Three.js):** Would add ~200KB, needs a canvas that doesn't SSR, requires 3D models we don't have, and the visual benefit over CSS 3D is marginal for this use case.

### 2. Exploded view: CSS 3D transform on box contents

**Decision:** When comparison loads, the product image stays centered and the box contents items animate outward from it in a radial burst pattern using CSS 3D perspective transforms. Each part is a labeled pill that flies out from the product center to its final position.

**Layout:**
```
                  [Precision comb]
                       |
    [USB cable] -- [PRODUCT IMG] -- [Blade head]
                       |
                  [Cleaning brush]
```

**Animation sequence:**
1. Product image fades in and settles (0-300ms, ease-enter)
2. Parts burst outward from center with spring physics (300-1500ms, staggered 80ms each)
3. Connector lines draw from each part back to the product (1500-1800ms)
4. Parts become interactive — hover highlights the related spec group

**Fallback:** If `boxContents` is empty, show the product image with a subtle scale-up entrance only.

**Reduced motion:** Parts appear in final positions instantly with a simple fade-in.

### 3. Smart category matching: backend + frontend

**Decision:** When Product A is selected, fetch Product B options filtered by the same category.

**API change:** `GET /api/products` already supports `?category=<category>`. The frontend uses it:
```js
// When Product A is selected with category "beard-trimmer"
const productBOptions = await api.get(`/products?category=${productA.family.category}`);
```

No backend changes needed — the existing `category` filter already does this. The comparison API's `comparisonService` already validates both products exist but doesn't check category. Add a category match check:
```js
if (productA.family.category !== productB.family.category) {
  throw { status: 400, message: 'Products must be in the same category' };
}
```

### 4. Spec reveal: staggered spring animation

**Decision:** Each spec category is a Framer Motion `motion.div` that slides in from the left with a spring:
```jsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30, delay: index * 0.1 }}
>
```

Numeric bars animate from width 0 to their value with `useInView` triggering the animation when scrolled into view:
```jsx
<motion.div
  initial={{ width: 0 }}
  animate={inView ? { width: `${pct}%` } : {}}
  transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.3 }}
/>
```

### 5. Winner detection and verdict

**Decision:** For each spec row, compare values to determine a winner:
- Numeric specs: higher is better (except weight, charge time — lower is better, using the existing `LOWER_IS_BETTER` set)
- Boolean specs (e.g. "Yes" vs "N/A"): "Yes" / "AVAILABLE" wins
- Text specs: no winner (equal)
- UNKNOWN/NOT_APPLICABLE: no winner

Verdict card tallies wins per category and overall:
```
  Battery:     Product A wins (3-1)
  Blade:       Tied (2-2)
  Build:       Product B wins (2-3)
  ─────────────────────────────
  Overall:     Product B leads (7-6)
```

### 6. Swap animation

**Decision:** When the user clicks the swap button (center between products), use Framer Motion `layout` prop on the product cards. The cards physically cross with a spring animation:
```jsx
<motion.div layout layoutId={`product-${side}`} transition={{ type: 'spring', stiffness: 250, damping: 28 }}>
```

This gives a smooth crossover without manual position tracking.

### 7. Component architecture

```
ComparePage.jsx (orchestrator)
  |
  +-- ProductSelector        (dropdown + preview card)
  +-- ExplodedView           (CSS 3D parts animation)
  +-- ComparisonBody         (the spec comparison)
  |     +-- SpecCategoryCard (one per category, stagger reveal)
  |     |     +-- SpecRow    (bar animation, winner indicator)
  |     +-- VerdictCard      (head-to-head summary)
  +-- SwapButton             (center, triggers layout swap)
```

Each component is a separate file under `apps/web/src/components/compare/`.

## Risks / Trade-offs

- **[Framer Motion bundle size]** → ~40KB gzipped. Acceptable for the comparison page which is the MVP showcase. Tree-shaking keeps it small.
- **[CSS 3D perspective on mobile]** → GPU-accelerated, should be fine. Reduced to 2D transforms on phones < 640px width.
- **[Box contents as exploded parts is generic]** → Not as impressive as real CAD exploded views, but the animation quality (spring physics, stagger, connector lines) makes it feel intentional. The data already exists.
- **[Winner detection is opinionated]** → Some users may disagree with "higher is better" for certain specs. Mitigate by showing the raw values alongside the winner indicator.
