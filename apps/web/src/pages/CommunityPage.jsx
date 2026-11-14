import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/star-rating';
import { getAllReviews, getProductById, PRODUCTS } from '@/data/products';

const FILTERS = [
  { id: 'all', label: 'All Reviews' },
  { id: 'verified', label: 'Verified Only' },
  { id: 'helpful', label: 'Most Helpful' },
];

function ReviewThread({ review }) {
  const product = getProductById(review.productId);
  return (
    <Card className="transition-all hover:shadow-sm">
      <CardContent className="pt-4 pb-3 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Product thumbnail */}
            {product?.image && (
              <Link to={`/products/${review.productId}`} className="shrink-0 w-8 h-8 rounded bg-muted overflow-hidden">
                <img src={product.image} alt="" className="w-full h-full object-contain p-0.5" />
              </Link>
            )}
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
              {review.isAnonymous ? '?' : review.displayName?.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-sm">
                  {review.isAnonymous ? 'Anonymous' : review.displayName}
                </span>
                {review.isVerified && (
                  <Badge className="text-[10px] py-0 h-4 bg-emerald-600 hover:bg-emerald-700">Verified</Badge>
                )}
                <span className="text-xs text-muted-foreground">on</span>
                <Link to={`/products/${review.productId}`} className="text-xs font-medium text-primary hover:underline truncate">
                  {product?.name}
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.overallRating} size="text-[11px]" />
                <span className="text-[11px] text-muted-foreground">{review.createdAt}</span>
              </div>
            </div>
          </div>
          {review.retailer && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">{review.retailer}</span>
          )}
        </div>

        {review.positiveText && (
          <div className="flex gap-2">
            <span className="text-emerald-500 mt-0.5 shrink-0 text-xs">+</span>
            <p className="text-sm leading-relaxed">{review.positiveText}</p>
          </div>
        )}
        {review.negativeText && (
          <div className="flex gap-2">
            <span className="text-red-400 mt-0.5 shrink-0 text-xs">−</span>
            <p className="text-sm leading-relaxed">{review.negativeText}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors flex items-center gap-1">
              👍 Helpful ({review.helpful || 0})
            </button>
            <button className="hover:text-foreground transition-colors flex items-center gap-1">
              💬 {review.replies || 0} repl{review.replies === 1 ? 'y' : 'ies'}
            </button>
          </div>
          <Link to={`/products/${review.productId}`} className="text-xs text-primary hover:underline">View product →</Link>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendingProduct({ product, rank }) {
  return (
    <Link to={`/products/${product.id}`} className="flex items-center gap-2.5 py-1.5 group">
      <span className="text-sm font-bold text-muted-foreground/40 w-5 text-right">{rank}</span>
      {product.image && (
        <div className="w-7 h-7 rounded bg-muted overflow-hidden shrink-0">
          <img src={product.image} alt="" className="w-full h-full object-contain p-0.5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium group-hover:text-primary transition-colors truncate">{product.name}</p>
        <p className="text-[10px] text-muted-foreground">{product.reviewCount} reviews · ★ {product.avgRating}</p>
      </div>
    </Link>
  );
}

export default function CommunityPage() {
  const [filter, setFilter] = useState('all');

  const allReviews = getAllReviews();
  const trending = [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
  const totalReviews = PRODUCTS.reduce((sum, p) => sum + p.reviewCount, 0);
  const totalVerified = PRODUCTS.reduce((sum, p) => sum + p.verifiedReviewCount, 0);

  let displayedReviews = allReviews;
  if (filter === 'verified') {
    displayedReviews = allReviews.filter(r => r.isVerified);
  } else if (filter === 'helpful') {
    displayedReviews = [...allReviews].sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
  }

  return (
    <div className="space-y-5">
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground">Community</span>
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalReviews} reviews, {totalVerified} verified purchases
          </p>
        </div>
        <Button variant="outline" size="sm" disabled>Write a review</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            {FILTERS.map(f => (
              <Badge key={f.id}
                variant={filter === f.id ? 'secondary' : 'outline'}
                className="cursor-pointer hover:bg-muted"
                onClick={() => setFilter(f.id)}>
                {f.label}
                {f.id === 'verified' && <span className="ml-1 text-[10px] opacity-60">{allReviews.filter(r => r.isVerified).length}</span>}
              </Badge>
            ))}
          </div>
          {displayedReviews.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No reviews match this filter.</CardContent></Card>
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
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-semibold">{totalReviews}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Verified</span>
                <span className="font-semibold text-emerald-600">{totalVerified}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Products</span>
                <span className="font-semibold">{PRODUCTS.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Most Reviewed</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="divide-y">
                {trending.map((p, i) => <TrendingProduct key={p.id} product={p} rank={i + 1} />)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 pb-4 text-center space-y-2">
              <p className="text-sm font-medium">Own a Philips product?</p>
              <p className="text-xs text-muted-foreground">Verify your purchase and write a trusted review.</p>
              <Button size="sm" asChild className="w-full"><Link to="/register">Get started</Link></Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
