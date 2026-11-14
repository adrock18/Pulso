import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { StarRating, RatingBadge } from '@/components/star-rating';
import { PRODUCTS, CATEGORIES, GENDERS, getCategoriesByGender, getAllReviews, getProductById } from '@/data/products';

import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ComparePage from '@/pages/ComparePage';
import CommunityPage from '@/pages/CommunityPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function NavLink({ to, children }) {
  const { pathname, search } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/') || (pathname + search).startsWith(to);
  return (
    <Button variant="ghost" size="sm" asChild className={active ? 'bg-accent text-accent-foreground' : ''}>
      <Link to={to}>{children}</Link>
    </Button>
  );
}

function GenderDropdown({ gender }) {
  const g = GENDERS.find(gn => gn.id === gender);
  const cats = getCategoriesByGender(gender);
  const { pathname, search } = useLocation();
  const isActive = (pathname === '/products' && search.includes(`gender=${gender}`));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-1 ${isActive ? 'bg-accent text-accent-foreground' : ''}`}>
          {g.label}
          <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{g.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/products?gender=${gender}`} className="cursor-pointer">
            All {g.label} <Badge variant="secondary" className="ml-auto text-[10px]">{PRODUCTS.filter(p => p.gender === gender).length}</Badge>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {cats.map(cat => (
          <DropdownMenuItem key={cat.id} asChild>
            <Link to={`/products?gender=${gender}&category=${cat.id}`} className="cursor-pointer">
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
              <Badge variant="outline" className="ml-auto text-[10px]">{PRODUCTS.filter(p => p.category === cat.id).length}</Badge>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 bg-background border-r shadow-lg overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-semibold">Pulso</span>
          </Link>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          {GENDERS.map(g => (
            <div key={g.id}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{g.label}</h3>
              <div className="space-y-1">
                <Link to={`/products?gender=${g.id}`} onClick={onClose} className="block text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors">
                  All {g.label}
                </Link>
                {getCategoriesByGender(g.id).map(cat => (
                  <Link key={cat.id} to={`/products?gender=${g.id}&category=${cat.id}`} onClick={onClose} className="block text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors">
                    {cat.icon} {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Separator />
          <div className="space-y-1">
            <Link to="/compare" onClick={onClose} className="block text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors font-medium">Compare</Link>
            <Link to="/community" onClick={onClose} className="block text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors font-medium">Community</Link>
          </div>
          <Separator />
          <div className="space-y-2">
            <Button variant="outline" size="sm" asChild className="w-full"><Link to="/login" onClick={onClose}>Sign in</Link></Button>
            <Button size="sm" asChild className="w-full"><Link to="/register" onClick={onClose}>Get started</Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-1.5 -ml-1.5 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(true)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <span className="text-lg font-semibold tracking-tight">Pulso</span>
              </Link>
              <Separator orientation="vertical" className="h-5 hidden md:block" />
              <div className="hidden md:flex items-center gap-0.5">
                <GenderDropdown gender="men" />
                <GenderDropdown gender="women" />
                <NavLink to="/compare">Compare</NavLink>
                <NavLink to="/community">Community</NavLink>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">P</span>
                </div>
                <span className="text-sm font-semibold">Pulso</span>
              </div>
              <p className="text-xs text-muted-foreground">Product intelligence for Philips personal care</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Men</h4>
              <div className="space-y-1.5">
                {getCategoriesByGender('men').map(cat => (
                  <Link key={cat.id} to={`/products?gender=men&category=${cat.id}`} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{cat.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Women</h4>
              <div className="space-y-1.5">
                {getCategoriesByGender('women').map(cat => (
                  <Link key={cat.id} to={`/products?gender=women&category=${cat.id}`} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{cat.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Platform</h4>
              <div className="space-y-1.5">
                <Link to="/compare" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Compare Products</Link>
                <Link to="/community" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Community Reviews</Link>
                <Link to="/register" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Create Account</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  const recentReviews = getAllReviews().slice(0, 3);
  const topProducts = [...PRODUCTS].sort((a, b) => b.avgRating - a.avgRating).slice(0, 4);
  const browsableCategories = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div className="space-y-12 py-2">
      {/* Hero with search */}
      <section className="flex flex-col items-center text-center gap-5 pt-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-2xl leading-[1.15]">
          Compare specs. Read verified reviews.<br />
          <span className="text-muted-foreground">Make better choices.</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-lg">
          Real manufacturer specifications and verified customer reviews for Philips personal care products.
        </p>
        <div className="w-full max-w-md relative">
          <Input placeholder="Search products, categories, or specs..." className="h-11 pl-10 pr-4 rounded-full" />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {browsableCategories.map(cat => {
            const count = PRODUCTS.filter(p => p.category === cat.id).length;
            const genderParam = cat.gender ? `gender=${cat.gender}&` : '';
            return (
              <Link key={cat.id} to={`/products?${genderParam}category=${cat.id}`}>
                <Card className="group transition-all hover:shadow-md hover:border-primary/30 cursor-pointer h-full">
                  <CardContent className="pt-5 pb-4 text-center space-y-2">
                    <div className="text-2xl">{cat.icon}</div>
                    <h3 className="text-xs font-semibold group-hover:text-primary transition-colors">{cat.label}</h3>
                    <p className="text-[10px] text-muted-foreground">{count} product{count !== 1 ? 's' : ''}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Gender sections side by side */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/products?gender=men">
          <Card className="group transition-all hover:shadow-md hover:border-primary/30 overflow-hidden">
            <CardContent className="pt-6 pb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Men's Grooming</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Trimmers, shavers, body groomers</p>
                <p className="text-xs text-muted-foreground mt-2">{PRODUCTS.filter(p => p.gender === 'men').length} products</p>
              </div>
              <span className="text-5xl opacity-40 group-hover:opacity-60 transition-opacity">🧔</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/products?gender=women">
          <Card className="group transition-all hover:shadow-md hover:border-primary/30 overflow-hidden">
            <CardContent className="pt-6 pb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Women's Care</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Hair dryers, straighteners</p>
                <p className="text-xs text-muted-foreground mt-2">{PRODUCTS.filter(p => p.gender === 'women').length} products</p>
              </div>
              <span className="text-5xl opacity-40 group-hover:opacity-60 transition-opacity">💇</span>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Top Rated */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Top Rated</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products">View all →</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map(product => (
            <Link key={product.id} to={`/products/${product.id}`} className="group">
              <Card className="transition-all group-hover:shadow-sm group-hover:border-primary/20">
                <CardContent className="pt-4 space-y-2">
                  <div className="w-full aspect-[3/2] bg-muted/50 rounded-md flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-3xl opacity-20">📦</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-primary transition-colors truncate">{product.name}</h3>
                  <RatingBadge rating={product.avgRating} reviewCount={product.reviewCount} />
                  {product.priceRange && <p className="text-xs text-muted-foreground">{product.priceRange}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-0 shadow-none bg-muted/50">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2"><span className="text-lg">📋</span></div>
            <CardTitle className="text-base">Sourced Specifications</CardTitle>
            <CardDescription>Every spec links to manufacturer data with a verification date.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-none bg-muted/50">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2"><span className="text-lg">⚡</span></div>
            <CardTitle className="text-base">Dynamic Comparison</CardTitle>
            <CardDescription>Pick any two products and compare every spec. Swap instantly.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-none bg-muted/50">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2"><span className="text-lg">✓</span></div>
            <CardTitle className="text-base">Verified Reviews</CardTitle>
            <CardDescription>Prove ownership with your serial number. Verified purchases are labeled.</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Community */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">From the Community</h2>
          <Button variant="ghost" size="sm" asChild><Link to="/community">See all →</Link></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentReviews.map(review => {
            const product = getProductById(review.productId);
            return (
              <Card key={review.id} className="transition-all hover:shadow-sm">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {review.isAnonymous ? '?' : review.displayName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-medium">
                        {review.isAnonymous ? 'Anonymous' : review.displayName}
                        {review.isVerified && <span className="text-emerald-600 ml-1">✓</span>}
                      </p>
                      <StarRating rating={review.overallRating} size="text-[10px]" />
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2">{review.positiveText || review.negativeText}</p>
                  <Link to={`/products/${review.productId}`} className="text-xs text-primary hover:underline block">on {product?.name}</Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <h1 className="text-7xl font-bold text-muted-foreground/30">404</h1>
      <p className="text-muted-foreground text-lg">This page doesn't exist</p>
      <Button variant="outline" asChild><Link to="/">Back to home</Link></Button>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
