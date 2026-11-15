import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import comparisonRoutes from './routes/comparisonRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { requireAuth } from './middleware/auth.js';
import { getUserProducts, getProductReviews } from './controllers/reviewController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting — higher limit in development for testing
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// GET /api/products/:id/reviews — public reviews (matches API design spec)
app.get('/api/products/:productId/reviews', getProductReviews);

// GET /api/user-products — user's verified products (requires auth)
app.get('/api/user-products', requireAuth, getUserProducts);

// Start server
app.listen(PORT, () => {
  console.log(`ProductPulse API running on http://localhost:${PORT}`);
});

export default app;
