import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Layers, ChevronDown, ChevronRight, ArrowRight,
  Package, Trophy, Minus, Info, GitCompareArrows,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RatingBadge } from '@/components/star-rating';
import { api } from '@/services/api';

/** Keys whose values are purely numeric (for bar rendering). */
const NUMERIC_KEYS = new Set([
  'battery_runtime_minutes', 'battery_charge_time_hours', 'weight_grams',
  'blade_width_mm', 'length_settings', 'attachments_count', 'wattage',
  'max_temperature_c', 'heat_settings', 'speed_settings', 'heat_up_time_seconds',
  'plate_width_mm', 'cord_length_m',
]);

/** Keys where a lower value is better. */
const LOWER_IS_BETTER = new Set([
  'battery_charge_time_hours', 'weight_grams', 'heat_up_time_seconds',
]);

function parseNum(val) {
  if (!val) return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function displayValue(side) {
  if (!side || side.applicability === null) return '—';
  if (side.applicability === 'UNKNOWN') return 'Unknown';
  if (side.applicability === 'NOT_APPLICABLE') return 'N/A';
  return side.value || '—';
}

/** Determines winner: 'a', 'b', or null. */
function getWinner(key, numA, numB) {
  if (numA === null || numB === null) return null;
  if (numA === numB) return null;
  const lowerBetter = LOWER_IS_BETTER.has(key);
  if (lowerBetter) return numA < numB ? 'a' : 'b';
  return numA > numB ? 'a' : 'b';
}

/* ── Animated progress bar ── */
function SpecBar({ value, maxValue, isWinner }) {
  if (value === null || maxValue === null || maxValue === 0) return null;
  const pct = Math.round((value / maxValue) * 100);
  return (
    <div className="w-full h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full animate-bar transition-colors ${
          isWinner ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-primary/30'
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ── Product selector card ── */
function ProductSelector({ label, value, onChange, excludeId, products, side }) {
  const product = products.find(p => p.id === value);
  const sideColor = side === 'a' ? 'from-primary/10 to-primary/5' : 'from-chart-2/10 to-chart-2/5';

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${side === 'a' ? 'bg-primary' : 'bg-chart-2'}`} />
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select a product..." />
        </SelectTrigger>
        <SelectContent>
          {products.filter(p => p.id !== excludeId).map(p => (
            <SelectItem key={p.id} value={p.id}>
              <span className="font-medium">{p.model}</span>
              <span className="text-muted-foreground ml-2 text-xs">{p.family?.name || ''}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {product && (
        <div className={`bg-gradient-to-br ${sideColor} rounded-xl p-4 space-y-3 border border-border/50`}>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-background/80 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
              ) : (
                <Package size={24} className="text-muted-foreground/20" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <RatingBadge rating={product.avgRating} reviewCount={product.reviewCount} />
            {product.priceRange && (
              <span className="text-xs text-muted-foreground">{product.priceRange}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Collapsible spec category ── */
function SpecCategory({ name, specs, comparison }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {name}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {specs.length} spec{specs.length !== 1 ? 's' : ''}
          </Badge>
          {open ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="divide-y divide-border/40">
          {/* Table header */}
          <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-4 px-5 py-2 bg-muted/10 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            <span>Specification</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {comparison.productA.model}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
              {comparison.productB.model}
            </span>
          </div>

          {/* Spec rows */}
          {specs.map(spec => {
            const numA = parseNum(spec.productA?.value);
            const numB = parseNum(spec.productB?.value);
            const isNumeric = NUMERIC_KEYS.has(spec.key) && (numA !== null || numB !== null);
            const maxNum = (numA !== null && numB !== null) ? Math.max(numA, numB) : (numA || numB);
            const winner = isNumeric ? getWinner(spec.key, numA, numB) : null;
            const isMutedA = !spec.productA || spec.productA.applicability === 'UNKNOWN' || spec.productA.applicability === 'NOT_APPLICABLE' || spec.productA.applicability === null;
            const isMutedB = !spec.productB || spec.productB.applicability === 'UNKNOWN' || spec.productB.applicability === 'NOT_APPLICABLE' || spec.productB.applicability === null;

            return (
              <div
                key={spec.key}
                className={`grid grid-cols-[1.2fr_1fr_1fr] gap-4 px-5 py-3 text-sm hover:bg-muted/20 transition-colors ${
                  spec.isDifferent ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''
                }`}
              >
                <span className="text-muted-foreground flex items-center gap-2">
                  {spec.label}
                  {spec.isDifferent && (
                    <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                  )}
                </span>

                {/* Product A value */}
                <div className={winner === 'a' ? 'winner-cell rounded px-2 py-1 -mx-2 -my-1' : ''}>
                  <div className="flex items-center gap-1.5">
                    {winner === 'a' && <Trophy size={12} className="text-emerald-500 shrink-0" />}
                    <span className={isMutedA ? 'text-muted-foreground italic' : 'font-medium'}>
                      {displayValue(spec.productA)}
                    </span>
                  </div>
                  {isNumeric && numA !== null && (
                    <SpecBar value={numA} maxValue={maxNum} isWinner={winner === 'a'} />
                  )}
                </div>

                {/* Product B value */}
                <div className={winner === 'b' ? 'winner-cell rounded px-2 py-1 -mx-2 -my-1' : ''}>
                  <div className="flex items-center gap-1.5">
                    {winner === 'b' && <Trophy size={12} className="text-emerald-500 shrink-0" />}
                    <span className={isMutedB ? 'text-muted-foreground italic' : 'font-medium'}>
                      {displayValue(spec.productB)}
                    </span>
                  </div>
                  {isNumeric && numB !== null && (
                    <SpecBar value={numB} maxValue={maxNum} isWinner={winner === 'b'} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main compare page ── */
export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const [idA, setIdA] = useState(searchParams.get('a') || '');
  const [idB, setIdB] = useState(searchParams.get('b') || '');

  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get('/products').then(setProducts).catch(() => {});
  }, []);

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idA || !idB) {
      setComparison(null);
      return;
    }
    setLoading(true);
    setError(null);
    api.get(`/comparison?a=${encodeURIComponent(idA)}&b=${encodeURIComponent(idB)}`)
      .then(data => { setComparison(data); setError(null); })
      .catch(err => { setError(err.message); setComparison(null); })
      .finally(() => setLoading(false));
  }, [idA, idB]);

  const totalSpecs = comparison ? comparison.categories.reduce((sum, cat) => sum + cat.specs.length, 0) : 0;
  const diffCount = comparison ? comparison.categories.reduce((sum, cat) => sum + cat.specs.filter(s => s.isDifferent).length, 0) : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground">Compare</span>
      </nav>

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <GitCompareArrows size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compare Products</h1>
          <p className="text-sm text-muted-foreground">Select two products for a detailed specification comparison</p>
        </div>
      </div>

      {/* Product selectors with VS badge */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductSelector label="Product A" value={idA} onChange={setIdA} excludeId={idB} products={products} side="a" />

        {/* VS badge */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="vs-badge w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-lg">
            VS
          </div>
        </div>

        <ProductSelector label="Product B" value={idB} onChange={setIdB} excludeId={idA} products={products} side="b" />
      </div>

      {/* Loading state */}
      {loading && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center space-y-3">
            <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading comparison...</p>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {error && !loading && (
        <Card className="border-destructive/50">
          <CardContent className="py-12 text-center space-y-2">
            <p className="text-destructive font-medium">Comparison failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!comparison && !loading && !error && (
        <Card className="border-dashed">
          <CardContent className="py-20 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/80 flex items-center justify-center">
              <Layers size={28} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-medium">Pick two products to compare</p>
              <p className="text-sm text-muted-foreground mt-1">
                Specs are matched by canonical keys — differences highlighted automatically
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Trophy size={12} className="text-emerald-500" />
                Winner highlighted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Differences marked
              </span>
              <span className="flex items-center gap-1.5">
                <Minus size={12} />
                Visual bars for numeric specs
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary stats bar */}
      {comparison && !loading && (
        <div className="flex items-center gap-3 text-sm">
          <Badge variant="outline" className="gap-1.5">
            <Info size={12} />
            {totalSpecs} specs compared
          </Badge>
          <Badge className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {diffCount} difference{diffCount !== 1 ? 's' : ''}
          </Badge>
          {comparison.productA.avgRating && comparison.productB.avgRating && (
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1.5">
              <Trophy size={12} className="text-emerald-500" />
              indicates better value
            </span>
          )}
        </div>
      )}

      {/* Comparison results */}
      {comparison && !loading && (
        <div className="space-y-4">
          {comparison.categories.map(category => (
            <SpecCategory
              key={category.name}
              name={category.name}
              specs={category.specs}
              comparison={comparison}
            />
          ))}
        </div>
      )}
    </div>
  );
}
