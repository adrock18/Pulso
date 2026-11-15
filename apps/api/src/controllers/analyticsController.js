import * as analyticsService from '../services/analyticsService.js';

/**
 * GET /api/analytics/products/:productId
 * Public endpoint — returns rating distribution, aspect averages,
 * and review counts for a single product.
 */
export async function getProductAnalytics(req, res) {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const analytics = await analyticsService.getProductAnalytics(productId);
    res.json(analytics);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('Error fetching product analytics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/analytics/trends
 * Admin-only endpoint — returns trend data for all products,
 * including recent vs. overall ratings and trend indicators.
 */
export async function getProductTrends(req, res) {
  try {
    const trends = await analyticsService.getProductTrends();
    res.json(trends);
  } catch (err) {
    console.error('Error fetching product trends:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
