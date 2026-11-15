import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Package, Scale, CircleDot, GitCompareArrows, X as XIcon,
  BarChart3, Trophy, RefreshCw, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RatingBadge } from '@/components/star-rating';
import { api } from '@/services/api';
import ExplodedView from '@/components/compare/ExplodedView';
import SpecCategoryCard from '@/components/compare/SpecCategoryCard';
import VerdictCard from '@/components/compare/VerdictCard';
import SwapButton from '@/components/compare/SwapButton';

/* ── Category display labels ── */
const CATEGORY_LABELS = {
  'beard-trimmer': 'Beard Trimmers',
  'hair-clipper': 'Hair Clippers',
  'body-groomer': 'Body Groomers',
  'nose-trimmer': 'Nose Trimmers',
  'multi-grooming': 'Multi-Grooming Kits',
  trimmer: 'Trimmers',
};

function categoryLabel(slug) {
  return CATEGORY_LABELS[slug] || slug || 'products';
}

/* ── Skeleton block for loading state ── */
function SkeletonBar({ className = '' }) {
  return (
    <div className={`rounded-md bg-muted/50 animate-pulse ${className}`} />
  );
}

function ComparisonSkeleton() {
  return (
    <div className="space-y-5">
      {/* Exploded view skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/40 p-8 flex flex-col items-center gap-4">
          <SkeletonBar className="w-24 h-24 rounded-xl" />
          <div className="flex gap-3">
            <SkeletonBar className="w-16 h-6 rounded-full" />
            <SkeletonBar className="w-20 h-6 rounded-full" />
            <SkeletonBar className="w-14 h-6 rounded-full" />
          </div>
        </div>
        <div className="rounded-xl border border-border/40 p-8 flex flex-col items-center gap-4">
          <SkeletonBar className="w-24 h-24 rounded-xl" />
          <div className="flex gap-3">
            <SkeletonBar className="w-16 h-6 rounded-full" />
            <SkeletonBar className="w-20 h-6 rounded-full" />
            <SkeletonBar className="w-14 h-6 rounded-full" />
          </div>
        </div>
      </div>
      {/* Category card skeletons */}
      {[1, 2, 3].map((n) => (
        <div key={n} className="rounded-xl border border-border/40 overflow-hidden">
          <div className="px-5 py-3.5 bg-muted/20">
            <SkeletonBar className="w-32 h-5" />
          </div>
          <div className="px-5 py-3 space-y-3">
            {[1, 2, 3].map((r) => (
              <div key={r} className="grid grid-cols-3 gap-4">
                <SkeletonBar className="h-4" />
                <SkeletonBar className="h-4" />
                <SkeletonBar className="h-4" />
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Verdict skeleton */}
      <div className="rounded-xl border border-border/40 p-5 space-y-3">
        <SkeletonBar className="w-48 h-5" />
        <SkeletonBar className="w-full h-3 rounded-full" />
        <SkeletonBar className="w-40 h-4 mx-auto" />
      </div>
    </div>
  );
}

/* ── Product selector card shown below the dropdown ── */
function ProductPreviewCard({ product }) {
  if (!product) {
    return (
      <div className="h-48 rounded-xl border border-dashed border-border/60 flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
        <Package size={28} />
        <span className="text-xs">Select a product above</span>
      </div>
    );
  }

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardContent className="p-0">
        {/* Product image */}
        <div className="h-28 bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full object-contain p-3" />
          ) : (
            <Package size={36} className="text-muted-foreground/15" />
          )}
        </div>
        {/* Info */}
        <div className="p-4 space-y-3">
          <div>
            <p className="font-semibold text-sm leading-snug">{product.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.description}</p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <RatingBadge rating={product.avgRating} reviewCount={product.reviewCount} />
            {product.priceRange && (
              <span className="text-xs font-medium text-muted-foreground">{product.priceRange}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ══════════════════════════════════════════════
   Main compare page
   ══════════════════════════════════════════════ */
export default function ComparePage() {
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  const [idA, setIdA] = useState(searchParams.get('a') || '');
  const [idB, setIdB] = useState(searchParams.get('b') || '');

  const [products, setProducts] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ── Fetch all products on mount ── */
  useEffect(() => {
    api.get('/products').then(setProducts).catch(() => {});
  }, []);

  /* ── Update URL params when selections change ── */
  useEffect(() => {
    const params = {};
    if (idA) params.a = idA;
    if (idB) params.b = idB;
    setSearchParams(params, { replace: true });
  }, [idA, idB, setSearchParams]);

  /* ── Determine Product A object and category ── */
  const productA = useMemo(
    () => products.find((p) => p.id === idA) || null,
    [products, idA],
  );

  const productACategory = productA?.family?.category || null;

  /* ── Filter Product B options to same category ── */
  const productBOptions = useMemo(() => {
    if (!productACategory) return products;
    return products.filter(
      (p) => p.family?.category === productACategory && p.id !== idA,
    );
  }, [products, productACategory, idA]);

  const productB = useMemo(
    () => products.find((p) => p.id === idB) || null,
    [products, idB],
  );

  /* ── When Product A changes category, clear Product B ── */
  useEffect(() => {
    if (!idB || !productACategory) return;
    const currentB = products.find((p) => p.id === idB);
    if (currentB && currentB.family?.category !== productACategory) {
      setIdB('');
    }
  }, [productACategory, idB, products]);

  /* ── Fetch comparison data ── */
  useEffect(() => {
    if (!idA || !idB) {
      setComparison(null);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get(`/comparison?a=${encodeURIComponent(idA)}&b=${encodeURIComponent(idB)}`)
      .then((data) => {
        setComparison(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setComparison(null);
      })
      .finally(() => setLoading(false));
  }, [idA, idB]);

  /* ── Derived stats ── */
  const totalSpecs = comparison
    ? comparison.categories.reduce((s, c) => s + c.specs.length, 0)
    : 0;
  const diffCount = comparison
    ? comparison.categories.reduce(
        (s, c) => s + c.specs.filter((x) => x.isDifferent).length,
        0,
      )
    : 0;

  /* ── Swap handler ── */
  function swapProducts() {
    setIdA(idB);
    setIdB(idA);
  }

  /* ── Retry handler ── */
  function retryComparison() {
    if (!idA || !idB) return;
    setLoading(true);
    setError(null);
    api
      .get(`/comparison?a=${encodeURIComponent(idA)}&b=${encodeURIComponent(idB)}`)
      .then((data) => {
        setComparison(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setComparison(null);
      })
      .finally(() => setLoading(false));
  }

  /* ── Motion helpers ── */
  const instant = { duration: 0 };
  const fadeIn = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: instant }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      };

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb ── */}
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-medium">Compare</span>
      </nav>

      {/* ── Page header ── */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <GitCompareArrows size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Compare Products</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Select two products to see a detailed specification comparison
            </p>
          </div>
        </div>
      </div>

      {/* ── Selectors row with swap button ── */}
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-start">
        {/* Product A selector */}
        <motion.div
          layout={!reduceMotion}
          layoutId={reduceMotion ? undefined : 'selector-a'}
          transition={reduceMotion ? instant : { type: 'spring', stiffness: 300, damping: 30 }}
          className="space-y-3"
        >
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Product A
          </label>
          <Select value={idA} onValueChange={setIdA}>
            <SelectTrigger className={`h-11 ${idA ? 'ring-2 ring-primary/20' : ''}`}>
              <SelectValue placeholder="Choose a product..." />
            </SelectTrigger>
            <SelectContent>
              {products
                .filter((p) => p.id !== idB)
                .map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="font-medium">{p.model}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{p.family?.name || ''}</span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <ProductPreviewCard product={productA} />
        </motion.div>

        {/* Swap button — centered between selectors */}
        <div className="hidden md:flex items-center justify-center pt-10">
          <SwapButton onSwap={swapProducts} />
        </div>
        {/* Mobile swap button */}
        <div className="flex md:hidden items-center justify-center -my-2">
          <SwapButton onSwap={swapProducts} />
        </div>

        {/* Product B selector */}
        <motion.div
          layout={!reduceMotion}
          layoutId={reduceMotion ? undefined : 'selector-b'}
          transition={reduceMotion ? instant : { type: 'spring', stiffness: 300, damping: 30 }}
          className="space-y-3"
        >
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-2" />
            Product B
          </label>
          <Select
            value={idB}
            onValueChange={setIdB}
            disabled={!idA && productBOptions.length === 0}
          >
            <SelectTrigger className={`h-11 ${idB ? 'ring-2 ring-chart-2/20' : ''}`}>
              <SelectValue placeholder="Choose a product..." />
            </SelectTrigger>
            <SelectContent>
              {productBOptions
                .filter((p) => p.id !== idA)
                .map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="font-medium">{p.model}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{p.family?.name || ''}</span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {/* Category filter label */}
          {idA && productACategory && (
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Scale size={11} />
              Showing {categoryLabel(productACategory)} only
            </p>
          )}
          <ProductPreviewCard product={productB} />
        </motion.div>
      </div>

      {/* ── Comparison body ── */}
      <AnimatePresence mode="wait">
        {/* Loading state */}
        {loading && (
          <motion.div
            key="loading"
            {...fadeIn}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? instant : { duration: 0.15 }}
          >
            <ComparisonSkeleton />
          </motion.div>
        )}

        {/* Error state */}
        {error && !loading && (
          <motion.div
            key="error"
            {...fadeIn}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? instant : { duration: 0.15 }}
          >
            <Card className="border-destructive/40">
              <CardContent className="py-10 text-center space-y-3">
                <XIcon size={20} className="mx-auto text-destructive/60" />
                <p className="text-destructive font-medium text-sm">Comparison failed</p>
                <p className="text-xs text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm" className="gap-1.5 mt-2" onClick={retryComparison}>
                  <RefreshCw size={14} />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty state */}
        {!comparison && !loading && !error && (
          <motion.div
            key="empty"
            {...fadeIn}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? instant : { duration: 0.15 }}
          >
            <div className="relative rounded-2xl border border-dashed border-border/50 compare-empty-grid overflow-hidden">
              <div className="relative py-24 flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center">
                  <Scale size={28} className="text-muted-foreground/30" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Select two products above</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                    Every specification compared side by side, with winner highlighting and visual bars for numeric values.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Trophy size={12} className="text-emerald-500" />
                    Better value highlighted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="diff-dot" />
                    Differences marked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 size={12} />
                    Visual bars for numbers
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison results */}
        {comparison && !loading && (
          <motion.div
            key={`comparison-${comparison.productA.id}-${comparison.productB.id}`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? instant : { type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            {/* Exploded views — side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="rounded-xl border border-border/40 overflow-hidden"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={reduceMotion ? instant : { type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="px-4 py-2.5 border-b border-border/30 bg-muted/15 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-semibold">{comparison.productA.model}</span>
                </div>
                <ExplodedView product={comparison.productA} />
              </motion.div>

              <motion.div
                className="rounded-xl border border-border/40 overflow-hidden"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={
                  reduceMotion
                    ? instant
                    : { type: 'spring', stiffness: 300, damping: 30, delay: 0.05 }
                }
              >
                <div className="px-4 py-2.5 border-b border-border/30 bg-muted/15 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-chart-2" />
                  <span className="text-xs font-semibold">{comparison.productB.model}</span>
                </div>
                <ExplodedView product={comparison.productB} />
              </motion.div>
            </div>

            {/* Spec category cards — staggered entrance */}
            <div className="space-y-3">
              {comparison.categories.map((category, index) => (
                <SpecCategoryCard
                  key={category.name}
                  category={category}
                  productAModel={comparison.productA.model}
                  productBModel={comparison.productB.model}
                  delay={reduceMotion ? 0 : index * 0.1}
                />
              ))}
            </div>

            {/* Verdict card */}
            <VerdictCard
              categories={comparison.categories}
              productA={comparison.productA}
              productB={comparison.productB}
            />

            {/* Stats badges */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1">
                <Scale size={12} />
                <strong className="tabular-nums">{totalSpecs}</strong> specs compared
              </Badge>
              <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1">
                <CircleDot size={12} className="text-amber-500" />
                <strong className="tabular-nums">{diffCount}</strong> difference{diffCount !== 1 ? 's' : ''}
              </Badge>
            </div>

            {/* Bottom product links */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <Link to={`/products/${comparison.productA.id}`}>
                  View {comparison.productA.model}
                  <ArrowRight size={14} />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <Link to={`/products/${comparison.productB.id}`}>
                  View {comparison.productB.model}
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
