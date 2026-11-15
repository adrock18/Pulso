import { useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

function displayValue(side) {
  if (!side || side.applicability === null || side.applicability === undefined) return '—';
  if (side.applicability === 'UNKNOWN') return 'Unknown';
  if (side.applicability === 'NOT_APPLICABLE') return 'N/A';
  return side.value || '—';
}

function getWinner(key, numA, numB) {
  if (numA === null || numB === null || numA === numB) return null;
  const lowerBetter = LOWER_IS_BETTER.has(key);
  return lowerBetter ? (numA < numB ? 'a' : 'b') : (numA > numB ? 'a' : 'b');
}

/* ── Animated spec bar (uses useInView) ── */

function AnimatedBar({ value, maxValue, isWinner, side, inView, reduceMotion }) {
  if (value === null || maxValue === null || maxValue === 0) return null;
  const pct = Math.min(Math.round((value / maxValue) * 100), 100);

  return (
    <div className="h-1.5 bg-muted/60 rounded-full mt-1.5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${
          isWinner
            ? 'bg-emerald-500 dark:bg-emerald-400'
            : side === 'a'
              ? 'bg-primary/25'
              : 'bg-chart-2/25'
        }`}
        initial={{ width: 0 }}
        animate={inView || reduceMotion ? { width: `${pct}%` } : { width: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 120, damping: 20 }
        }
      />
    </div>
  );
}

/* ── Spec row ── */

function SpecRow({ spec, productAModel, productBModel, reduceMotion }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef, { once: true, margin: '-40px' });

  const numA = parseNum(spec.productA?.value);
  const numB = parseNum(spec.productB?.value);
  const isNumeric = NUMERIC_KEYS.has(spec.key) && (numA !== null || numB !== null);
  const maxNum = numA !== null && numB !== null ? Math.max(numA, numB) : (numA || numB);
  const winner = isNumeric ? getWinner(spec.key, numA, numB) : null;
  const isMutedA = !spec.productA || ['UNKNOWN', 'NOT_APPLICABLE', null, undefined].includes(spec.productA.applicability);
  const isMutedB = !spec.productB || ['UNKNOWN', 'NOT_APPLICABLE', null, undefined].includes(spec.productB.applicability);

  const valA = displayValue(spec.productA);
  const valB = displayValue(spec.productB);
  const unitA = spec.unit && spec.productA?.applicability === 'AVAILABLE' ? ` ${spec.unit}` : '';
  const unitB = spec.unit && spec.productB?.applicability === 'AVAILABLE' ? ` ${spec.unit}` : '';

  // Diff glow pulse animation
  const diffGlow = spec.isDifferent && !reduceMotion
    ? {
        initial: { backgroundColor: 'rgba(245, 158, 11, 0.08)' },
        animate: { backgroundColor: 'rgba(245, 158, 11, 0.03)' },
        transition: { duration: 1.2, ease: 'easeOut' },
      }
    : {};

  return (
    <motion.div
      ref={rowRef}
      className={`spec-row grid grid-cols-[1.4fr_1fr_1fr] gap-1 px-5 py-3 text-sm border-b border-border/20 last:border-b-0 ${
        spec.isDifferent ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''
      }`}
      {...diffGlow}
    >
      {/* Spec label */}
      <span className="text-muted-foreground flex items-center gap-2 pr-2">
        {spec.label}
        {spec.isDifferent && <span className="diff-dot" />}
      </span>

      {/* Product A value */}
      <div className={`relative ${winner === 'a' ? 'winner-cell rounded-md pl-3 py-1 -my-1' : ''}`}>
        <div className="flex items-center gap-1.5">
          {winner === 'a' && <Check size={12} className="text-emerald-500 shrink-0" />}
          <span className={`tabular-nums ${isMutedA ? 'text-muted-foreground/60 italic' : 'font-medium'}`}>
            {valA}{unitA}
          </span>
        </div>
        {isNumeric && numA !== null && (
          <AnimatedBar
            value={numA}
            maxValue={maxNum}
            isWinner={winner === 'a'}
            side="a"
            inView={inView}
            reduceMotion={reduceMotion}
          />
        )}
      </div>

      {/* Product B value */}
      <div className={`relative ${winner === 'b' ? 'winner-cell rounded-md pl-3 py-1 -my-1' : ''}`}>
        <div className="flex items-center gap-1.5">
          {winner === 'b' && <Check size={12} className="text-emerald-500 shrink-0" />}
          <span className={`tabular-nums ${isMutedB ? 'text-muted-foreground/60 italic' : 'font-medium'}`}>
            {valB}{unitB}
          </span>
        </div>
        {isNumeric && numB !== null && (
          <AnimatedBar
            value={numB}
            maxValue={maxNum}
            isWinner={winner === 'b'}
            side="b"
            inView={inView}
            reduceMotion={reduceMotion}
          />
        )}
      </div>
    </motion.div>
  );
}

/**
 * SpecCategoryCard — An animated card showing a group of specs for comparison.
 *
 * Props:
 *   category      – { name, specs[] } where each spec has key, label, unit,
 *                   productA: {value, applicability}, productB: {value, applicability}, isDifferent
 *   productAModel – string (model name for column header)
 *   productBModel – string
 *   delay         – number (seconds) for staggered card entrance
 */
export default function SpecCategoryCard({ category, productAModel, productBModel, delay = 0 }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(true);

  const { name, specs } = category;
  const diffs = specs.filter(s => s.isDifferent).length;

  return (
    <motion.div
      className="rounded-xl border border-border/60 overflow-hidden"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={
        reduceMotion
          ? { duration: 0.15 }
          : { type: 'spring', stiffness: 300, damping: 30, delay }
      }
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-muted/25 hover:bg-muted/40 transition-colors text-left group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {name}
          </span>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {specs.length} spec{specs.length !== 1 ? 's' : ''}
          </span>
          {diffs > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] h-5 gap-1 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40"
            >
              <span className="diff-dot" />
              {diffs}
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Table */}
      {open && (
        <div>
          {/* Column headers */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-1 px-5 py-2 bg-muted/10 border-y border-border/30 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            <span>Spec</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {productAModel}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
              {productBModel}
            </span>
          </div>

          {/* Spec rows */}
          {specs.map((spec) => (
            <SpecRow
              key={spec.key}
              spec={spec}
              productAModel={productAModel}
              productBModel={productBModel}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
