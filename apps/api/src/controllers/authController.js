import { registerSchema, loginSchema } from '../validators/authValidators.js';
import { hashPassword, comparePassword, signToken } from '../utils/auth.js';
import prisma from '../config/db.js';

/**
 * POST /api/auth/register
 * Creates a new user account and returns a JWT + user profile.
 */
export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, email, password } = parsed.data;

  try {
    // Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true },
    });

    // Sign token with userId and role
    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/auth/login
 * Authenticates a user by email + password and returns a JWT + user profile.
 * Returns the same error message for wrong password and non-existent email
 * to prevent user enumeration.
 */
export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsed.data;

  try {
    // Look up user — identical error for missing user and wrong password
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/auth/me
 * Returns the profile of the currently authenticated user.
 * Requires requireAuth middleware to run first (sets req.user).
 */
export async function getMe(req, res) {
  res.json(req.user);
}
