import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableRow,
} from '@/components/ui/table';
import { StarRating, RatingBadge } from '@/components/star-rating';
import {
  PRODUCTS, CATEGORIES, GENDERS, DEMO_REVIEWS, groupSpecsByCategory, formatSpecKey, displaySpecValue,
} from '@/data/products';

const ASPECT_LABELS = {
  batteryRating: 'Battery',
  buildRating: 'Build Quality',
  easeOfUseRating: 'Ease of Use',
  performanceRating: 'Performance',
  valueRating: 'Value for Money',
};

function AspectBar({ label, value, max = 5 }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 text-muted-foreground text-xs">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-xs font-medium text-right">{value}</span>
    </div>
  );
}

function ReviewCard({ review }) {
  const aspects = Object.entries(ASPECT_LABELS)
    .map(([key, label]) => ({ label, value: review[key] }))
    .filter(a => a.value != null);

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {review.isAnonymous ? '?' : review.displayName?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {review.isAnonymous ? 'Anonymous' : review.displayName}
                </span>
                {review.isVerified && (
                  <Badge className="text-[10px] py-0 h-5 bg-emerald-600 hover:bg-emerald-700">
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.overallRating} size="text-xs" />
                <span className="text-xs text-muted-foreground">{review.createdAt}</span>
              </div>
            </div>
          </div>
          {review.retailer && (
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {review.retailer}
            </span>
          )}
        </div>

        {/* Aspect ratings */}
        {aspects.length > 0 && (
          <div className="space-y-1.5 bg-muted/50 rounded-lg p-3">
            {aspects.map(a => (
              <AspectBar key={a.label} label={a.label} value={a.value} />
            ))}
          </div>
        )}

        {/* Text */}
        <div className="space-y-2">
          {review.positiveText && (
            <div className="flex gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
              <p className="text-sm">{review.positiveText}</p>
            </div>
          )}
          {review.negativeText && (
            <div className="flex gap-2">
              <span className="text-red-400 mt-0.5 shrink-0">−</span>
              <p className="text-sm">{review.negativeText}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <h1 className="text-4xl font-bold text-muted-foreground/50">Product Not Found</h1>
        <Button variant="outline" asChild>
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  const specGroups = groupSpecsByCategory(product.specs);
  const reviews = DEMO_REVIEWS.filter(r => r.productId === product.id);

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="text-muted-foreground/40">/</span>
        {product.gender && (
          <>
            <Link to={`/products?gender=${product.gender}`} className="hover:text-foreground transition-colors">
              {GENDERS.find(g => g.id === product.gender)?.label}
            </Link>
            <span className="text-muted-foreground/40">/</span>
          </>
        )}
        <Link to={`/products?${product.gender ? `gender=${product.gender}&` : ''}category=${product.category}`} className="hover:text-foreground transition-colors">
          {CATEGORIES.find(c => c.id === product.category)?.label}
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground">{product.model}</span>
      </nav>

      {/* Product header */}
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
        <div className="aspect-square bg-gradient-to-br from-muted/60 to-muted/30 rounded-xl flex items-center justify-center relative overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6" />
          ) : (
            <span className="text-8xl opacity-15">📦</span>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <Badge variant="outline" className="mb-3 text-xs">{product.family}</Badge>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-lg">{product.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <RatingBadge rating={product.avgRating} reviewCount={product.reviewCount} />
            <span className="text-sm text-muted-foreground">
              {product.verifiedReviewCount} verified purchase{product.verifiedReviewCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex gap-3 pt-2">
            <Button asChild>
              <Link to={`/compare?a=${product.id}`}>Compare this product</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="#reviews">Read reviews</Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Specifications */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold tracking-tight">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(specGroups).map(([category, specs]) => (
            <Card key={category}>
              <CardHeader className="pb-0 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-4 pb-2">
                <Table>
                  <TableBody>
                    {specs.map((spec, idx) => (
                      <TableRow key={spec.key} className={`border-0 ${idx % 2 === 0 ? 'bg-muted/30' : ''}`}>
                        <TableCell className="py-2 pl-2 text-sm rounded-l">{formatSpecKey(spec.key)}</TableCell>
                        <TableCell className="py-2 pr-0 text-right">
                          <span className={
                            spec.applicability === 'UNKNOWN'
                              ? 'text-muted-foreground italic text-sm'
                              : spec.applicability === 'NOT_APPLICABLE'
                              ? 'text-muted-foreground text-sm'
                              : 'font-medium text-sm'
                          }>
                            {displaySpecValue(spec)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-[10px] text-muted-foreground/60 mt-1 mb-2">
                  Source: {specs[0]?.source} · Verified: {specs[0]?.verifiedAt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator id="reviews" />

      {/* Reviews */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Reviews</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} from customers
            </p>
          </div>
          <Button variant="outline" disabled title="Sign in to review">
            Write a review
          </Button>
        </div>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* Similar Products */}
      {(() => {
        const similar = PRODUCTS
          .filter(p => p.category === product.category && p.id !== product.id)
          .sort((a, b) => b.avgRating - a.avgRating)
          .slice(0, 3);
        if (similar.length === 0) return null;
        return (
          <>
            <Separator />
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similar.map(p => (
                  <Link key={p.id} to={`/products/${p.id}`} className="group">
                    <Card className="transition-all group-hover:shadow-sm group-hover:border-primary/20">
                      <CardContent className="pt-4 pb-3 space-y-2">
                        <div className="w-full aspect-[3/2] bg-muted/50 rounded-md flex items-center justify-center overflow-hidden">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" />
                          ) : (
                            <span className="text-3xl opacity-20">📦</span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium group-hover:text-primary transition-colors truncate">{p.name}</h3>
                        <div className="flex items-center justify-between">
                          <RatingBadge rating={p.avgRating} reviewCount={p.reviewCount} />
                          {p.priceRange && <span className="text-xs text-muted-foreground">{p.priceRange}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </>
        );
      })()}
    </div>
  );
}
