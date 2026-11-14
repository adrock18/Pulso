/**
 * Star rating display — supports half-star precision visually.
 */
export function StarRating({ rating, max = 5, size = 'text-sm', showValue = false }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`} aria-label={`${rating} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const diff = rating - i;
        let fill = 'text-gray-300 dark:text-gray-600';
        if (diff >= 0.75) fill = 'text-amber-400';
        else if (diff >= 0.25) fill = 'text-amber-300';
        return (
          <span key={i} className={fill}>★</span>
        );
      })}
      {showValue && (
        <span className="ml-1 font-semibold text-foreground">{rating}</span>
      )}
    </span>
  );
}

/**
 * Compact rating pill — shows star + number in a small badge shape.
 */
export function RatingBadge({ rating, reviewCount }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md text-sm font-medium">
      <span className="text-amber-400">★</span>
      {rating}
      {reviewCount !== undefined && (
        <span className="text-amber-600/60 dark:text-amber-400/60 font-normal">({reviewCount})</span>
      )}
    </div>
  );
}
