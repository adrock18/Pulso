import { z } from 'zod';

/**
 * Validates query params for GET /api/products
 * All fields are optional strings used for filtering/searching.
 *
 * Advanced filters:
 *  - batteryType : exact match on the battery_type spec value (e.g. "Li-Ion")
 *  - runtimeMin  : minimum battery runtime in minutes (numeric, post-query filter)
 *  - washable    : "true" to require washable products (spec key "washable", AVAILABLE)
 *  - series      : substring match on ProductFamily name (e.g. "3000")
 */
export const listProductsSchema = z.object({
  q: z.string().optional(),
  gender: z.string().optional(),
  category: z.string().optional(),
  batteryType: z.string().optional(),
  runtimeMin: z.coerce.number().int().min(1).optional(),
  washable: z.enum(['true', 'false']).optional(),
  series: z.string().optional(),
});

/**
 * Validates route params for GET /api/products/:id
 * The id is a required string (cuid).
 */
export const getProductByIdSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
});
