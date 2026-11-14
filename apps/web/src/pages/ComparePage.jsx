import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { RatingBadge } from '@/components/star-rating';
import { PRODUCTS, formatSpecKey, displaySpecValue } from '@/data/products';

/** Keys whose values are purely numeric (for bar rendering) */
const NUMERIC_KEYS = new Set([
  'battery_runtime_minutes', 'battery_charge_time_hours', 'weight_grams',
  'blade_width_mm', 'length_settings', 'attachments_count', 'wattage',
  'max_temperature_c', 'heat_settings', 'speed_settings', 'heat_up_time_seconds',
  'plate_width_mm', 'cord_length_m',
]);

function parseNum(val) {
  if (!val) return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function buildComparison(productA, productB) {
  const allKeys = new Map();
  for (const spec of [...productA.specs, ...productB.specs]) {
    if (!allKeys.has(spec.key)) {
      allKeys.set(spec.key, { key: spec.key, category: spec.category });
    }
  }

  const categories = {};
  for (const { key, category } of allKeys.values()) {
    if (!categories[category]) categories[category] = [];
    const specA = productA.specs.find(s => s.key === key);
    const specB = productB.specs.find(s => s.key === key);
    const valA = specA ? displaySpecValue(specA) : '—';
    const valB = specB ? displaySpecValue(specB) : '—';
    const numA = specA ? parseNum(specA.value) : null;
    const numB = specB ? parseNum(specB.value) : null;
    categories[category].push({
      key,
      valA, valB,
      numA, numB,
      isNumeric: NUMERIC_KEYS.has(key) && (numA !== null || numB !== null),
      applicabilityA: specA?.applicability || null,
      applicabilityB: specB?.applicability || null,
      isDifferent: valA !== valB,
    });
  }
  return categories;
}

function SpecBar({ value, maxValue, color = 'bg-primary/60' }) {
  if (value === null || maxValue === null || maxValue === 0) return null;
  const pct = Math.round((value / maxValue) * 100);
  return (
    <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function ProductSelector({ label, value, onChange, excludeId }) {
  const product = PRODUCTS.find(p => p.id === value);
  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select a product..." />
        </SelectTrigger>
        <SelectContent>
          {PRODUCTS.filter(p => p.id !== excludeId).map(p => (
            <SelectItem key={p.id} value={p.id}>
              <span className="font-medium">{p.model}</span>
              <span className="text-muted-foreground ml-2 text-xs">{p.family}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {product && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-background rounded-md flex items-center justify-center overflow-hidden shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-2xl opacity-20">📦</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RatingBadge rating={product.avgRating} reviewCount={product.reviewCount} />
            {product.priceRange && <span className="text-xs text-muted-foreground">{product.priceRange}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function SpecValueCell({ value, applicability, numValue, maxNum, isNumeric }) {
  const isMuted = applicability === 'UNKNOWN' || applicability === 'NOT_APPLICABLE';
  return (
    <TableCell className="text-sm align-top">
      <span className={isMuted ? 'text-muted-foreground italic' : 'font-medium'}>
        {value}
      </span>
      {isNumeric && numValue !== null && maxNum !== null && (
        <SpecBar value={numValue} maxValue={maxNum} color={numValue >= maxNum ? 'bg-primary' : 'bg-primary/35'} />
      )}
    </TableCell>
  );
}

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const [idA, setIdA] = useState(searchParams.get('a') || '');
  const [idB, setIdB] = useState(searchParams.get('b') || '');

  const productA = PRODUCTS.find(p => p.id === idA);
  const productB = PRODUCTS.find(p => p.id === idB);
  const comparison = productA && productB ? buildComparison(productA, productB) : null;

  const diffCount = comparison ? Object.values(comparison).flat().filter(s => s.isDifferent).length : 0;
  const totalSpecs = comparison ? Object.values(comparison).flat().length : 0;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground">Compare</span>
      </nav>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compare Products</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Select two products to see a detailed specification comparison</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductSelector label="Product A" value={idA} onChange={setIdA} excludeId={idB} />
        <ProductSelector label="Product B" value={idB} onChange={setIdB} excludeId={idA} />
      </div>

      {/* Empty state */}
      {!comparison && (
        <Card className="border-dashed">
          <CardContent className="py-20 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <p className="font-medium">Pick two products to compare</p>
              <p className="text-sm text-muted-foreground mt-1">
                Specs are matched by canonical keys — differences highlighted automatically
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Numeric specs show visual bars so you can see relative differences at a glance</p>
          </CardContent>
        </Card>
      )}

      {comparison && (
        <div className="flex items-center gap-3 text-sm">
          <Badge variant="outline">{totalSpecs} specs compared</Badge>
          <Badge variant="secondary" className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
            {diffCount} difference{diffCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      {comparison && (
        <div className="space-y-5">
          {Object.entries(comparison).map(([category, specs]) => (
            <Card key={category}>
              <CardHeader className="pb-0 pt-4 px-5">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{category}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-5 pb-3">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[35%] text-xs">Specification</TableHead>
                      <TableHead className="text-xs">{productA.model}</TableHead>
                      <TableHead className="text-xs">{productB.model}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specs.map(spec => {
                      const maxNum = (spec.numA !== null && spec.numB !== null) ? Math.max(spec.numA, spec.numB) : (spec.numA || spec.numB);
                      return (
                        <TableRow key={spec.key}
                          className={spec.isDifferent ? 'bg-amber-50/50 dark:bg-amber-950/10 border-l-2 border-l-amber-400' : ''}>
                          <TableCell className="text-sm">{formatSpecKey(spec.key)}</TableCell>
                          <SpecValueCell value={spec.valA} applicability={spec.applicabilityA} numValue={spec.numA} maxNum={maxNum} isNumeric={spec.isNumeric} />
                          <SpecValueCell value={spec.valB} applicability={spec.applicabilityB} numValue={spec.numB} maxNum={maxNum} isNumeric={spec.isNumeric} />
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
