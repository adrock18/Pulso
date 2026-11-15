import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  getProductAnalytics,
  getProductTrends,
} from '../controllers/analyticsController.js';

const router = Router();

// GET /api/analytics/products/:productId — public product analytics
router.get('/products/:productId', getProductAnalytics);

// GET /api/analytics/trends — admin-only product trends
router.get('/trends', requireAuth, requireAdmin, getProductTrends);

export default router;
