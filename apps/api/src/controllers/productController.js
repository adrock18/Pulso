import { listProductsSchema, getProductByIdSchema } from '../validators/productValidators.js';
import * as productService from '../services/productService.js';

/**
 * GET /api/products
 * Returns a filtered/searched list of product summaries.
 */
export async function listProducts(req, res) {
  const parsed = listProductsSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const products = await productService.listProducts(parsed.data);
    res.json(products);
  } catch (err) {
    console.error('Error listing products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/products/:id
 * Returns a single product with specs grouped by category, or 404.
 */
export async function getProduct(req, res) {
  const parsed = getProductByIdSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid product ID',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const product = await productService.getProductById(parsed.data.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
