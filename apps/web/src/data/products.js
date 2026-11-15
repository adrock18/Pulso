/**
 * Static product data — will be replaced with API calls once backend is connected.
 */

export const GENDERS = [
  { id: 'men', label: "Men's Grooming", icon: 'User' },
  { id: 'women', label: "Women's Care", icon: 'Sparkles' },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Products', gender: null, icon: 'Package' },
  { id: 'beard-trimmer', label: 'Beard Trimmers', gender: 'men', icon: 'Scissors' },
  { id: 'multi-grooming', label: 'Multi Grooming Kits', gender: 'men', icon: 'Wrench' },
  { id: 'body-grooming', label: 'Body Groomers', gender: 'men', icon: 'Shield' },
  { id: 'oneblade', label: 'OneBlade', gender: 'men', icon: 'Zap' },
  { id: 'hair-clipper', label: 'Hair Clippers', gender: 'men', icon: 'Grip' },
  { id: 'shaver', label: 'Electric Shavers', gender: 'men', icon: 'CircleDot' },
  { id: 'hair-dryer', label: 'Hair Dryers', gender: 'women', icon: 'Wind' },
  { id: 'hair-straightener', label: 'Hair Straighteners', gender: 'women', icon: 'Flame' },
];

export function getCategoriesByGender(gender) {
  if (!gender) return CATEGORIES.filter(c => c.id !== 'all');
  return CATEGORIES.filter(c => c.gender === gender);
}

export const PRODUCTS = [
  // ── Beard Trimmers ──────────────────────────────────────────
  {
    id: 'bt3211',
    name: 'Philips BT3211/15',
    brand: 'Philips',
    model: 'BT3211/15',
    category: 'beard-trimmer',
    gender: 'men',
    description: 'DuraPower Beard Trimmer with skin-friendly rounded tips and USB charging. 20 lock-in length settings for consistent trimming.',
    image: '/products/bt3211.jpg',
    avgRating: 4.2,
    reviewCount: 12,
    verifiedReviewCount: 5,
    family: 'Beard Trimmer Series 3000',
    priceRange: '₹1,495 – ₹1,799',
    specs: [
      { key: 'battery_runtime_minutes', value: '60', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'charging_type', value: 'USB', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_material', value: 'Stainless Steel', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_width_mm', value: '32', unit: 'mm', category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'lift_and_trim', value: null, unit: null, category: 'Blade', applicability: 'NOT_APPLICABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'length_settings', value: '20', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'length_range_mm', value: '0.5–10', unit: 'mm', category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'washable', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '155', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'travel_lock', value: null, unit: null, category: 'Build', applicability: 'UNKNOWN', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },
  {
    id: 'bt5515',
    name: 'Philips BT5515/15',
    brand: 'Philips',
    model: 'BT5515/15',
    category: 'beard-trimmer',
    gender: 'men',
    description: 'Lift & Trim PRO with metal blades that lift flat-lying hairs. 40 length settings and 90 minutes of cordless runtime.',
    image: '/products/bt5515.jpg',
    avgRating: 4.5,
    reviewCount: 8,
    verifiedReviewCount: 3,
    family: 'Beard Trimmer Series 5000',
    priceRange: '₹2,499 – ₹2,999',
    specs: [
      { key: 'battery_runtime_minutes', value: '90', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'charging_type', value: 'USB-C', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_material', value: 'Metal', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_width_mm', value: '35', unit: 'mm', category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'lift_and_trim', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'length_settings', value: '40', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'length_range_mm', value: '0.4–20', unit: 'mm', category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'washable', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '170', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'travel_lock', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },
  {
    id: 'bt9810',
    name: 'Philips BT9810/15',
    brand: 'Philips',
    model: 'BT9810/15',
    category: 'beard-trimmer',
    gender: 'men',
    description: 'Premium Prestige Beard Trimmer with SteelPrecision blades and full metal body. 30 lock-in settings with 120 min runtime.',
    image: '/products/bt9810.jpg',
    avgRating: 4.7,
    reviewCount: 6,
    verifiedReviewCount: 4,
    family: 'Beard Trimmer Series 9000 Prestige',
    priceRange: '₹8,999 – ₹10,499',
    specs: [
      { key: 'battery_runtime_minutes', value: '120', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'charging_type', value: 'USB-C', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_material', value: 'Metal (SteelPrecision)', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_width_mm', value: '38', unit: 'mm', category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'lift_and_trim', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'length_settings', value: '30', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'length_range_mm', value: '0.4–10', unit: 'mm', category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '148', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'travel_lock', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },

  // ── Multi Grooming Kits ─────────────────────────────────────
  {
    id: 'mg3730',
    name: 'Philips MG3730/15',
    brand: 'Philips',
    model: 'MG3730/15',
    category: 'multi-grooming',
    gender: 'men',
    description: '8-in-1 Multi Grooming Kit with beard, detail, nose, and ear trimmer heads. Compact all-in-one solution.',
    image: '/products/mg3730.jpg',
    avgRating: 3.9,
    reviewCount: 18,
    verifiedReviewCount: 7,
    family: 'Multigroom Series 3000',
    priceRange: '₹1,599 – ₹1,899',
    specs: [
      { key: 'battery_runtime_minutes', value: '60', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '10', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'charging_type', value: 'Adapter', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_material', value: 'Steel', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'attachments_count', value: '8', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'nose_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'body_grooming', value: null, unit: null, category: 'General', applicability: 'NOT_APPLICABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'washable', value: 'Yes (rinse)', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '220', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'storage_pouch', value: null, unit: null, category: 'Build', applicability: 'UNKNOWN', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },
  {
    id: 'mg5940',
    name: 'Philips MG5940/15',
    brand: 'Philips',
    model: 'MG5940/15',
    category: 'multi-grooming',
    gender: 'men',
    description: '12-in-1 Multi Grooming Kit with premium DualCut steel blades. Face, hair, nose, ear, and body in one device.',
    image: '/products/mg5940.jpg',
    avgRating: 4.3,
    reviewCount: 15,
    verifiedReviewCount: 6,
    family: 'Multigroom Series 5000',
    priceRange: '₹2,299 – ₹2,699',
    specs: [
      { key: 'battery_runtime_minutes', value: '80', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '3', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'charging_type', value: 'USB', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_material', value: 'Steel (DualCut)', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'attachments_count', value: '12', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'nose_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'body_grooming', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '195', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'storage_pouch', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },
  {
    id: 'mg7745',
    name: 'Philips MG7745/15',
    brand: 'Philips',
    model: 'MG7745/15',
    category: 'multi-grooming',
    gender: 'men',
    description: '18-in-1 Multi Grooming Kit for face, hair, and body. Includes nose trimmer, body groomer, and multiple combs.',
    image: '/products/mg7745.jpg',
    avgRating: 4.6,
    reviewCount: 24,
    verifiedReviewCount: 10,
    family: 'Multigroom Series 7000',
    priceRange: '₹3,499 – ₹3,999',
    specs: [
      { key: 'battery_runtime_minutes', value: '120', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '5', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'charging_type', value: 'Adapter', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_material', value: 'Steel (DualCut)', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'attachments_count', value: '18', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'nose_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'body_grooming', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '235', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'storage_pouch', value: 'Yes (premium)', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },

  // ── Body Groomers ───────────────────────────────────────────
  {
    id: 'bg3010',
    name: 'Philips BG3010/15',
    brand: 'Philips',
    model: 'BG3010/15',
    category: 'body-grooming',
    gender: 'men',
    description: 'Bodygroom Series 3000 — showerproof body groomer with skin-friendly shaver. Trims and shaves below the neck.',
    image: '/products/bg3010.jpg',
    avgRating: 3.8,
    reviewCount: 11,
    verifiedReviewCount: 4,
    family: 'Bodygroom Series 3000',
    priceRange: '₹1,899 – ₹2,199',
    specs: [
      { key: 'battery_runtime_minutes', value: '50', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '8', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'showerproof', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'bidirectional_trimmer', value: null, unit: null, category: 'Blade', applicability: 'NOT_APPLICABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'skin_guard', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'rounded_tips', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'comb_lengths', value: '3, 5, 7 mm', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'body_zones', value: 'Chest, back, groin', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '120', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },
  {
    id: 'bg5020',
    name: 'Philips BG5020/15',
    brand: 'Philips',
    model: 'BG5020/15',
    category: 'body-grooming',
    gender: 'men',
    description: 'Bodygroom Series 5000 with bi-directional trimmer and rounded tips. Showerproof for wet and dry use.',
    image: '/products/bg5020.jpg',
    avgRating: 4.1,
    reviewCount: 9,
    verifiedReviewCount: 3,
    family: 'Bodygroom Series 5000',
    priceRange: '₹2,799 – ₹3,299',
    specs: [
      { key: 'battery_runtime_minutes', value: '70', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '8', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'showerproof', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'bidirectional_trimmer', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'skin_guard', value: 'Yes (3D)', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'rounded_tips', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'comb_lengths', value: '3, 5, 7, 9, 11 mm', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'body_zones', value: 'Full body', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '160', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },

  // ── Electric Shavers ────────────────────────────────────────
  {
    id: 's1223',
    name: 'Philips S1223/45',
    brand: 'Philips',
    model: 'S1223/45',
    category: 'shaver',
    gender: 'men',
    description: 'Shaver Series 1000 — wet or dry electric shaver with PowerCut blades. Flex heads follow facial contours.',
    image: '/products/s1223.jpg',
    avgRating: 4.0,
    reviewCount: 20,
    verifiedReviewCount: 8,
    family: 'Shaver Series 1000',
    priceRange: '₹1,999 – ₹2,399',
    specs: [
      { key: 'shaving_heads', value: '3 (rotary)', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_system', value: 'PowerCut', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'flex_heads', value: '4-direction', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'wet_and_dry', value: 'Yes', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'pop_up_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_runtime_minutes', value: '40', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '8', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '185', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'travel_lock', value: null, unit: null, category: 'Build', applicability: 'UNKNOWN', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },
  {
    id: 's5588',
    name: 'Philips S5588/20',
    brand: 'Philips',
    model: 'S5588/20',
    category: 'shaver',
    gender: 'men',
    description: 'Shaver Series 5000 with SteelPrecision blades and SkinIQ technology. 360° flex heads for a close, comfortable shave.',
    image: '/products/s5588.jpg',
    avgRating: 4.4,
    reviewCount: 14,
    verifiedReviewCount: 6,
    family: 'Shaver Series 5000',
    priceRange: '₹5,999 – ₹6,999',
    specs: [
      { key: 'shaving_heads', value: '3 (rotary)', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'blade_system', value: 'SteelPrecision', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'flex_heads', value: '360° ContourDetect', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'wet_and_dry', value: 'Yes', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'skin_iq', value: 'Yes', unit: null, category: 'Shaving', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'pop_up_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_runtime_minutes', value: '60', unit: 'min', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '195', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'travel_lock', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },

  // ── Hair Care ───────────────────────────────────────────────
  {
    id: 'bhd308',
    name: 'Philips BHD308/30',
    brand: 'Philips',
    model: 'BHD308/30',
    category: 'hair-dryer',
    gender: 'women',
    description: '3000 Series ThermoProtect Hair Dryer with 1600W. 3 heat and speed settings with cool shot for style setting.',
    image: '/products/bhd308.jpg',
    avgRating: 4.3,
    reviewCount: 16,
    verifiedReviewCount: 5,
    family: 'Hair Dryer 3000 Series',
    priceRange: '₹1,495 – ₹1,799',
    specs: [
      { key: 'wattage', value: '1600', unit: 'W', category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'heat_settings', value: '3', unit: null, category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'speed_settings', value: '3', unit: null, category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'cool_shot', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'thermo_protect', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'ionic_conditioning', value: null, unit: null, category: 'Performance', applicability: 'NOT_APPLICABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'concentrator_nozzle', value: 'Yes (14 mm)', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'diffuser', value: null, unit: null, category: 'General', applicability: 'NOT_APPLICABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'cord_length_m', value: '1.8', unit: 'm', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'hanging_loop', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '400', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },
  {
    id: 'bhs378',
    name: 'Philips BHS378/10',
    brand: 'Philips',
    model: 'BHS378/10',
    category: 'hair-straightener',
    gender: 'women',
    description: '3000 Series Hair Straightener with ThermoProtect and keratin-infused ceramic plates. Heats up in 60 seconds.',
    image: '/products/bhs378.jpg',
    avgRating: 4.2,
    reviewCount: 13,
    verifiedReviewCount: 4,
    family: 'Straightener 3000 Series',
    priceRange: '₹1,895 – ₹2,199',
    specs: [
      { key: 'plate_material', value: 'Keratin Ceramic', unit: null, category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'plate_width_mm', value: '28', unit: 'mm', category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'max_temperature_c', value: '230', unit: '°C', category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'heat_settings', value: '6', unit: null, category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'heat_up_time_seconds', value: '60', unit: 'sec', category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'thermo_protect', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'ionic_conditioning', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'auto_shutoff', value: 'Yes (60 min)', unit: null, category: 'General', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'swivel_cord', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'cord_length_m', value: '1.8', unit: 'm', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
      { key: 'weight_grams', value: '350', unit: 'g', category: 'Build', applicability: 'AVAILABLE', source: 'philips.co.in', verifiedAt: '2024-11-01' },
    ],
  },
];

export const DEMO_REVIEWS = [
  // Beard Trimmer reviews
  {
    id: 'r1', productId: 'bt3211', isAnonymous: false, displayName: 'Rahul M.', isVerified: true,
    overallRating: 5, batteryRating: 5, buildRating: 4, easeOfUseRating: 5, performanceRating: 5, valueRating: 4,
    positiveText: 'Excellent battery life and very comfortable to use. The DuraPower technology really makes a difference — I charge it once a week.',
    negativeText: 'Wish it came with a travel pouch.',
    purchaseDate: '2024-08-15', retailer: 'Amazon India', createdAt: '2024-09-01', helpful: 14, replies: 2,
  },
  {
    id: 'r2', productId: 'bt3211', isAnonymous: true, displayName: null, isVerified: false,
    overallRating: 3, batteryRating: 3, buildRating: 3, easeOfUseRating: 4, performanceRating: 3, valueRating: 3,
    positiveText: 'Does the job for basic trimming.',
    negativeText: 'Not great for very thick beards. Struggled to cut evenly on longer settings.',
    purchaseDate: null, retailer: 'Flipkart', createdAt: '2024-10-12', helpful: 7, replies: 4,
  },
  {
    id: 'r3', productId: 'bt3211', isAnonymous: false, displayName: 'Anil K.', isVerified: true,
    overallRating: 4, batteryRating: 4, buildRating: 4, easeOfUseRating: 5, performanceRating: 4, valueRating: 5,
    positiveText: 'Great value for money. USB charging is very convenient, especially when traveling.',
    negativeText: null,
    purchaseDate: '2024-07-20', retailer: 'Croma', createdAt: '2024-08-05', helpful: 22, replies: 1,
  },
  // Multi grooming
  {
    id: 'r4', productId: 'mg7745', isAnonymous: false, displayName: 'Vikram S.', isVerified: true,
    overallRating: 5, batteryRating: 4, buildRating: 5, easeOfUseRating: 5, performanceRating: 5, valueRating: 5,
    positiveText: 'The 18-in-1 kit is incredible. I use the nose trimmer, beard trimmer, and body groomer every week. All in one device.',
    negativeText: 'Charging takes 5 hours — that is a LOT. Only real downside.',
    purchaseDate: '2024-06-10', retailer: 'Amazon India', createdAt: '2024-07-01', helpful: 31, replies: 5,
  },
  {
    id: 'r5', productId: 'mg7745', isAnonymous: true, displayName: null, isVerified: false,
    overallRating: 4, batteryRating: 3, buildRating: 4, easeOfUseRating: 4, performanceRating: 5, valueRating: 4,
    positiveText: 'Great all-rounder. Handles thick hair well and the attachments are solid.',
    negativeText: 'Ni-MH battery shows its age. Wish they used Li-Ion like the BT series.',
    purchaseDate: '2024-09-01', retailer: 'Reliance Digital', createdAt: '2024-09-20', helpful: 8, replies: 3,
  },
  // Beard trimmer premium
  {
    id: 'r6', productId: 'bt5515', isAnonymous: false, displayName: 'Priya R.', isVerified: true,
    overallRating: 5, batteryRating: 5, buildRating: 5, easeOfUseRating: 5, performanceRating: 5, valueRating: 4,
    positiveText: 'Bought this for my husband. The Lift & Trim really works — his beard looks much neater compared to his old BT3211. 90 min runtime is plenty.',
    negativeText: 'Pricier than the 3000 series, but you can feel the quality difference.',
    purchaseDate: '2024-10-05', retailer: 'Official Brand Store', createdAt: '2024-10-20', helpful: 18, replies: 2,
  },
  {
    id: 'r7', productId: 'bt9810', isAnonymous: false, displayName: 'Arjun D.', isVerified: true,
    overallRating: 5, batteryRating: 5, buildRating: 5, easeOfUseRating: 4, performanceRating: 5, valueRating: 3,
    positiveText: 'Premium build quality. The metal body feels substantial. Best trimmer I have ever used — precise, powerful, and silent.',
    negativeText: 'Very expensive. Hard to justify unless grooming is important to you.',
    purchaseDate: '2024-08-01', retailer: 'Amazon India', createdAt: '2024-08-15', helpful: 25, replies: 6,
  },
  // Body groomer
  {
    id: 'r8', productId: 'bg5020', isAnonymous: true, displayName: null, isVerified: false,
    overallRating: 4, batteryRating: 3, buildRating: 4, easeOfUseRating: 5, performanceRating: 4, valueRating: 4,
    positiveText: 'Works great in the shower. The rounded tips really do prevent nicks — I have sensitive skin and this is the first body groomer I trust.',
    negativeText: 'Battery could be better. 70 minutes is okay but I wish it were 90+.',
    purchaseDate: null, retailer: 'Flipkart', createdAt: '2024-11-01', helpful: 5, replies: 1,
  },
  // Shaver
  {
    id: 'r9', productId: 's5588', isAnonymous: false, displayName: 'Karan T.', isVerified: true,
    overallRating: 4, batteryRating: 5, buildRating: 4, easeOfUseRating: 4, performanceRating: 4, valueRating: 3,
    positiveText: 'SkinIQ is impressive — it adapts to my beard density. Very close shave without irritation. The 360° heads really follow jaw contours.',
    negativeText: 'Expensive for a shaver. The pop-up trimmer could be sharper.',
    purchaseDate: '2024-09-10', retailer: 'Croma', createdAt: '2024-09-25', helpful: 12, replies: 3,
  },
  {
    id: 'r10', productId: 's1223', isAnonymous: false, displayName: 'Deepak P.', isVerified: false,
    overallRating: 4, batteryRating: 3, buildRating: 4, easeOfUseRating: 5, performanceRating: 3, valueRating: 5,
    positiveText: 'Best budget shaver you can get. Smooth shave for the price. Wet and dry is a huge plus.',
    negativeText: 'Charging takes 8 hours with Ni-MH. 40 min runtime is bare minimum — often runs out mid-shave if I forget to charge.',
    purchaseDate: '2024-10-20', retailer: 'Flipkart', createdAt: '2024-11-05', helpful: 9, replies: 2,
  },
  // Hair care
  {
    id: 'r11', productId: 'bhd308', isAnonymous: false, displayName: 'Meera J.', isVerified: true,
    overallRating: 4, batteryRating: null, buildRating: 4, easeOfUseRating: 5, performanceRating: 4, valueRating: 5,
    positiveText: 'Perfect everyday dryer. ThermoProtect keeps heat gentle — my hair feels healthier than with my old dryer. Lightweight and easy to handle.',
    negativeText: 'No ionic. My hair gets a bit frizzy compared to pricier models.',
    purchaseDate: '2024-07-15', retailer: 'Amazon India', createdAt: '2024-08-01', helpful: 16, replies: 4,
  },
  {
    id: 'r12', productId: 'bhs378', isAnonymous: true, displayName: null, isVerified: false,
    overallRating: 4, batteryRating: null, buildRating: 3, easeOfUseRating: 4, performanceRating: 4, valueRating: 4,
    positiveText: 'Heats up in under a minute. Keratin plates glide smoothly. My thick curly hair goes straight in one pass.',
    negativeText: 'Plates are a bit narrow at 28mm. Takes longer on very long hair. Would prefer 40mm+.',
    purchaseDate: null, retailer: 'Myntra', createdAt: '2024-10-28', helpful: 6, replies: 1,
  },
];

export const RETAILERS = [
  'Flipkart', 'Amazon India', 'Myntra', 'Croma',
  'Reliance Digital', 'Official Brand Store', 'Other',
];

export function formatSpecKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace('Mm', 'mm')
    .replace('Minutes', 'Runtime')
    .replace('Hours', 'Time');
}

export function groupSpecsByCategory(specs) {
  const groups = {};
  for (const spec of specs) {
    if (!groups[spec.category]) groups[spec.category] = [];
    groups[spec.category].push(spec);
  }
  return groups;
}

export function displaySpecValue(spec) {
  if (spec.applicability === 'UNKNOWN') return 'Unknown';
  if (spec.applicability === 'NOT_APPLICABLE') return 'N/A';
  return spec.value + (spec.unit ? ` ${spec.unit}` : '');
}

export function getAllReviews() {
  return [...DEMO_REVIEWS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}
