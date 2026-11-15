import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutGrid, List, Search, SlidersHorizontal, Star, X, Package,
  GitCompareArrows,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RatingBadge } from '@/components/star-rating';
import { CategoryIcon } from '@/lib/icons';
import { CATEGORIES, GENDERS, getCategoriesByGender } from '@/data/products';
import { api } from '@/services/api';

const SORT_OPTIONS = [
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
  { value: 'reviews-desc', label: 'Most Reviewed' },
  { value: 'name-asc', label: 'Name A–Z' },
];

function Breadcrumb({ gender, category }) {
  const genderObj = GENDERS.find(g => g.id === gender);
  const catObj = CATEGORIES.find(c => c.id === category);
  return (
    <nav className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
      <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
      <span className="text-muted-foreground/40">/</span>
      <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
      {genderObj && (
        <>
          <span className="text-muted-foreground/40">/</span>
          <Link to={`/products?gender=${gender}`} className="hover:text-foreground transition-colors">{genderObj.label}</Link>
        </>
      )}
      {catObj && catObj.id !== 'all' && (
        <>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground">{catObj.label}</span>
        </>
      )}
    </nav>
  );
}

function ProductCardGrid({ product }) {
  const categoryLabel = CATEGORIES.find(c => c.id === product.family?.category)?.label || product.family?.category || '';

  return (
    <div className="group relative">
      <Link to={`/products/${product.id}`}>
        <Card className="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary/20">
          <div className="aspect-[4/3] bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center rounded-t-lg relative overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <Package size={48} className="text-muted-foreground/15" />
            )}
            <div className="absolute top-2.5 left-2.5 flex gap-1.5">
              <Badge variant="secondary" className="text-[10px] font-normal">{categoryLabel}</Badge>
            </div>
            {product.priceRange && (
              <Badge variant="outline" className="absolute top-2.5 right-2.5 text-[10px] bg-background/80 backdrop-blur-sm">
                {product.priceRange}
              </Badge>
            )}
          </div>
          <CardHeader className="pb-2 pt-3">
            <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
          </CardHeader>
          <CardContent className="space-y-2.5 pb-3">
            {product.family?.name && (
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[10px] font-normal py-0">
                  {product.family.name}
                </Badge>
              </div>
            )}
            <div className="flex items-center justify-between">
              <RatingBadge rating={product.avgRating} reviewCount={product.reviewCount} />
              {product.verifiedReviewCount > 0 && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{product.verifiedReviewCount} verified</span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to={`/compare?a=${product.id}`} className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="secondary" size="sm" className="h-6 text-[10px] px-2 gap-1">
          <GitCompareArrows size={10} />
          Compare
        </Button>
      </Link>
    </div>
  );
}

function ProductCardList({ product }) {
  const categoryLabel = CATEGORIES.find(c => c.id === product.family?.category)?.label || product.family?.category || '';

  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="p-0">
        <div className="flex gap-4">
          <Link to={`/products/${product.id}`} className="shrink-0 w-36 sm:w-44 aspect-square bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center rounded-l-lg overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <Package size={40} className="text-muted-foreground/15" />
            )}
          </Link>
          <div className="flex-1 py-4 pr-4 space-y-2 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px] font-normal">{categoryLabel}</Badge>
                  {product.priceRange && (
                    <span className="text-xs text-muted-foreground">{product.priceRange}</span>
                  )}
                </div>
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.description}</p>
              </div>
              <Link to={`/compare?a=${product.id}`} className="shrink-0">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                  <GitCompareArrows size={12} />
                  Compare
                </Button>
              </Link>
            </div>
            {product.family?.name && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{product.family.name}</span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <RatingBadge rating={product.avgRating} reviewCount={product.reviewCount} />
              {product.verifiedReviewCount > 0 && (
                <span className="text-[10px] text-emerald-600 font-medium">{product.verifiedReviewCount} verified</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SidebarFilter({ label, icon: Icon, children }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        {Icon && <Icon size={12} />}
        {label}
      </h4>
      {children}
    </div>
  );
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const gender = searchParams.get('gender') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'rating-desc';
  const minRating = searchParams.get('rating') || '';
  const view = searchParams.get('view') || 'grid';

  const debouncedQuery = useDebounce(query, 300);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (gender) params.set('gender', gender);
    if (category) params.set('category', category);

    let cancelled = false;
    setLoading(true);

    api.get(`/products?${params}`)
      .then(data => {
        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery, gender, category]);

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params, { replace: true });
  }

  const availableCategories = useMemo(() => {
    if (gender) return getCategoriesByGender(gender);
    return CATEGORIES.filter(c => c.id !== 'all');
  }, [gender]);

  let filtered = products.filter(p => {
    const matchesRating = !minRating || p.avgRating >= parseFloat(minRating);
    return matchesRating;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'rating-desc': return b.avgRating - a.avgRating;
      case 'rating-asc': return a.avgRating - b.avgRating;
      case 'reviews-desc': return b.reviewCount - a.reviewCount;
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const activeFilterCount = [gender, category, minRating].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <Breadcrumb gender={gender} category={category} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {category ? (CATEGORIES.find(c => c.id === category)?.label || 'Products') :
             gender ? (GENDERS.find(g => g.id === gender)?.label || 'Products') :
             'All Products'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-8 w-48 text-sm pl-8"
            />
          </div>
          <div className="flex border rounded-md">
            <button
              onClick={() => updateParam('view', 'grid')}
              className={`p-1.5 ${view === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'} rounded-l-md transition-colors`}
              title="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => updateParam('view', 'list')}
              className={`p-1.5 ${view === 'list' ? 'bg-muted' : 'hover:bg-muted/50'} rounded-r-md transition-colors`}
              title="List view"
            >
              <List size={14} />
            </button>
          </div>
          <Select value={sort} onValueChange={v => updateParam('sort', v)}>
            <SelectTrigger className="h-8 w-[150px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card className="glass">
            <CardContent className="pt-4 pb-4 space-y-4">
              <SidebarFilter label="Gender" icon={SlidersHorizontal}>
                <div className="space-y-1">
                  {GENDERS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => { updateParam('gender', gender === g.id ? '' : g.id); updateParam('category', ''); }}
                      className={`w-full text-left text-sm px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
                        gender === g.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      <CategoryIcon name={g.icon} size={14} className={gender === g.id ? 'text-primary-foreground' : 'text-muted-foreground'} />
                      {g.label}
                    </button>
                  ))}
                </div>
              </SidebarFilter>

              <Separator />

              <SidebarFilter label="Category">
                <div className="space-y-1">
                  {availableCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', category === cat.id ? '' : cat.id)}
                      className={`w-full text-left text-sm px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                        category === cat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CategoryIcon name={cat.icon} size={14} className={category === cat.id ? 'text-primary-foreground' : 'text-muted-foreground'} />
                        {cat.label}
                      </span>
                      <span className="text-xs opacity-60">
                        {products.filter(p => p.family?.category === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </SidebarFilter>

              <Separator />

              <SidebarFilter label="Rating" icon={Star}>
                <div className="space-y-1">
                  {['4', '3'].map(r => (
                    <button
                      key={r}
                      onClick={() => updateParam('rating', minRating === r ? '' : r)}
                      className={`w-full text-left text-sm px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
                        minRating === r ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      <Star size={12} className={minRating === r ? 'text-primary-foreground fill-primary-foreground' : 'text-amber-400 fill-amber-400'} />
                      {r}+ stars
                    </button>
                  ))}
                </div>
              </SidebarFilter>

              {activeFilterCount > 0 && (
                <>
                  <Separator />
                  <Button variant="ghost" size="sm" className="w-full text-xs gap-1.5" onClick={() => setSearchParams({})}>
                    <X size={12} />
                    Clear all filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Product grid/list */}
        <div>
          {loading ? (
            <div className="text-center py-20 space-y-3">
              <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-destructive">Failed to load products: {error}</p>
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Package size={40} className="mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">No products match your filters</p>
              <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setSearchParams({}); }}>Clear filters</Button>
            </div>
          ) : view === 'list' ? (
            <div className="space-y-3">
              {filtered.map(product => <ProductCardList key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(product => <ProductCardGrid key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
