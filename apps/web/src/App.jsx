import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Sun, Moon, Menu, X, ChevronDown, ArrowRight,
  ClipboardList, Zap, BadgeCheck, Package,
  GitCompareArrows, Users, LogOut, UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { StarRating, RatingBadge } from '@/components/star-rating';
import { CategoryIcon } from '@/lib/icons';
import { PRODUCTS, CATEGORIES, GENDERS, getCategoriesByGender, getAllReviews, getProductById } from '@/data/products';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ComparePage from '@/pages/ComparePage';
import CommunityPage from '@/pages/CommunityPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminTrendsPage from '@/pages/AdminTrendsPage';

/* ── Theme toggle button ───────────────────── */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="theme-toggle rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

/* ── Nav link with active state ────────────── */
function NavLink({ to, children }) {
  const { pathname, search } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/') || (pathname + search).startsWith(to);
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={active ? 'nav-link-active text-foreground' : 'text-muted-foreground hover:text-foreground'}
    >
      <Link to={to}>{children}</Link>
    </Button>
  );
}

/* ── Gender dropdown in nav ────────────────── */
function GenderDropdown({ gender }) {
  const g = GENDERS.find(gn => gn.id === gender);
  const cats = getCategoriesByGender(gender);
  const { pathname, search } = useLocation();
  const isActive = (pathname === '/products' && search.includes(`gender=${gender}`));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 h-7 text-sm font-medium hover:bg-muted transition-colors ${isActive ? 'nav-link-active text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          <CategoryIcon name={g.icon} size={14} className="opacity-70" />
          {g.label}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">{g.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/products?gender=${gender}`} className="cursor-pointer">
            All {g.label}
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {PRODUCTS.filter(p => p.gender === gender).length}
            </Badge>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {cats.map(cat => (
          <DropdownMenuItem key={cat.id} asChild>
            <Link to={`/products?gender=${gender}&category=${cat.id}`} className="cursor-pointer">
              <CategoryIcon name={cat.icon} size={14} className="mr-2 text-muted-foreground" />
              {cat.label}
              <Badge variant="outline" className="ml-auto text-[10px]">
                {PRODUCTS.filter(p => p.category === cat.id).length}
              </Badge>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Mobile menu ───────────────────────────── */
function MobileMenu({ open, onClose, user, logout }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className={`absolute inset-0 bg-black/40 mobile-menu-overlay ${visible ? 'open' : ''}`} onClick={onClose} />
      <div className={`absolute inset-y-0 left-0 w-72 bg-background border-r shadow-lg overflow-y-auto mobile-menu-panel ${visible ? 'open' : ''}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-semibold">Pulso</span>
          </Link>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {GENDERS.map(g => (
            <div key={g.id}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                <CategoryIcon name={g.icon} size={12} />
                {g.label}
              </h3>
              <div className="space-y-1">
                <Link to={`/products?gender=${g.id}`} onClick={onClose} className="block text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors">
                  All {g.label}
                </Link>
                {getCategoriesByGender(g.id).map(cat => (
                  <Link key={cat.id} to={`/products?gender=${g.id}&category=${cat.id}`} onClick={onClose} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors">
                    <CategoryIcon name={cat.icon} size={14} className="text-muted-foreground" />
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Separator />
          <div className="space-y-1">
            <Link to="/compare" onClick={onClose} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors font-medium">
              <GitCompareArrows size={14} className="text-muted-foreground" />
              Compare
            </Link>
            <Link to="/community" onClick={onClose} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-muted transition-colors font-medium">
              <Users size={14} className="text-muted-foreground" />
              Community
            </Link>
          </div>
          <Separator />
          <div className="space-y-2">
            {user ? (
              <>
                <div className="px-2 py-1.5 text-sm font-medium truncate flex items-center gap-2">
                  <UserCircle size={14} className="text-muted-foreground" />
                  {user.name}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); onClose(); }}>
                  <LogOut size={14} className="mr-2" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/login" onClick={onClose}>Sign in</Link>
                </Button>
                <Button size="sm" asChild className="w-full">
                  <Link to="/register" onClick={onClose}>Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Layout with nav and footer ────────────── */
function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} user={user} logout={logout} />

      {/* ── Navigation ── */}
      <nav
        ref={navRef}
        className={`sticky top-0 z-50 border-b transition-all duration-200 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-border shadow-sm'
            : 'bg-background/95 backdrop-blur-sm border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-1.5 -ml-1.5 hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center logo-mark">
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
              <ThemeToggle />
              {user ? (
                <>
                  <span className="text-sm font-medium hidden sm:inline-flex text-muted-foreground items-center gap-1.5">
                    <UserCircle size={14} />
                    {user.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
                    <LogOut size={14} />
                    <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="footer-gradient border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">P</span>
                </div>
                <span className="text-sm font-semibold">Pulso</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                Product intelligence for Philips personal care. Compare specs, read verified reviews, make informed decisions.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Men</h4>
              <div className="space-y-2">
                {getCategoriesByGender('men').map(cat => (
                  <Link key={cat.id} to={`/products?gender=men&category=${cat.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground link-draw transition-colors">
                    <CategoryIcon name={cat.icon} size={12} className="opacity-50" />
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Women</h4>
              <div className="space-y-2">
                {getCategoriesByGender('women').map(cat => (
                  <Link key={cat.id} to={`/products?gender=women&category=${cat.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground link-draw transition-colors">
                    <CategoryIcon name={cat.icon} size={12} className="opacity-50" />
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Platform</h4>
              <div className="space-y-2">
                <Link to="/compare" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground link-draw transition-colors">
                  <GitCompareArrows size={12} className="opacity-50" />
                  Compare Products
                </Link>
                <Link to="/community" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground link-draw transition-colors">
                  <Users size={12} className="opacity-50" />
                  Community Reviews
                </Link>
                <Link to="/register" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground link-draw transition-colors">
                  <UserCircle size={12} className="opacity-50" />
                  Create Account
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Built for informed decisions
            </p>
            <p className="text-xs text-muted-foreground/70">
              Pulso is not affiliated with Philips
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Home page / Landing page ──────────────── */
function HomePage() {
  const recentReviews = getAllReviews().slice(0, 3);
  const topProducts = [...PRODUCTS].sort((a, b) => b.avgRating - a.avgRating).slice(0, 4);
  const browsableCategories = CATEGORIES.filter(c => c.id !== 'all');
  const totalReviews = PRODUCTS.reduce((sum, p) => sum + p.reviewCount, 0);

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* ── Hero — fills the first screen ── */}
      <section className="relative flex flex-col items-center text-center pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Background pattern — fades to page bg */}
        <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <div className="relative hero-stagger max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 text-xs text-muted-foreground mb-8">
            <Zap size={12} className="text-primary" />
            Product intelligence for Philips grooming
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08]">
            Compare specs.{' '}
            <span className="gradient-text">Read real reviews.</span>
            <br />
            Choose with confidence.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mt-6 leading-relaxed">
            Manufacturer specifications and verified customer reviews for Philips personal care — in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Button size="lg" asChild className="gap-2 h-11 px-6">
              <Link to="/products">
                Browse products
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="gap-2 h-11 px-6">
              <Link to="/compare">
                <GitCompareArrows size={16} />
                Compare now
              </Link>
            </Button>
          </div>

          {/* Stats — hard facts on the first screen */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Package size={14} className="text-primary" />
              <span><strong className="text-foreground tabular-nums">12</strong> products</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <ClipboardList size={14} className="text-primary" />
              <span><strong className="text-foreground tabular-nums">6</strong> categories</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <BadgeCheck size={14} className="text-primary" />
              <span><strong className="text-foreground tabular-nums">{totalReviews}</strong> reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features — three pillars ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: ClipboardList,
            title: 'Sourced specifications',
            desc: 'Every spec links to the manufacturer page it came from, with a verification date.',
          },
          {
            icon: Zap,
            title: 'Side-by-side comparison',
            desc: 'Pick any two products and compare every specification. Swap either product without reloading.',
          },
          {
            icon: BadgeCheck,
            title: 'Verified reviews',
            desc: 'Enter your serial number for a Verified Purchase label. No serial, no badge.',
          },
        ].map((feature, i) => (
          <Card key={i} className="group card-hover">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2 transition-colors duration-200 group-hover:bg-primary/15">
                <feature.icon size={20} className="text-primary" />
              </div>
              <CardTitle className="text-base">{feature.title}</CardTitle>
              <CardDescription className="leading-relaxed">{feature.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* ── Shop by Category ── */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Browse by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {browsableCategories.map((cat, i) => {
            const count = PRODUCTS.filter(p => p.category === cat.id).length;
            const genderParam = cat.gender ? `gender=${cat.gender}&` : '';
            return (
              <Link key={cat.id} to={`/products?${genderParam}category=${cat.id}`}>
                <Card className="group cursor-pointer h-full card-hover">
                  <CardContent className="pt-5 pb-4 text-center space-y-2.5">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <CategoryIcon name={cat.icon} size={20} className="text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xs font-semibold group-hover:text-primary transition-colors">{cat.label}</h3>
                    <p className="text-[10px] text-muted-foreground">{count} product{count !== 1 ? 's' : ''}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Gender sections ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GENDERS.map(g => (
          <Link key={g.id} to={`/products?gender=${g.id}`}>
            <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-primary/30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <CardContent className="pt-7 pb-6 flex items-center justify-between relative">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{g.label}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {g.id === 'men' ? 'Trimmers, shavers, body groomers' : 'Hair dryers, straighteners'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {PRODUCTS.filter(p => p.gender === g.id).length} products
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-all duration-300 group-hover:scale-110">
                  <CategoryIcon name={g.icon} size={28} className="text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* ── Top Rated ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Top rated</h2>
          <Button variant="ghost" size="sm" asChild className="group-arrow gap-1.5">
            <Link to="/products">
              View all <ArrowRight size={14} className="view-all-arrow" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map(product => (
            <Link key={product.id} to={`/products/${product.id}`} className="group">
              <Card className="transition-all duration-150 group-hover:shadow-md group-hover:border-primary/20 group-hover:-translate-y-0.5">
                <CardContent className="pt-4 space-y-2">
                  <div className="w-full aspect-[3/2] bg-muted/50 rounded-md flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Package size={32} className="text-muted-foreground/20" />
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

      {/* ── Community Preview ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">From the community</h2>
          <Button variant="ghost" size="sm" asChild className="group-arrow gap-1.5">
            <Link to="/community">
              See all <ArrowRight size={14} className="view-all-arrow" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentReviews.map(review => {
            const product = getProductById(review.productId);
            return (
              <Card key={review.id} className="transition-all duration-150 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-semibold text-primary">
                      {review.isAnonymous ? '?' : review.displayName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-medium flex items-center gap-1.5">
                        {review.isAnonymous ? 'Anonymous' : review.displayName}
                        {review.isVerified && <BadgeCheck size={12} className="text-emerald-500" />}
                      </p>
                      <StarRating rating={review.overallRating} size="text-[10px]" />
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2">{review.positiveText || review.negativeText}</p>
                  <Link to={`/products/${review.productId}`} className="text-xs text-primary link-draw block">
                    on {product?.name}
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ── 404 ── */
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <h1 className="text-7xl font-bold text-muted-foreground/20">404</h1>
      <p className="text-muted-foreground text-lg">This page doesn't exist</p>
      <Button variant="outline" asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}

/* ── App root ── */
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
        <Route path="/admin/trends" element={<AdminTrendsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
