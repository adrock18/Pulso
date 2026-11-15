import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package, GitCompareArrows, MessageSquare, BadgeCheck, Star, Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableRow,
} from '@/components/ui/table';
import { StarRating, RatingBadge } from '@/components/star-rating';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES, GENDERS, formatSpecKey } from '@/data/products';
import ProductAnalytics from '@/components/ProductAnalytics';

const ASPECT_LABELS = {
  batteryRating: 'Battery',
  buildRating: 'Build Quality',
  easeOfUseRating: 'Ease of Use',
  performanceRating: 'Performance',
  valueRating: 'Value for Money',
};

const RETAILERS = [
  'Flipkart',
  'Amazon India',
  'Myntra',
  'Croma',
  'Reliance Digital',
  'Official Brand Store',
  'Other',
];

function displaySpecValue(spec) {
  if (spec.applicability === 'UNKNOWN') return 'Unknown';
  if (spec.applicability === 'NOT_APPLICABLE') return 'N/A';
  return spec.value + (spec.unit ? ` ${spec.unit}` : '');
}

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ── Clickable star selector ── */
function StarSelector({ value, onChange, label }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-muted-foreground w-28 shrink-0">{label}</span>}
      <div className="flex gap-0.5" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`text-lg transition-colors ${
              star <= (hovered || value)
                ? 'text-amber-400'
                : 'text-gray-300 dark:text-gray-600'
            } hover:scale-110`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star === value ? 0 : star)}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-xs text-muted-foreground">{value}/5</span>
      )}
    </div>
  );
}

/* ── Aspect rating bar ── */
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

/* ── Single review card ── */
function ReviewCard({ review }) {
  const aspects = Object.entries(ASPECT_LABELS)
    .map(([key, label]) => ({ label, value: review[key] }))
    .filter(a => a.value != null);

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-semibold text-primary">
              {review.displayName === 'Anonymous' ? '?' : review.displayName?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {review.displayName}
                </span>
                {review.isVerified && (
                  <Badge className="text-[10px] py-0 h-5 bg-emerald-600 hover:bg-emerald-700 gap-1">
                    <BadgeCheck size={10} />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.overallRating} size="text-xs" />
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
          {review.retailer && (
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {review.retailer}
            </span>
          )}
        </div>

        {aspects.length > 0 && (
          <div className="space-y-1.5 bg-muted/50 rounded-lg p-3">
            {aspects.map(a => (
              <AspectBar key={a.label} label={a.label} value={a.value} />
            ))}
          </div>
        )}

        <div className="space-y-2">
          {review.positiveText && (
            <div className="flex gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0 text-sm font-bold">+</span>
              <p className="text-sm">{review.positiveText}</p>
            </div>
          )}
          {review.negativeText && (
            <div className="flex gap-2">
              <span className="text-red-400 mt-0.5 shrink-0 text-sm font-bold">−</span>
              <p className="text-sm">{review.negativeText}</p>
            </div>
          )}
        </div>

        {review.purchaseDate && (
          <p className="text-xs text-muted-foreground">
            Purchased: {formatDate(review.purchaseDate)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Review submission form ── */
function ReviewForm({ productId, onSubmitted }) {
  const [overallRating, setOverallRating] = useState(0);
  const [batteryRating, setBatteryRating] = useState(0);
  const [buildRating, setBuildRating] = useState(0);
  const [easeOfUseRating, setEaseOfUseRating] = useState(0);
  const [performanceRating, setPerformanceRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [positiveText, setPositiveText] = useState('');
  const [negativeText, setNegativeText] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [retailer, setRetailer] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [serialNumber, setSerialNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (overallRating === 0) {
      setFormError('Please select an overall rating.');
      return;
    }

    const body = {
      productId,
      overallRating,
      isAnonymous,
    };

    if (batteryRating > 0) body.batteryRating = batteryRating;
    if (buildRating > 0) body.buildRating = buildRating;
    if (easeOfUseRating > 0) body.easeOfUseRating = easeOfUseRating;
    if (performanceRating > 0) body.performanceRating = performanceRating;
    if (valueRating > 0) body.valueRating = valueRating;
    if (positiveText.trim()) body.positiveText = positiveText.trim();
    if (negativeText.trim()) body.negativeText = negativeText.trim();
    if (purchaseDate) body.purchaseDate = purchaseDate;
    if (retailer) body.retailer = retailer;
    if (serialNumber.trim()) body.serialNumber = serialNumber.trim();

    setSubmitting(true);
    try {
      await api.post('/reviews', body);
      setFormSuccess(true);
      onSubmitted();
    } catch (err) {
      if (err.status === 409) {
        setFormError('You have already reviewed this product.');
      } else {
        setFormError(err.message || 'Failed to submit review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (formSuccess) {
    return (
      <Card>
        <CardContent className="py-8 text-center space-y-2">
          <BadgeCheck size={24} className="text-emerald-500 mx-auto" />
          <p className="text-emerald-600 dark:text-emerald-400 font-medium">
            Thank you! Your review has been submitted.
          </p>
          <p className="text-sm text-muted-foreground">
            Your feedback helps other customers make informed decisions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare size={16} className="text-primary" />
          Write a Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <StarSelector value={overallRating} onChange={setOverallRating} label="Overall *" />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Rate specific aspects (optional)</p>
            <div className="space-y-1.5 bg-muted/30 rounded-lg p-3">
              <StarSelector value={batteryRating} onChange={setBatteryRating} label="Battery" />
              <StarSelector value={buildRating} onChange={setBuildRating} label="Build Quality" />
              <StarSelector value={easeOfUseRating} onChange={setEaseOfUseRating} label="Ease of Use" />
              <StarSelector value={performanceRating} onChange={setPerformanceRating} label="Performance" />
              <StarSelector value={valueRating} onChange={setValueRating} label="Value for Money" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="positiveText" className="text-sm font-medium">What did you like?</label>
            <textarea
              id="positiveText"
              value={positiveText}
              onChange={e => setPositiveText(e.target.value)}
              placeholder="Share what you enjoyed about this product..."
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="negativeText" className="text-sm font-medium">What could be improved?</label>
            <textarea
              id="negativeText"
              value={negativeText}
              onChange={e => setNegativeText(e.target.value)}
              placeholder="Share any issues or things you'd improve..."
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="purchaseDate" className="text-sm font-medium">Purchase date</label>
              <input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="retailer" className="text-sm font-medium">Purchased from</label>
              <select
                id="retailer"
                value={retailer}
                onChange={e => setRetailer(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">Select retailer...</option>
                {RETAILERS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="serialNumber" className="text-sm font-medium">Serial number</label>
            <input
              id="serialNumber"
              type="text"
              value={serialNumber}
              onChange={e => setSerialNumber(e.target.value)}
              placeholder="e.g. PHBT-7505-XXXX"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <BadgeCheck size={12} className="text-emerald-500" />
              Enter your product serial number for Verified Purchase badge
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm">Post anonymously</span>
            <span className="text-xs text-muted-foreground">
              {isAnonymous ? '(your name will be hidden)' : '(your name will be shown)'}
            </span>
          </label>

          {formError && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <Button type="submit" disabled={submitting || overallRating === 0}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── Main page ── */
export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/products/${id}`)
      .then(data => { setProduct(data); setError(null); })
      .catch(err => {
        if (err.status === 404) setProduct(null);
        else setError(err.message || 'Failed to load product');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    api.get(`/products?category=${product.family.category}`)
      .then(data => setSimilarProducts(data.filter(p => p.id !== product.id).slice(0, 3)))
      .catch(() => setSimilarProducts([]));
  }, [product]);

  const fetchReviews = useCallback(() => {
    setReviewsLoading(true);
    api.get(`/products/${id}/reviews`)
      .then(data => {
        const reviewList = Array.isArray(data) ? data : (data.reviews || []);
        setReviews(reviewList);
        if (user) {
          const ownReview = reviewList.find(r => r.isOwner);
          setUserHasReviewed(!!ownReview);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [id, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewSubmitted = () => {
    fetchReviews();
    api.get(`/products/${id}`)
      .then(data => setProduct(data))
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="inline-block w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" asChild>
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <Package size={48} className="mx-auto text-muted-foreground/30" />
        <h1 className="text-2xl font-bold text-muted-foreground/50">Product Not Found</h1>
        <Button variant="outline" asChild>
          <Link to="/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  const category = product.family?.category;

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
        <Link to={`/products?${product.gender ? `gender=${product.gender}&` : ''}category=${category}`} className="hover:text-foreground transition-colors">
          {CATEGORIES.find(c => c.id === category)?.label}
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
            <Package size={80} className="text-muted-foreground/10" />
          )}
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge variant="outline" className="text-xs">{product.family?.name}</Badge>
              {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                product.highlights.map((highlight, idx) => (
                  <Badge
                    key={idx}
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/15 border-0"
                  >
                    {highlight}
                  </Badge>
                ))
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-lg">{product.description}</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <RatingBadge rating={product.avgRating} reviewCount={product.reviewCount} />
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <BadgeCheck size={14} className="text-emerald-500" />
              {product.verifiedReviewCount} verified purchase{product.verifiedReviewCount !== 1 ? 's' : ''}
            </span>
            {product.warranty && (
              <span className="text-xs font-medium text-primary flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <Shield size={12} />
                {product.warranty} warranty
              </span>
            )}
            {product.recommendationPct != null && product.reviewCount > 0 && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400/80">
                {product.recommendationPct}% recommend this product
              </span>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button asChild className="gap-2">
              <Link to={`/compare?a=${product.id}`}>
                <GitCompareArrows size={16} />
                Compare this product
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="#reviews">
                <MessageSquare size={16} />
                Read reviews
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Specifications */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold tracking-tight">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {product.specGroups && Object.entries(product.specGroups).map(([groupName, specGroup]) => (
            <Card key={groupName}>
              <CardHeader className="pb-0 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {groupName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-4 pb-2">
                <Table>
                  <TableBody>
                    {specGroup.map((spec, idx) => (
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
                  Source: {specGroup[0]?.source} · Verified: {formatDate(specGroup[0]?.verifiedAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* What's in the Box */}
      {Array.isArray(product.boxContents) && product.boxContents.length > 0 && (
        <>
          <Separator />
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Package size={20} className="text-primary" />
              What's in the Box
            </h2>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex flex-wrap gap-2">
                  {product.boxContents.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted text-foreground font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}

      <Separator />

      {/* Analytics */}
      <ProductAnalytics productId={id} />

      <Separator id="reviews" />

      {/* Reviews */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Reviews
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''} from customers
          </p>
        </div>

        {user ? (
          userHasReviewed ? (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  You have already reviewed this product.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ReviewForm productId={id} onSubmitted={handleReviewSubmitted} />
          )
        ) : (
          <Card>
            <CardContent className="py-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Want to share your experience?
              </p>
              <Button variant="outline" asChild>
                <Link to="/login">Sign in to write a review</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {reviewsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-4 border-muted border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare size={24} className="mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <>
          <Separator />
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarProducts.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="group">
                  <Card className="transition-all group-hover:shadow-sm group-hover:border-primary/20">
                    <CardContent className="pt-4 pb-3 space-y-2">
                      <div className="w-full aspect-[3/2] bg-muted/50 rounded-md flex items-center justify-center overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <Package size={28} className="text-muted-foreground/20" />
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
      )}
    </div>
  );
}
