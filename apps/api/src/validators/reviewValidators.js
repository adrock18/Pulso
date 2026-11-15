import { z } from 'zod';

const VALID_RETAILERS = [
  'Flipkart',
  'Amazon India',
  'Myntra',
  'Croma',
  'Reliance Digital',
  'Official Brand Store',
  'Other',
];

const ratingField = z.number().int().min(1).max(5);

/**
 * Validates the request body for POST /api/reviews.
 * Requires a productId and overallRating (1-5). All other fields are optional.
 */
export const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  overallRating: ratingField,
  batteryRating: ratingField.optional(),
  buildRating: ratingField.optional(),
  easeOfUseRating: ratingField.optional(),
  performanceRating: ratingField.optional(),
  valueRating: ratingField.optional(),
  positiveText: z.string().optional(),
  negativeText: z.string().optional(),
  purchaseDate: z.string().datetime({ offset: true }).optional()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid ISO date').optional()),
  retailer: z.enum(VALID_RETAILERS).optional(),
  isAnonymous: z.boolean().optional().default(true),
  serialNumber: z.string().optional(),
});

/**
 * Validates the request body for PUT /api/reviews/:id.
 * All fields are optional — only provided fields are updated.
 * productId cannot be changed after creation.
 */
export const updateReviewSchema = z.object({
  overallRating: ratingField.optional(),
  batteryRating: ratingField.optional().nullable(),
  buildRating: ratingField.optional().nullable(),
  easeOfUseRating: ratingField.optional().nullable(),
  performanceRating: ratingField.optional().nullable(),
  valueRating: ratingField.optional().nullable(),
  positiveText: z.string().optional().nullable(),
  negativeText: z.string().optional().nullable(),
  purchaseDate: z.string().datetime({ offset: true }).optional().nullable()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid ISO date').optional().nullable()),
  retailer: z.enum(VALID_RETAILERS).optional().nullable(),
  isAnonymous: z.boolean().optional(),
});

/**
 * Validates the request body for POST /api/verification.
 * Requires a serial number string.
 */
export const verificationSchema = z.object({
  serialNumber: z.string().min(1, 'Serial number is required'),
});
