import { motion, useReducedMotion } from 'framer-motion';
import { Trophy } from 'lucide-react';

/* ── Shared constants (mirrored from ComparePage) ── */

const NUMERIC_KEYS = new Set([
  'battery_runtime_minutes', 'battery_charge_time_hours', 'weight_grams',
  'blade_width_mm', 'length_settings', 'attachments_count', 'wattage',
  'max_temperature_c', 'heat_settings', 'speed_settings', 'heat_up_time_seconds',
  'plate_width_mm', 'cord_length_m',
]);

const LOWER_IS_BETTER = new Set([
  'battery_charge_time_hours', 'weight_grams', 'heat_up_time_seconds',
]);

function parseNum(val) {
  if (!val) return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

/**
 * Compute who wins a single spec row.
 * Returns 'a', 'b', or null (tie / incomparable).
 */
function computeSpecWinner(spec) {
  const appA = spec.productA?.applicability ?? null;
  const appB = spec.productB?.applicability ?? null;

  // Both AVAILABLE — compare values
  if (appA === 'AVAILABLE' && appB === 'AVAILABLE') {
    const numA = parseNum(spec.productA?.value);
    const numB = parseNum(spec.productB?.value);

    if (NUMERIC_KEYS.has(spec.key) && numA !== null && numB !== null) {
      if (numA === numB) return null;
      const lowerBetter = LOWER_IS_BETTER.has(spec.key);
      return lowerBetter ? (numA < numB ? 'a' : 'b') : (numA > numB ? 'a' : 'b');
    }
    // Both AVAILABLE but text or equal — tie
    return null;
  }

  // One AVAILABLE, other is NOT_APPLICABLE / UNKNOWN / null — AVAILABLE wins
  if (appA === 'AVAILABLE' && appB !== 'AVAILABLE') return 'a';
  if (appB === 'AVAILABLE' && appA !== 'AVAILABLE') return 'b';

  return null;
}

/**
 * VerdictCard — head-to-head summary card.
 *
 * Props:
 *   categories – array of { name, specs[] } from comparison response
 *   productA   – { id, model, name, ... }
 *   productB   – { id, model, name, ... }
 */
export default function VerdictCard({ categories, productA, productB }) {
  const reduceMotion = useReducedMotion();

  if (!categories || !productA || !productB) return null;

  // Compute per-category verdicts
  let totalA = 0;
  let totalB = 0;

  const categoryVerdicts = categories
    .map((cat) => {
      let catA = 0;
      let catB = 0;

      for (const spec of cat.specs) {
        if (!spec.isDifferent) continue;
        const winner = computeSpecWinner(spec);
        if (winner === 'a') catA++;
        if (winner === 'b') catB++;
      }

      totalA += catA;
      totalB += catB;

      const winner = catA > catB ? 'a' : catB > catA ? 'b' : 'tie';
      return { name: cat.name, winsA: catA, winsB: catB, winner };
    })
    .filter((v) => v.winsA > 0 || v.winsB > 0); // only show categories with decisive specs

  const total = totalA + totalB;
  const pctA = total > 0 ? Math.round((totalA / total) * 100) : 50;
  const pctB = 100 - pctA;

  // Animation config
  const cardSpring = reduceMotion
    ? { duration: 0.15 }
    : { type: 'spring', stiffness: 300, damping: 30 };

  return (
    <motion.div
      className="rounded-xl border border-border/60 overflow-hidden bg-card"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={cardSpring}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold tracking-tight">Head-to-Head Verdict</h3>
        </div>
      </div>

      {/* Overall score bar */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {productA.model}
            <span className="text-foreground tabular-nums font-bold">{totalA}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-foreground tabular-nums font-bold">{totalB}</span>
            {productB.model}
            <span className="w-2 h-2 rounded-full bg-chart-2" />
          </span>
        </div>

        {/* Proportional bar */}
        <div className="h-3 rounded-full bg-muted/40 overflow-hidden flex">
          <motion.div
            className="h-full bg-primary rounded-l-full"
            initial={{ width: '50%' }}
            animate={{ width: `${pctA}%` }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }
            }
          />
          <motion.div
            className="h-full bg-chart-2 rounded-r-full"
            initial={{ width: '50%' }}
            animate={{ width: `${pctB}%` }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }
            }
          />
        </div>

        {/* Overall label */}
        <p className="text-center text-xs text-muted-foreground">
          {totalA > totalB
            ? `${productA.model} leads by ${totalA - totalB} spec${totalA - totalB !== 1 ? 's' : ''}`
            : totalB > totalA
              ? `${productB.model} leads by ${totalB - totalA} spec${totalB - totalA !== 1 ? 's' : ''}`
              : 'Even match across all specs'}
        </p>
      </div>

      {/* Category breakdown */}
      {categoryVerdicts.length > 0 && (
        <div className="border-t border-border/40">
          {categoryVerdicts.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="flex items-center justify-between px-5 py-2.5 text-xs border-b border-border/20 last:border-b-0"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0.1 }
                  : { type: 'spring', stiffness: 300, damping: 30, delay: 0.15 + i * 0.06 }
              }
            >
              <span className="text-muted-foreground font-medium">{cat.name}</span>

              <div className="flex items-center gap-2">
                <span className="tabular-nums text-muted-foreground">
                  {cat.winsA}-{cat.winsB}
                </span>

                {cat.winner === 'a' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {productA.model}
                  </span>
                )}
                {cat.winner === 'b' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-chart-2/10 text-chart-2 px-2 py-0.5 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                    {productB.model}
                  </span>
                )}
                {cat.winner === 'tie' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    Tie
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
