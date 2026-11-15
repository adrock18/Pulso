import { compareProductsSchema } from '../validators/comparisonValidators.js';
import * as comparisonService from '../services/comparisonService.js';

/**
 * GET /api/comparison?a=:idA&b=:idB
 * Returns a structured comparison of two products by their specs.
 */
export async function compareProducts(req, res) {
  const parsed = compareProductsSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const comparison = await comparisonService.compareProducts(
      parsed.data.a,
      parsed.data.b
    );
    res.json(comparison);
  } catch (err) {
    // Handle known errors thrown by the service
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }

    console.error('Error comparing products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
