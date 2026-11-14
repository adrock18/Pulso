import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RatingBadge } from '@/components/star-rating';
import { PRODUCTS, CATEGORIES, GENDERS, getCategoriesByGender, displaySpecValue } from '@/data/products';

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

function GridIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ProductCardGrid({ product }) {
  const highlights = [
    product.specs.find(s => s.key === 'battery_runtime_minutes'),
    product.specs.find(s => s.key === 'wattage'),
    product.specs.find(s => s.key === 'length_settings' || s.key === 'attachments_count'),
    product.specs.find(s => s.key === 'weight_grams'),
  ].filter(Boolean).slice(0, 3);

  const categoryLabel = CATEGORIES.find(c => c.id === product.category)?.label || product.category;

  return (
    <div className="group relative">
      <Link to={`/products/${product.id}`}>
        <Card className="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary/20">
          <div className="aspect-[4/3] bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center rounded-t-lg relative overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <span className="text-6xl opacity-20">📦</span>
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
            <div className="flex flex-wrap gap-1">
              {highlights.map(spec => (
                <Badge key={spec.key} variant="outline" className="text-[10px] font-normal py-0">
                  {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                </Badge>
              ))}
            </div>
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
        <Button variant="secondary" size="sm" className="h-6 text-[10px] px-2">Compare</Button>
      </Link>
    </div>
  );
}

function ProductCardList({ product }) {
  const allHighlights = [
    product.specs.find(s => s.key === 'battery_runtime_minutes'),
    product.specs.find(s => s.key === 'wattage'),
    product.specs.find(s => s.key === 'battery_charge_time_hours'),
    product.specs.find(s => s.key === 'length_settings' || s.key === 'attachments_count'),
    product.specs.find(s => s.key === 'weight_grams'),
    product.specs.find(s => s.key === 'blade_material'),
    product.specs.find(s => s.key === 'washable'),
  ].filter(Boolean);

  const categoryLabel = CATEGORIES.find(c => c.id === product.category)?.label || product.category;

  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="p-0">
        <div className="flex gap-4">
          <Link to={`/products/${product.id}`} className="shrink-0 w-36 sm:w-44 aspect-square bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center rounded-l-lg overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <span className="text-4xl opacity-20">📦</span>
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
                <Button variant="outline" size="sm" className="h-7 text-xs">Compare</Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {allHighlights.map(spec => (
                <span key={spec.key} className="text-muted-foreground">
                  <span className="font-medium text-foreground">{displaySpecValue(spec)}</span>
                  {' '}
                  {spec.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace('Minutes', '').replace('Hours', '').replace('Grams', '').trim()}
                </span>
              ))}
            </div>
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

function SidebarFilter({ label, children }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</h4>
      {children}
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const gender = searchParams.get('gender') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'rating-desc';
  const minRating = searchParams.get('rating') || '';
  const view = searchParams.get('view') || 'grid';

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

  let filtered = PRODUCTS.filter(p => {
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      p.name.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.family.toLowerCase().includes(q);
    const matchesGender = !gender || p.gender === gender;
    const matchesCategory = !category || p.category === category;
    const matchesRating = !minRating || p.avgRating >= parseFloat(minRating);
    return matchesQuery && matchesGender && matchesCategory && matchesRating;
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
          <Input type="search" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} className="h-8 w-48 text-sm" />
          <div className="flex border rounded-md">
            <button onClick={() => updateParam('view', 'grid')}
              className={`p-1.5 ${view === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'} rounded-l-md transition-colors`}
              title="Grid view">
              <GridIcon />
            </button>
            <button onClick={() => updateParam('view', 'list')}
              className={`p-1.5 ${view === 'list' ? 'bg-muted' : 'hover:bg-muted/50'} rounded-r-md transition-colors`}
              title="List view">
              <ListIcon />
            </button>
          </div>
          <Select value={sort} onValueChange={v => updateParam('sort', v)}>
            <SelectTrigger className="h-8 w-[150px] text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="pt-4 pb-4 space-y-4">
              <SidebarFilter label="Gender">
                <div className="space-y-1">
                  {GENDERS.map(g => (
                    <button key={g.id} onClick={() => { updateParam('gender', gender === g.id ? '' : g.id); updateParam('category', ''); }}
                      className={`w-full text-left text-sm px-2.5 py-1.5 rounded-md transition-colors ${gender === g.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                      {g.icon} {g.label}
                    </button>
                  ))}
                </div>
              </SidebarFilter>

              <Separator />

              <SidebarFilter label="Category">
                <div className="space-y-1">
                  {availableCategories.map(cat => (
                    <button key={cat.id} onClick={() => updateParam('category', category === cat.id ? '' : cat.id)}
                      className={`w-full text-left text-sm px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between ${category === cat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                      <span>{cat.icon} {cat.label}</span>
                      <span className="text-xs opacity-60">{PRODUCTS.filter(p => p.category === cat.id).length}</span>
                    </button>
                  ))}
                </div>
              </SidebarFilter>

              <Separator />

              <SidebarFilter label="Rating">
                <div className="space-y-1">
                  {['4', '3'].map(r => (
                    <button key={r} onClick={() => updateParam('rating', minRating === r ? '' : r)}
                      className={`w-full text-left text-sm px-2.5 py-1.5 rounded-md transition-colors ${minRating === r ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                      {r}+ stars
                    </button>
                  ))}
                </div>
              </SidebarFilter>

              {activeFilterCount > 0 && (
                <>
                  <Separator />
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setSearchParams({})}>
                    Clear all filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Product grid/list */}
        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 space-y-3">
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
