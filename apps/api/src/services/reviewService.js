import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

/**
 * Create a new review for a product.
 *
 * 1. Enforces one-review-per-user-per-product
 * 2. If serialNumber provided, attempts bcrypt comparison against product serials
 * 3. Claims the serial and creates a UserProduct link if verified
 * 4. Creates the review and updates denormalized rating fields on Product
 *
 * @param {string} userId - The authenticated user's ID
 * @param {Object} data - Validated review data from createReviewSchema
 * @returns {Promise<Object>} The created review
 */
export async function createReview(userId, data) {
  const { serialNumber, productId, purchaseDate, ...reviewFields } = data;

  // 1. Check the product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // 2. Check one-review-per-user-per-product
  const existingReview = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existingReview) {
    throw new AppError('You have already reviewed this product', 409);
  }

  // 3. If serial provided, try to verify it
  let userProductId = null;
  let isVerified = false;

  if (serialNumber) {
    const verification = await matchAndClaimSerial(userId, serialNumber, productId);
    if (verification) {
      userProductId = verification.id;
      isVerified = true;
    }
    // If no match or already claimed, review is still created without verification
  }

  // 4. Create review and update denormalized ratings in a transaction
  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        ...reviewFields,
        productId,
        userId,
        userProductId,
        isVerified,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      },
    });

    await recalculateRatings(tx, productId);

    return created;
  });

  return review;
}

/**
 * Fetch all published reviews for a product, with privacy-safe display fields.
 *
 * @param {string} productId - The product ID
 * @returns {Promise<Array>} Public review data
 */
export async function getProductReviews(productId) {
  // Verify product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const reviews = await prisma.review.findMany({
    where: {
      productId,
      status: 'PUBLISHED',
    },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Map to public-safe shape
  return reviews.map((review) => ({
    id: review.id,
    overallRating: review.overallRating,
    batteryRating: review.batteryRating,
    buildRating: review.buildRating,
    easeOfUseRating: review.easeOfUseRating,
    performanceRating: review.performanceRating,
    valueRating: review.valueRating,
    positiveText: review.positiveText,
    negativeText: review.negativeText,
    purchaseDate: review.purchaseDate,
    retailer: review.retailer,
    isAnonymous: review.isAnonymous,
    isVerified: review.isVerified,
    displayName: review.isAnonymous ? 'Anonymous' : review.user.name,
    createdAt: review.createdAt,
  }));
}

/**
 * Update an existing review. Only the review owner can do this.
 *
 * @param {string} reviewId - The review ID
 * @param {string} userId - The authenticated user's ID (for ownership check)
 * @param {Object} data - Validated update data from updateReviewSchema
 * @returns {Promise<Object>} The updated review
 */
export async function updateReview(reviewId, userId, data) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.userId !== userId) {
    throw new AppError('You can only edit your own reviews', 403);
  }

  const { purchaseDate, ...updateFields } = data;

  const updateData = { ...updateFields };
  if (purchaseDate !== undefined) {
    updateData.purchaseDate = purchaseDate ? new Date(purchaseDate) : null;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.review.update({
      where: { id: reviewId },
      data: updateData,
    });

    await recalculateRatings(tx, review.productId);

    return result;
  });

  return updated;
}

/**
 * Verify a serial number against all unclaimed serials.
 * Used by POST /api/verification (standalone verification, separate from review).
 *
 * @param {string} userId - The authenticated user's ID
 * @param {string} serialNumber - The plaintext serial number to verify
 * @returns {Promise<Object>} Verification result with product info
 */
export async function verifySerial(userId, serialNumber) {
  // Fetch all unclaimed serials
  const unclaimedSerials = await prisma.productSerial.findMany({
    where: { claimed: false },
    include: {
      product: {
        select: { id: true, name: true, model: true },
      },
    },
  });

  // Compare against each hashed serial using bcrypt
  let matchedSerial = null;
  for (const serial of unclaimedSerials) {
    const isMatch = await bcrypt.compare(serialNumber, serial.hashedSerial);
    if (isMatch) {
      matchedSerial = serial;
      break;
    }
  }

  if (!matchedSerial) {
    throw new AppError(
      'Serial number not found or already claimed',
      400
    );
  }

  // Check if user already has a UserProduct for this product
  const existingUserProduct = await prisma.userProduct.findFirst({
    where: { userId, productId: matchedSerial.productId },
  });
  if (existingUserProduct) {
    throw new AppError('You already have a verified product for this model', 409);
  }

  // Claim the serial and create UserProduct link in a transaction
  const userProduct = await prisma.$transaction(async (tx) => {
    await tx.productSerial.update({
      where: { id: matchedSerial.id },
      data: { claimed: true },
    });

    return tx.userProduct.create({
      data: {
        userId,
        serialId: matchedSerial.id,
        productId: matchedSerial.productId,
      },
      include: {
        serial: {
          include: {
            product: {
              select: { id: true, name: true, model: true },
            },
          },
        },
      },
    });
  });

  return {
    message: 'Serial verified successfully',
    userProduct: {
      id: userProduct.id,
      product: userProduct.serial.product,
      verifiedAt: userProduct.verifiedAt,
    },
  };
}

/**
 * Get all verified products for a user.
 *
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<Array>} User's verified products
 */
export async function getUserProducts(userId) {
  const userProducts = await prisma.userProduct.findMany({
    where: { userId },
    include: {
      serial: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              model: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { verifiedAt: 'desc' },
  });

  return userProducts.map((up) => ({
    id: up.id,
    product: up.serial.product,
    verifiedAt: up.verifiedAt,
  }));
}

/**
 * Fetch the most recent published reviews across all products.
 * Used by the Community page to show a cross-product review feed.
 *
 * @param {number} limit - Maximum number of reviews to return (default 20)
 * @returns {Promise<Array>} Public review data with embedded product info
 */
export async function getRecentReviews(limit = 20) {
  const reviews = await prisma.review.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { name: true } },
      product: {
        select: {
          id: true,
          name: true,
          model: true,
          image: true,
          avgRating: true,
          reviewCount: true,
        },
      },
    },
  });

  return reviews.map((r) => ({
    id: r.id,
    displayName: r.isAnonymous ? 'Anonymous' : r.user.name,
    isAnonymous: r.isAnonymous,
    isVerified: r.isVerified,
    overallRating: r.overallRating,
    positiveText: r.positiveText,
    negativeText: r.negativeText,
    retailer: r.retailer,
    createdAt: r.createdAt,
    product: r.product,
  }));
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Attempt to match a serial number against unclaimed serials for a specific product,
 * then claim it and create a UserProduct link.
 *
 * @param {string} userId
 * @param {string} serialNumber - Plaintext serial
 * @param {string} productId
 * @returns {Promise<Object|null>} The UserProduct record if verified, or null
 */
async function matchAndClaimSerial(userId, serialNumber, productId) {
  // Fetch all unclaimed serials for this specific product
  const serials = await prisma.productSerial.findMany({
    where: { productId, claimed: false },
  });

  let matchedSerial = null;
  for (const serial of serials) {
    const isMatch = await bcrypt.compare(serialNumber, serial.hashedSerial);
    if (isMatch) {
      matchedSerial = serial;
      break;
    }
  }

  if (!matchedSerial) {
    return null;
  }

  // Check if user already has a UserProduct for this product
  const existingUserProduct = await prisma.userProduct.findFirst({
    where: { userId, productId },
  });
  if (existingUserProduct) {
    return existingUserProduct;
  }

  // Claim the serial and create UserProduct in a transaction
  const userProduct = await prisma.$transaction(async (tx) => {
    await tx.productSerial.update({
      where: { id: matchedSerial.id },
      data: { claimed: true },
    });

    return tx.userProduct.create({
      data: {
        userId,
        serialId: matchedSerial.id,
        productId,
      },
    });
  });

  return userProduct;
}

/**
 * Recalculate and update the denormalized avgRating, reviewCount,
 * and verifiedReviewCount on a Product.
 *
 * @param {import('@prisma/client').Prisma.TransactionClient} tx - Transaction client
 * @param {string} productId
 */
async function recalculateRatings(tx, productId) {
  const aggregate = await tx.review.aggregate({
    where: { productId, status: 'PUBLISHED' },
    _avg: { overallRating: true },
    _count: { id: true },
  });

  const verifiedCount = await tx.review.count({
    where: { productId, status: 'PUBLISHED', isVerified: true },
  });

  await tx.product.update({
    where: { id: productId },
    data: {
      avgRating: aggregate._avg.overallRating || 0,
      reviewCount: aggregate._count.id,
      verifiedReviewCount: verifiedCount,
    },
  });
}

/**
 * Simple application error with an HTTP status code.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { AppError };
