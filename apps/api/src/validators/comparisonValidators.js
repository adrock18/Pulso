import { z } from 'zod';

/**
 * Validates query params for GET /api/comparison
 * Both product IDs are required strings.
 */
export const compareProductsSchema = z.object({
  a: z.string().min(1, 'Product ID A is required'),
  b: z.string().min(1, 'Product ID B is required'),
});
