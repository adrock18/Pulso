import {
  createReviewSchema,
  updateReviewSchema,
  verificationSchema,
} from '../validators/reviewValidators.js';
import * as reviewService from '../services/reviewService.js';

/**
 * POST /api/reviews
 * Submit a new review for a product. Requires authentication.
 * Optionally includes a serial number for verified-purchase status.
 */
export async function createReview(req, res) {
  const parsed = createReviewSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const review = await reviewService.createReview(req.user.id, parsed.data);
    res.status(201).json(review);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/products/:productId/reviews
 * Fetch all published reviews for a product. Public endpoint.
 */
export async function getProductReviews(req, res) {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const reviews = await reviewService.getProductReviews(productId);
    res.json(reviews);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('Error fetching product reviews:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/reviews/recent
 * Fetch the most recent published reviews across all products. Public endpoint.
 */
export async function getRecentReviews(req, res) {
  try {
    const reviews = await reviewService.getRecentReviews();
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching recent reviews:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /api/reviews/:id
 * Update an existing review. Requires authentication; only the review owner can edit.
 */
export async function updateReview(req, res) {
  const parsed = updateReviewSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const review = await reviewService.updateReview(
      req.params.id,
      req.user.id,
      parsed.data
    );
    res.json(review);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('Error updating review:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/verification
 * Verify a serial number for a product. Requires authentication.
 * Claims the serial and creates a UserProduct link.
 */
export async function verifySerial(req, res) {
  const parsed = verificationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const result = await reviewService.verifySerial(
      req.user.id,
      parsed.data.serialNumber
    );
    res.json(result);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error('Error verifying serial:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/user-products
 * Fetch the authenticated user's verified products.
 */
export async function getUserProducts(req, res) {
  try {
    const products = await reviewService.getUserProducts(req.user.id);
    res.json(products);
  } catch (err) {
    console.error('Error fetching user products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
