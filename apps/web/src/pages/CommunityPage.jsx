import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BadgeCheck, MessageSquare, TrendingUp,
  ArrowRight, Package, Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/star-rating';
import { api } from '@/services/api';

const FILTERS = [
  { id: 'all', label: 'All Reviews', icon: MessageSquare },
  { id: 'verified', label: 'Verified Only', icon: BadgeCheck },
  { id: 'helpful', label: 'Most Helpful', icon: TrendingUp },
];

function ReviewThread({ review }) {
  const product = review.product;
  return (
    <Card className="transition-all hover:shadow-sm hover:-translate-y-0.5">
      <CardContent className="pt-4 pb-3 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {product?.image && (
              <Link to={`/products/${product.id}`} className="shrink-0 w-8 h-8 rounded bg-muted overflow-hidden">
                <img src={product.image} alt="" className="w-full h-full object-contain p-0.5" />
              </Link>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              {review.isAnonymous ? '?' : review.displayName?.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-sm">
                  {review.displayName}
                </span>
                {review.isVerified && (
                  <Badge className="text-[10px] py-0 h-4 bg-emerald-600 hover:bg-emerald-700 gap-0.5">
                    <BadgeCheck size={8} />
                    Verified
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">on</span>
                <Link to={`/products/${product?.id}`} className="text-xs font-medium text-primary hover:underline truncate">
                  {product?.name}
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.overallRating} size="text-[11px]" />
                <span className="text-[11px] text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {review.retailer && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">{review.retailer}</span>
          )}
        </div>

        {review.positiveText && (
          <div className="flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0 text-xs font-bold">+</span>
            <p className="text-sm leading-relaxed">{review.positiveText}</p>
          </div>
        )}
        {review.negativeText && (
          <div className="flex gap-2">
            <span className="text-red-400 mt-0.5 shrink-0 text-xs font-bold">−</span>
            <p className="text-sm leading-relaxed">{review.negativeText}</p>
          </div>
        )}

        <div className="flex items-center justify-end pt-0.5">
          <Link to={`/products/${product?.id}`} className="text-xs text-primary hover:underline flex items-center gap-1">
            View product <ArrowRight size={10} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendingProduct({ product, rank }) {
  return (
    <Link to={`/products/${product.id}`} className="flex items-center gap-2.5 py-1.5 group">
      <span className="text-sm font-bold text-muted-foreground/40 w-5 text-right tabular-nums">{rank}</span>
      {product.image ? (
        <div className="w-7 h-7 rounded bg-muted overflow-hidden shrink-0">
          <img src={product.image} alt="" className="w-full h-full object-contain p-0.5" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded bg-muted flex items-center justify-center shrink-0">
          <Package size={12} className="text-muted-foreground/30" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium group-hover:text-primary transition-colors truncate">{product.name}</p>
        <p className="text-[10px] text-muted-foreground">{product.reviewCount} reviews · ★ {product.avgRating?.toFixed(1) ?? '—'}</p>
      </div>
    </Link>
  );
}

export default function CommunityPage() {
  const [filter, setFilter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [reviewsData, productsData] = await Promise.all([
          api.get('/reviews/recent'),
          api.get('/products'),
        ]);
        setReviews(reviewsData);
        setProducts(Array.isArray(productsData) ? productsData : productsData.data ?? []);
      } catch (err) {
        console.error('Failed to load community data:', err);
        setError(err.message || 'Failed to load community data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const trending = [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5);
  const totalReviews = products.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
  const totalVerified = products.reduce((sum, p) => sum + (p.verifiedReviewCount || 0), 0);

  let displayedReviews = reviews;
  if (filter === 'verified') {
    displayedReviews = reviews.filter(r => r.isVerified);
  } else if (filter === 'helpful') {
    displayedReviews = [...reviews].sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground">Community</span>
        </nav>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground">Community</span>
        </nav>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground">Community</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community</h1>
            <p className="text-sm text-muted-foreground">
              {totalReviews} reviews, {totalVerified} verified purchases
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" disabled className="gap-1.5">
          <MessageSquare size={14} />
          Write a review
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            {FILTERS.map(f => (
              <Badge
                key={f.id}
                variant={filter === f.id ? 'secondary' : 'outline'}
                className="cursor-pointer hover:bg-muted gap-1.5"
                onClick={() => setFilter(f.id)}
              >
                <f.icon size={12} />
                {f.label}
                {f.id === 'verified' && (
                  <span className="ml-0.5 text-[10px] opacity-60">{reviews.filter(r => r.isVerified).length}</span>
                )}
              </Badge>
            ))}
          </div>
          {displayedReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Filter size={24} className="mx-auto mb-2 text-muted-foreground/30" />
                No reviews match this filter.
              </CardContent>
            </Card>
          ) : (
            displayedReviews.map(review => <ReviewThread key={review.id} review={review} />)
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare size={12} />
                  Reviews
                </span>
                <span className="font-semibold tabular-nums">{totalReviews}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <BadgeCheck size={12} />
                  Verified
                </span>
                <span className="font-semibold text-emerald-600 tabular-nums">{totalVerified}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Package size={12} />
                  Products
                </span>
                <span className="font-semibold tabular-nums">{products.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp size={12} />
                Most Reviewed
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="divide-y">
                {trending.map((p, i) => <TrendingProduct key={p.id} product={p} rank={i + 1} />)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 pb-4 text-center space-y-2">
              <BadgeCheck size={20} className="mx-auto text-primary" />
              <p className="text-sm font-medium">Own a Philips product?</p>
              <p className="text-xs text-muted-foreground">Verify your purchase and write a trusted review.</p>
              <Button size="sm" asChild className="w-full">
                <Link to="/register">Get started</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
