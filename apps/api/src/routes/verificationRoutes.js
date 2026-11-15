import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { verifySerial, getUserProducts } from '../controllers/reviewController.js';

const router = Router();

// POST /api/verification — verify a serial number (requires auth)
router.post('/', requireAuth, verifySerial);

// GET /api/user-products — fetch user's verified products (requires auth)
// Note: mounted at /api/user-products in server.js for a clean URL
// This route exists here as an alternative mounting point
router.get('/user-products', requireAuth, getUserProducts);

export default router;
