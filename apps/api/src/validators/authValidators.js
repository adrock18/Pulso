import { z } from 'zod';

/**
 * Validates the request body for POST /api/auth/register.
 * Requires a name, valid email, and password of at least 6 characters.
 */
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Validates the request body for POST /api/auth/login.
 * Requires a valid email and a non-empty password.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
