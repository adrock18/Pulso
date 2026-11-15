import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register — create a new account
router.post('/register', register);

// POST /api/auth/login — authenticate and get a JWT
router.post('/login', login);

// GET /api/auth/me — get the current user's profile (requires auth)
router.get('/me', requireAuth, getMe);

export default router;
