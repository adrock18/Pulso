import prisma from '../config/db.js';

/**
 * Convert a canonical spec key like "battery_runtime_minutes"
 * to a human-readable label like "Battery Runtime Minutes".
 *
 * @param {string} key - The canonical spec key
 * @returns {string} Human-readable label
 */
function formatSpecKey(key) {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Build a product summary object for the comparison response.
 *
 * @param {Object} product - Prisma product with family relation
 * @returns {Object} Trimmed product summary
 */
function buildProductSummary(product) {
  return {
    id: product.id,
    name: product.name,
    model: product.model,
    image: product.image,
    avgRating: product.avgRating,
    reviewCount: product.reviewCount,
    priceRange: product.priceRange,
  };
}

/**
 * Compare two products by their canonical spec keys.
 *
 * 1. Rejects same-ID comparison
 * 2. Fetches both products with specs from Prisma
 * 3. If either product not found, throws with details
 * 4. Matches specs by canonical key across both products
 * 5. Groups matched specs by category
 * 6. Computes isDifferent for each spec row
 * 7. Handles specs that exist on only one product
 *
 * @param {string} idA - Product ID A
 * @param {string} idB - Product ID B
 * @returns {Promise<Object>} Structured comparison data
 * @throws {Object} With `status` and `message` properties on error
 */
export async function compareProducts(idA, idB) {
  // 1. Reject same-ID comparison
  if (idA === idB) {
    const error = new Error('Cannot compare a product with itself');
    error.status = 400;
    throw error;
  }

  // 2. Fetch both products with their specs, ordered by category then key
  const [productA, productB] = await Promise.all([
    prisma.product.findUnique({
      where: { id: idA },
      include: {
        family: { select: { name: true, brand: true, category: true } },
        specs: { orderBy: [{ category: 'asc' }, { key: 'asc' }] },
      },
    }),
    prisma.product.findUnique({
      where: { id: idB },
      include: {
        family: { select: { name: true, brand: true, category: true } },
        specs: { orderBy: [{ category: 'asc' }, { key: 'asc' }] },
      },
    }),
  ]);

  // 3. Check if either product is missing
  if (!productA && !productB) {
    const error = new Error('Both products not found');
    error.status = 404;
    throw error;
  }
  if (!productA) {
    const error = new Error(`Product not found: ${idA}`);
    error.status = 404;
    throw error;
  }
  if (!productB) {
    const error = new Error(`Product not found: ${idB}`);
    error.status = 404;
    throw error;
  }

  // 4. Index specs by canonical key for each product
  const specsA = new Map();
  for (const spec of productA.specs) {
    specsA.set(spec.key, spec);
  }

  const specsB = new Map();
  for (const spec of productB.specs) {
    specsB.set(spec.key, spec);
  }

  // Collect all unique spec keys
  const allKeys = new Set([...specsA.keys(), ...specsB.keys()]);

  // 5. Group specs by category, building comparison rows
  // We need to determine category for each key — use whichever product has it
  const categoryMap = new Map(); // category -> array of spec rows

  for (const key of allKeys) {
    const specA = specsA.get(key) || null;
    const specB = specsB.get(key) || null;

    // Determine the category from whichever product has this spec
    const category = specA ? specA.category : specB.category;

    // Determine the unit from whichever product has this spec
    const unit = (specA && specA.unit) || (specB && specB.unit) || null;

    // 6. Build the side values and compute isDifferent
    const sideA = specA
      ? { value: specA.value, applicability: specA.applicability }
      : { value: null, applicability: null };

    const sideB = specB
      ? { value: specB.value, applicability: specB.applicability }
      : { value: null, applicability: null };

    // isDifferent: true if values differ, applicabilities differ,
    // or the spec exists on only one product
    const isDifferent =
      sideA.value !== sideB.value ||
      sideA.applicability !== sideB.applicability;

    const specRow = {
      key,
      label: formatSpecKey(key),
      unit,
      productA: sideA,
      productB: sideB,
      isDifferent,
    };

    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category).push(specRow);
  }

  // Convert the category map to a sorted array of category objects
  const categories = Array.from(categoryMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, specs]) => ({
      name,
      specs: specs.sort((a, b) => a.key.localeCompare(b.key)),
    }));

  // 8. Return structured comparison data
  return {
    productA: buildProductSummary(productA),
    productB: buildProductSummary(productB),
    categories,
  };
}
