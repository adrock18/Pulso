import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createReview,
  getProductReviews,
  getRecentReviews,
  updateReview,
} from '../controllers/reviewController.js';

const router = Router();

// POST /api/reviews — submit a new review (requires auth)
router.post('/', requireAuth, createReview);

// GET /api/reviews/recent — recent reviews across all products (public)
router.get('/recent', getRecentReviews);

// GET /api/reviews/products/:productId — public reviews for a product
router.get('/products/:productId', getProductReviews);

// PUT /api/reviews/:id — update own review (requires auth)
router.put('/:id', requireAuth, updateReview);

export default router;
