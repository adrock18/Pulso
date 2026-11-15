import prisma from '../config/db.js';

/**
 * List products with optional search, basic filters, and advanced spec filters.
 *
 * @param {Object} filters
 * @param {string}  [filters.q]           - Search term (matches name, model, or brand)
 * @param {string}  [filters.gender]      - Exact match on product gender
 * @param {string}  [filters.category]    - Filter by ProductFamily category
 * @param {string}  [filters.batteryType] - Exact match on battery_type spec value
 * @param {number}  [filters.runtimeMin]  - Minimum battery runtime in minutes
 * @param {string}  [filters.washable]    - "true" to require washable products
 * @param {string}  [filters.series]      - Substring match on ProductFamily name
 * @returns {Promise<Array>} Array of product summaries
 */
export async function listProducts({ q, gender, category, batteryType, runtimeMin, washable, series } = {}) {
  const where = {};
  const andConditions = [];

  // Text search across name, model, and brand (via family)
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { model: { contains: q, mode: 'insensitive' } },
      { family: { brand: { contains: q, mode: 'insensitive' } } },
    ];
  }

  // Exact gender filter
  if (gender) {
    where.gender = gender;
  }

  // Category lives on ProductFamily, filter via relation
  if (category) {
    where.family = {
      ...where.family,
      category,
    };
  }

  // --- Advanced spec-based filters (each uses its own `some` via AND) ---

  if (batteryType) {
    andConditions.push({
      specs: { some: { key: 'battery_type', value: batteryType } },
    });
  }

  // For runtimeMin we need the spec value in JS (it's stored as a string).
  // We still add a DB-level filter to narrow results to products that have the spec key.
  const needsRuntimeFilter = typeof runtimeMin === 'number';
  if (needsRuntimeFilter) {
    andConditions.push({
      specs: { some: { key: 'battery_runtime_minutes' } },
    });
  }

  if (washable === 'true') {
    andConditions.push({
      specs: { some: { key: 'washable', applicability: 'AVAILABLE' } },
    });
  }

  if (series) {
    andConditions.push({
      family: { name: { contains: series, mode: 'insensitive' } },
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // When runtimeMin is requested we need specs in the result for JS post-filtering
  const includeSpecs = needsRuntimeFilter;

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      model: true,
      description: true,
      image: true,
      gender: true,
      priceRange: true,
      highlights: true,
      avgRating: true,
      reviewCount: true,
      verifiedReviewCount: true,
      family: {
        select: {
          name: true,
          brand: true,
          category: true,
        },
      },
      // Include specs only when we need them for runtime post-filtering
      ...(includeSpecs && {
        specs: {
          where: { key: 'battery_runtime_minutes' },
          select: { key: true, value: true },
        },
      }),
    },
    orderBy: { name: 'asc' },
  });

  // Post-filter by runtime if requested
  let result = products;
  if (needsRuntimeFilter) {
    result = products.filter((p) => {
      const runtimeSpec = p.specs?.find((s) => s.key === 'battery_runtime_minutes');
      return runtimeSpec && parseInt(runtimeSpec.value, 10) >= runtimeMin;
    });
  }

  // Strip the temporary specs array from the response (list view doesn't expose specs)
  if (includeSpecs) {
    result = result.map(({ specs, ...rest }) => rest);
  }

  // Parse highlights JSON string for badge display on cards
  result = result.map((p) => ({
    ...p,
    highlights: p.highlights ? JSON.parse(p.highlights) : [],
  }));

  return result;
}

/**
 * Fetch a single product by ID with specs grouped by category,
 * parsed highlights/boxContents, warranty, and recommendation percentage.
 *
 * @param {string} id - The product ID
 * @returns {Promise<Object|null>} Product detail with specGroups, or null if not found
 */
export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      family: {
        select: {
          name: true,
          brand: true,
          category: true,
        },
      },
      specs: {
        orderBy: [
          { category: 'asc' },
          { key: 'asc' },
        ],
      },
    },
  });

  if (!product) {
    return null;
  }

  // Group specs by their category field
  const specGroups = {};
  for (const spec of product.specs) {
    if (!specGroups[spec.category]) {
      specGroups[spec.category] = [];
    }
    specGroups[spec.category].push({
      key: spec.key,
      value: spec.value,
      unit: spec.unit,
      applicability: spec.applicability,
      source: spec.source,
      verifiedAt: spec.verifiedAt,
    });
  }

  // Compute recommendation percentage (reviews with 4+ stars)
  const reviews = await prisma.review.findMany({
    where: { productId: id, status: 'PUBLISHED' },
    select: { overallRating: true },
  });
  const totalReviews = reviews.length;
  const positiveReviews = reviews.filter((r) => r.overallRating >= 4).length;
  const recommendationPct = totalReviews > 0
    ? Math.round((positiveReviews / totalReviews) * 100)
    : null;

  // Build the response without the raw specs array
  const { specs, familyId, createdAt, ...productData } = product;

  return {
    ...productData,
    specGroups,
    highlights: product.highlights ? JSON.parse(product.highlights) : [],
    boxContents: product.boxContents ? JSON.parse(product.boxContents) : [],
    warranty: product.warranty || null,
    recommendationPct,
  };
}
