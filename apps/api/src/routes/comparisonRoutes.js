import { Router } from 'express';
import { compareProducts } from '../controllers/comparisonController.js';

const router = Router();

// GET /api/comparison?a=:idA&b=:idB — dynamic product comparison
router.get('/', compareProducts);

export default router;
