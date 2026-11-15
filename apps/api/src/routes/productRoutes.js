import { Router } from 'express';
import { listProducts, getProduct } from '../controllers/productController.js';

const router = Router();

// GET /api/products — list with search/filter
router.get('/', listProducts);

// GET /api/products/:id — product detail with grouped specs
router.get('/:id', getProduct);

export default router;
