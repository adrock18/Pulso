import prisma from '../config/db.js';

/**
 * Get product analytics for a single product (public).
 *
 * Returns:
 * - Rating distribution: count of reviews per star (1-5)
 * - Aspect averages: average rating for each aspect, null if no reviews have that aspect
 * - Total / verified / unverified review counts
 *
 * @param {string} productId
 * @returns {Promise<Object>} Structured analytics data
 */
export async function getProductAnalytics(productId) {
  // Verify product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Fetch all published reviews for this product
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      status: 'PUBLISHED',
    },
    select: {
      overallRating: true,
      batteryRating: true,
      buildRating: true,
      easeOfUseRating: true,
      performanceRating: true,
      valueRating: true,
      isVerified: true,
    },
  });

  // Rating distribution: count per star 1-5
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const review of reviews) {
    if (review.overallRating >= 1 && review.overallRating <= 5) {
      distribution[review.overallRating]++;
    }
  }

  // Aspect averages: compute only from reviews that have a non-null value
  const aspectAverages = computeAspectAverages(reviews);

  // Counts
  const totalReviews = reviews.length;
  const verifiedCount = reviews.filter((r) => r.isVerified).length;
  const unverifiedCount = totalReviews - verifiedCount;

  return {
    distribution,
    aspectAverages,
    totalReviews,
    verifiedCount,
    unverifiedCount,
  };
}

/**
 * Get product trends for admin dashboard.
 *
 * For each product, computes:
 * - Total and recent (last 30 days) review counts
 * - Overall and recent average ratings
 * - Trend indicator: "up", "down", or "stable"
 *
 * Results are sorted by recent review count descending.
 *
 * @returns {Promise<Array>} Array of trend objects
 */
export async function getProductTrends() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const products = await prisma.product.findMany({
    include: {
      reviews: {
        where: { status: 'PUBLISHED' },
        select: {
          overallRating: true,
          createdAt: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const trends = products.map((product) => {
    const allReviews = product.reviews;
    const recentReviews = allReviews.filter((r) => r.createdAt >= thirtyDaysAgo);

    const totalReviews = allReviews.length;
    const recentReviewCount = recentReviews.length;

    const avgRating = totalReviews > 0
      ? Math.round((allReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews) * 100) / 100
      : 0;

    const recentAvgRating = recentReviewCount > 0
      ? Math.round((recentReviews.reduce((sum, r) => sum + r.overallRating, 0) / recentReviewCount) * 100) / 100
      : null;

    let trend = 'stable';
    if (recentAvgRating !== null && avgRating > 0) {
      if (recentAvgRating > avgRating) {
        trend = 'up';
      } else if (recentAvgRating < avgRating) {
        trend = 'down';
      }
    }

    return {
      id: product.id,
      name: product.name,
      model: product.model,
      totalReviews,
      recentReviews: recentReviewCount,
      avgRating,
      recentAvgRating,
      trend,
    };
  });

  // Sort by recent review count descending
  trends.sort((a, b) => b.recentReviews - a.recentReviews);

  return trends;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Compute the average for each aspect rating, only from reviews
 * where that aspect is not null. Returns null if no reviews have
 * a value for that aspect.
 */
function computeAspectAverages(reviews) {
  const aspects = [
    { field: 'batteryRating', key: 'battery' },
    { field: 'buildRating', key: 'build' },
    { field: 'easeOfUseRating', key: 'easeOfUse' },
    { field: 'performanceRating', key: 'performance' },
    { field: 'valueRating', key: 'value' },
  ];

  const result = {};

  for (const { field, key } of aspects) {
    const withValue = reviews.filter((r) => r[field] != null);
    if (withValue.length === 0) {
      result[key] = null;
    } else {
      const sum = withValue.reduce((acc, r) => acc + r[field], 0);
      result[key] = Math.round((sum / withValue.length) * 100) / 100;
    }
  }

  return result;
}

/**
 * Simple application error with an HTTP status code.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
