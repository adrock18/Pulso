/**
 * Seed script — populates the ProductPulse database with 18 Philips products and their specs.
 *
 * Run from the repo root:
 *   node scripts/seed.js
 *
 * Requires DATABASE_URL in apps/api/.env
 */

import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const VERIFIED_AT = new Date('2024-11-01');
const SOURCE = 'philips.co.in';

// ── Families ──────────────────────────────────────────────────────────────────

const families = [
  { key: 'bt3000', name: 'Beard Trimmer Series 3000', brand: 'Philips', category: 'beard-trimmer', gender: 'men' },
  { key: 'bt5000', name: 'Beard Trimmer Series 5000', brand: 'Philips', category: 'beard-trimmer', gender: 'men' },
  { key: 'bt9000', name: 'Beard Trimmer Series 9000 Prestige', brand: 'Philips', category: 'beard-trimmer', gender: 'men' },
  { key: 'mg3000', name: 'Multigroom Series 3000', brand: 'Philips', category: 'multi-grooming', gender: 'men' },
  { key: 'mg5000', name: 'Multigroom Series 5000', brand: 'Philips', category: 'multi-grooming', gender: 'men' },
  { key: 'mg7000', name: 'Multigroom Series 7000', brand: 'Philips', category: 'multi-grooming', gender: 'men' },
  { key: 'bg3000', name: 'Bodygroom Series 3000', brand: 'Philips', category: 'body-grooming', gender: 'men' },
  { key: 'bg5000', name: 'Bodygroom Series 5000', brand: 'Philips', category: 'body-grooming', gender: 'men' },
  { key: 'ob-first', name: 'OneBlade First Shave', brand: 'Philips', category: 'oneblade', gender: 'men' },
  { key: 'ob-face', name: 'OneBlade Face', brand: 'Philips', category: 'oneblade', gender: 'men' },
  { key: 'ob-pro', name: 'OneBlade Pro', brand: 'Philips', category: 'oneblade', gender: 'men' },
  { key: 's1000', name: 'Shaver Series 1000', brand: 'Philips', category: 'shaver', gender: 'men' },
  { key: 's5000', name: 'Shaver Series 5000', brand: 'Philips', category: 'shaver', gender: 'men' },
  { key: 'hc3000', name: 'Hair Clipper Series 3000', brand: 'Philips', category: 'hair-clipper', gender: 'men' },
  { key: 'hc5000', name: 'Hair Clipper Series 5000', brand: 'Philips', category: 'hair-clipper', gender: 'men' },
  { key: 'hc7000', name: 'Hair Clipper Series 7000', brand: 'Philips', category: 'hair-clipper', gender: 'men' },
  { key: 'bhd3000', name: 'Hair Dryer 3000 Series', brand: 'Philips', category: 'hair-dryer', gender: 'women' },
  { key: 'bhs3000', name: 'Straightener 3000 Series', brand: 'Philips', category: 'hair-straightener', gender: 'women' },
];

// ── Products ──────────────────────────────────────────────────────────────────

const products = [
  // ── Beard Trimmers ──────────────────────────────────────────
  {
    familyKey: 'bt3000',
    model: 'BT3211/15',
    name: 'Philips BT3211/15',
    gender: 'men',
    priceRange: '₹1,495 – ₹1,799',
    description: 'DuraPower Beard Trimmer with skin-friendly rounded tips and USB charging. 20 lock-in length settings for consistent trimming.',
    image: '/products/bt3211.jpg',
    avgRating: 4.2,
    reviewCount: 12,
    verifiedReviewCount: 5,
    warranty: '2 years',
    highlights: JSON.stringify(['DuraPower', 'USB Charging']),
    boxContents: JSON.stringify(['Trimmer', 'USB charging cable', '2 beard combs (1mm, 3mm)']),
    specs: [
      { key: 'battery_runtime_minutes', value: '60', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'USB', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Stainless Steel', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'blade_width_mm', value: '32', unit: 'mm', category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'lift_and_trim', value: null, unit: null, category: 'Blade', applicability: 'NOT_APPLICABLE' },
      { key: 'length_settings', value: '20', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'length_range_mm', value: '0.5–10', unit: 'mm', category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '155', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'travel_lock', value: null, unit: null, category: 'Build', applicability: 'UNKNOWN' },
    ],
  },
  {
    familyKey: 'bt5000',
    model: 'BT5515/15',
    name: 'Philips BT5515/15',
    gender: 'men',
    priceRange: '₹2,499 – ₹2,999',
    description: 'Lift & Trim PRO with metal blades that lift flat-lying hairs. 40 length settings and 90 minutes of cordless runtime.',
    image: '/products/bt5515.jpg',
    avgRating: 4.5,
    reviewCount: 8,
    verifiedReviewCount: 3,
    warranty: '2 years',
    highlights: JSON.stringify(['Lift & Trim PRO', 'Metal Blades', 'USB-C']),
    boxContents: JSON.stringify(['Trimmer', 'USB-C charging cable', '3 beard combs', 'Cleaning brush', 'Pouch']),
    specs: [
      { key: 'battery_runtime_minutes', value: '90', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'USB-C', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Metal', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'blade_width_mm', value: '35', unit: 'mm', category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'lift_and_trim', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'length_settings', value: '40', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'length_range_mm', value: '0.4–20', unit: 'mm', category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '170', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'travel_lock', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
  {
    familyKey: 'bt9000',
    model: 'BT9810/15',
    name: 'Philips BT9810/15',
    gender: 'men',
    priceRange: '₹8,999 – ₹10,499',
    description: 'Premium Prestige Beard Trimmer with SteelPrecision blades and full metal body. 30 lock-in settings with 120 min runtime.',
    image: '/products/bt9810.jpg',
    avgRating: 4.7,
    reviewCount: 6,
    verifiedReviewCount: 4,
    warranty: '2 years',
    highlights: JSON.stringify(['SteelPrecision', 'Full Metal Body', 'USB-C']),
    boxContents: JSON.stringify(['Trimmer', 'USB-C charging cable', 'Precision dial comb', 'Travel pouch', 'Cleaning brush']),
    specs: [
      { key: 'battery_runtime_minutes', value: '120', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'USB-C', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Metal (SteelPrecision)', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'blade_width_mm', value: '38', unit: 'mm', category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'lift_and_trim', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'length_settings', value: '30', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'length_range_mm', value: '0.4–10', unit: 'mm', category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '148', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'travel_lock', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
    ],
  },

  // ── Multi Grooming Kits ─────────────────────────────────────
  {
    familyKey: 'mg3000',
    model: 'MG3730/15',
    name: 'Philips MG3730/15',
    gender: 'men',
    priceRange: '₹1,599 – ₹1,899',
    description: '8-in-1 Multi Grooming Kit with beard, detail, nose, and ear trimmer heads. Compact all-in-one solution.',
    image: '/products/mg3730.jpg',
    avgRating: 3.9,
    reviewCount: 18,
    verifiedReviewCount: 7,
    warranty: '2 years',
    highlights: JSON.stringify(['8-in-1', 'Self-Sharpening']),
    boxContents: JSON.stringify(['Trimmer', 'Beard comb', 'Stubble comb', 'Detail trimmer', 'Nose trimmer head', 'Ear trimmer head', 'Hair comb', 'Adapter']),
    specs: [
      { key: 'battery_runtime_minutes', value: '60', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '10', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'Adapter', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_indicator', value: 'LED', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Steel', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'attachments_count', value: '8', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'nose_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'body_grooming', value: null, unit: null, category: 'General', applicability: 'NOT_APPLICABLE' },
      { key: 'washable', value: 'Yes (rinse)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '220', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'storage_pouch', value: null, unit: null, category: 'Build', applicability: 'UNKNOWN' },
    ],
  },
  {
    familyKey: 'mg5000',
    model: 'MG5940/15',
    name: 'Philips MG5940/15',
    gender: 'men',
    priceRange: '₹2,299 – ₹2,699',
    description: '12-in-1 Multi Grooming Kit with premium DualCut steel blades. Face, hair, nose, ear, and body in one device.',
    image: '/products/mg5940.jpg',
    avgRating: 4.3,
    reviewCount: 15,
    verifiedReviewCount: 6,
    warranty: '2 years',
    highlights: JSON.stringify(['12-in-1', 'DualCut', 'USB Charging']),
    boxContents: JSON.stringify(['Trimmer', '6 beard combs', 'Hair comb', 'Body comb', 'Nose trimmer head', 'Detail trimmer head', 'USB cable', 'Storage pouch']),
    specs: [
      { key: 'battery_runtime_minutes', value: '80', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '3', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'USB', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_indicator', value: 'LED', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Steel (DualCut)', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'beard_sense', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'attachments_count', value: '12', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'nose_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'body_grooming', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '195', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'storage_pouch', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
  {
    familyKey: 'mg7000',
    model: 'MG7745/15',
    name: 'Philips MG7745/15',
    gender: 'men',
    priceRange: '₹3,499 – ₹3,999',
    description: '18-in-1 Multi Grooming Kit for face, hair, and body. Includes nose trimmer, body groomer, and multiple combs.',
    image: '/products/mg7745.jpg',
    avgRating: 4.6,
    reviewCount: 24,
    verifiedReviewCount: 10,
    warranty: '2 years',
    highlights: JSON.stringify(['18-in-1', 'DualCut', 'Full Body']),
    boxContents: JSON.stringify(['Trimmer', '8 beard combs', 'Hair comb', 'Body comb', 'Nose trimmer head', 'Detail trimmer head', 'Adapter', 'Premium storage pouch']),
    specs: [
      { key: 'battery_runtime_minutes', value: '120', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '5', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'Adapter', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_indicator', value: 'LED', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Steel (DualCut)', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'beard_sense', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'attachments_count', value: '18', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'nose_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'body_grooming', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '235', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'storage_pouch', value: 'Yes (premium)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
    ],
  },

  // ── Body Groomers ───────────────────────────────────────────
  {
    familyKey: 'bg3000',
    model: 'BG3010/15',
    name: 'Philips BG3010/15',
    gender: 'men',
    priceRange: '₹1,899 – ₹2,199',
    description: 'Bodygroom Series 3000 — showerproof body groomer with skin-friendly shaver. Trims and shaves below the neck.',
    image: '/products/bg3010.jpg',
    avgRating: 3.8,
    reviewCount: 11,
    verifiedReviewCount: 4,
    warranty: '2 years',
    highlights: JSON.stringify(['Showerproof', 'Skin Guard']),
    boxContents: JSON.stringify(['Body groomer', '3 comb attachments (3mm, 5mm, 7mm)', 'Adapter']),
    specs: [
      { key: 'battery_runtime_minutes', value: '50', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '8', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_indicator', value: 'LED', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'showerproof', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'bidirectional_trimmer', value: null, unit: null, category: 'Blade', applicability: 'NOT_APPLICABLE' },
      { key: 'skin_guard', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'rounded_tips', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'comb_lengths', value: '3, 5, 7 mm', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'body_zones', value: 'Chest, back, groin', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '120', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
  {
    familyKey: 'bg5000',
    model: 'BG5020/15',
    name: 'Philips BG5020/15',
    gender: 'men',
    priceRange: '₹2,799 – ₹3,299',
    description: 'Bodygroom Series 5000 with bi-directional trimmer and rounded tips. Showerproof for wet and dry use.',
    image: '/products/bg5020.jpg',
    avgRating: 4.1,
    reviewCount: 9,
    verifiedReviewCount: 3,
    warranty: '2 years',
    highlights: JSON.stringify(['Bi-Directional', '3D Skin Guard', 'Showerproof']),
    boxContents: JSON.stringify(['Body groomer', '5 comb attachments (3-11mm)', 'Adapter', 'Cleaning brush']),
    specs: [
      { key: 'battery_runtime_minutes', value: '70', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '8', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_indicator', value: 'LED', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'showerproof', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'bidirectional_trimmer', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'skin_guard', value: 'Yes (3D)', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'rounded_tips', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'comb_lengths', value: '3, 5, 7, 9, 11 mm', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'body_zones', value: 'Full body', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '160', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
    ],
  },

  // ── OneBlade ────────────────────────────────────────────────
  {
    familyKey: 'ob-first',
    model: 'QP1624/10',
    name: 'Philips QP1624/10',
    gender: 'men',
    priceRange: '₹1,799 – ₹2,099',
    description: 'OneBlade First Shave — gentle on young skin. Trims, edges, and shaves any length with a single blade that never touches skin directly.',
    image: '/products/qp1624.jpg',
    avgRating: 4.1,
    reviewCount: 22,
    verifiedReviewCount: 8,
    warranty: '2 years',
    highlights: JSON.stringify(['OneBlade', 'Gentle on Skin']),
    boxContents: JSON.stringify(['OneBlade handle', 'OneBlade blade', '1 click-on comb (3mm)']),
    specs: [
      { key: 'battery_runtime_minutes', value: '30', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '8', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'dual_sided_blade', value: 'No', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'blade_replacement_months', value: '4', unit: 'months', category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'use_on_body', value: 'No', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '95', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
  {
    familyKey: 'ob-face',
    model: 'QP2724/10',
    name: 'Philips QP2724/10',
    gender: 'men',
    priceRange: '₹2,499 – ₹2,899',
    description: 'OneBlade Face — trim, edge, and shave any length of facial hair. Fast USB charging and 4 click-on combs for versatile styling.',
    image: '/products/qp2724.jpg',
    avgRating: 4.3,
    reviewCount: 35,
    verifiedReviewCount: 12,
    warranty: '2 years',
    highlights: JSON.stringify(['OneBlade', 'Trim Edge Shave', 'USB Charging']),
    boxContents: JSON.stringify(['OneBlade handle', 'OneBlade blade', '4 click-on combs (1mm, 3mm, 5mm, 7mm)', 'USB cable']),
    specs: [
      { key: 'battery_runtime_minutes', value: '45', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '4', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'USB', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'dual_sided_blade', value: 'No', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'blade_replacement_months', value: '4', unit: 'months', category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'click_on_combs', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'use_on_body', value: 'No', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '97', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
  {
    familyKey: 'ob-pro',
    model: 'QP6651/61',
    name: 'Philips QP6651/61',
    gender: 'men',
    priceRange: '₹4,999 – ₹5,499',
    description: 'OneBlade Pro Face + Body — the premium OneBlade with dual-sided blade, 14 precision lengths, LED display, and dedicated body comb.',
    image: '/products/qp6651.jpg',
    avgRating: 4.5,
    reviewCount: 18,
    verifiedReviewCount: 7,
    warranty: '2 years',
    highlights: JSON.stringify(['OneBlade Pro', 'Face + Body', '14 Lengths', 'LED Display']),
    boxContents: JSON.stringify(['OneBlade Pro handle', 'Face blade', 'Body blade', 'Body comb', 'Precision comb (14 lengths)', 'Skin guard', 'USB-C cable', 'Travel pouch']),
    specs: [
      { key: 'battery_runtime_minutes', value: '90', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'USB-C', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_indicator', value: 'LED', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'dual_sided_blade', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'blade_replacement_months', value: '4', unit: 'months', category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'click_on_combs', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'use_on_body', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'length_settings', value: '14', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'precision_step_mm', value: '0.5', unit: 'mm', category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '105', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'travel_lock', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
    ],
  },

  // ── Electric Shavers ────────────────────────────────────────
  {
    familyKey: 's1000',
    model: 'S1223/45',
    name: 'Philips S1223/45',
    gender: 'men',
    priceRange: '₹1,999 – ₹2,399',
    description: 'Shaver Series 1000 — wet or dry electric shaver with PowerCut blades. Flex heads follow facial contours.',
    image: '/products/s1223.jpg',
    avgRating: 4.0,
    reviewCount: 20,
    verifiedReviewCount: 8,
    warranty: '2 years',
    highlights: JSON.stringify(['PowerCut', '4D Flex Heads', 'Wet & Dry']),
    boxContents: JSON.stringify(['Shaver', 'Protection cap', 'Adapter']),
    specs: [
      { key: 'shaving_heads', value: '3 (rotary)', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'blade_system', value: 'PowerCut', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'flex_heads', value: '4-direction', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'wet_and_dry', value: 'Yes', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'pop_up_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'battery_runtime_minutes', value: '40', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '8', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '185', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'travel_lock', value: null, unit: null, category: 'Build', applicability: 'UNKNOWN' },
    ],
  },
  {
    familyKey: 's5000',
    model: 'S5588/20',
    name: 'Philips S5588/20',
    gender: 'men',
    priceRange: '₹5,999 – ₹6,999',
    description: 'Shaver Series 5000 with SteelPrecision blades and SkinIQ technology. 360° flex heads for a close, comfortable shave.',
    image: '/products/s5588.jpg',
    avgRating: 4.4,
    reviewCount: 14,
    verifiedReviewCount: 6,
    warranty: '2 years',
    highlights: JSON.stringify(['SkinIQ', 'SteelPrecision', '360° ContourDetect']),
    boxContents: JSON.stringify(['Shaver', 'USB-C charging cable', 'Protection cap', 'Travel case', 'Cleaning brush']),
    specs: [
      { key: 'shaving_heads', value: '3 (rotary)', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'blade_system', value: 'SteelPrecision', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'flex_heads', value: '360° ContourDetect', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'wet_and_dry', value: 'Yes', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'skin_iq', value: 'Yes', unit: null, category: 'Shaving', applicability: 'AVAILABLE' },
      { key: 'pop_up_trimmer', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'battery_runtime_minutes', value: '60', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '195', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'travel_lock', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
    ],
  },

  // ── Hair Clippers ───────────────────────────────────────────
  {
    familyKey: 'hc3000',
    model: 'HC3520/15',
    name: 'Philips HC3520/15',
    gender: 'men',
    priceRange: '₹1,399 – ₹1,699',
    description: 'Hair Clipper Series 3000 — stainless steel blades with 13 cutting lengths. Self-sharpening for long-lasting performance.',
    image: '/products/hc3520.jpg',
    avgRating: 4.0,
    reviewCount: 28,
    verifiedReviewCount: 10,
    warranty: '2 years',
    highlights: JSON.stringify(['Stainless Steel', '13 Lengths']),
    boxContents: JSON.stringify(['Hair clipper', '2 comb attachments', 'Cleaning brush', 'Adapter']),
    specs: [
      { key: 'battery_runtime_minutes', value: '60', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '8', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Ni-MH', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Stainless Steel', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'cutting_lengths', value: '13', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'length_range_mm', value: '0.5–23', unit: 'mm', category: 'General', applicability: 'AVAILABLE' },
      { key: 'cordless_use', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (rinse)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '195', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
  {
    familyKey: 'hc5000',
    model: 'HC5632/15',
    name: 'Philips HC5632/15',
    gender: 'men',
    priceRange: '₹2,499 – ₹2,899',
    description: 'Hair Clipper Series 5000 — DualCut blades with Boost mode for thick hair. 28 length settings and 90 min runtime.',
    image: '/products/hc5632.jpg',
    avgRating: 4.3,
    reviewCount: 15,
    verifiedReviewCount: 5,
    warranty: '2 years',
    highlights: JSON.stringify(['DualCut', '28 Lengths', 'Boost Mode']),
    boxContents: JSON.stringify(['Hair clipper', '3 comb attachments', 'Scissors', 'Cape', 'Cleaning brush', 'Adapter']),
    specs: [
      { key: 'battery_runtime_minutes', value: '90', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_indicator', value: 'LED', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Steel (DualCut)', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'cutting_lengths', value: '28', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'length_range_mm', value: '0.5–28', unit: 'mm', category: 'General', applicability: 'AVAILABLE' },
      { key: 'cordless_use', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'motor_type', value: 'Boost', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '210', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
  {
    familyKey: 'hc7000',
    model: 'HC7650/15',
    name: 'Philips HC7650/15',
    gender: 'men',
    priceRange: '₹3,999 – ₹4,499',
    description: 'Hair Clipper Series 7000 — premium DualCut blades with Speed Control and memory function. 28 lengths and 120 min runtime.',
    image: '/products/hc7650.jpg',
    avgRating: 4.6,
    reviewCount: 10,
    verifiedReviewCount: 4,
    warranty: '2 years',
    highlights: JSON.stringify(['DualCut', '28 Lengths', 'Speed Control', 'Memory']),
    boxContents: JSON.stringify(['Hair clipper', '3 comb attachments', 'Scissors', 'Cape', 'Comb', 'Cleaning brush', 'USB-C cable', 'Premium pouch']),
    specs: [
      { key: 'battery_runtime_minutes', value: '120', unit: 'min', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_charge_time_hours', value: '1', unit: 'hr', category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'battery_type', value: 'Li-Ion', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_type', value: 'USB-C', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'charging_indicator', value: 'LED', unit: null, category: 'Battery', applicability: 'AVAILABLE' },
      { key: 'blade_material', value: 'Steel (DualCut)', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'self_sharpening_blades', value: 'Yes', unit: null, category: 'Blade', applicability: 'AVAILABLE' },
      { key: 'cutting_lengths', value: '28', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'length_range_mm', value: '0.5–28', unit: 'mm', category: 'General', applicability: 'AVAILABLE' },
      { key: 'cordless_use', value: 'Yes', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'motor_type', value: 'Speed Control', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'washable', value: 'Yes (fully)', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '220', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'travel_lock', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
    ],
  },

  // ── Hair Care ───────────────────────────────────────────────
  {
    familyKey: 'bhd3000',
    model: 'BHD308/30',
    name: 'Philips BHD308/30',
    gender: 'women',
    priceRange: '₹1,495 – ₹1,799',
    description: '3000 Series ThermoProtect Hair Dryer with 1600W. 3 heat and speed settings with cool shot for style setting.',
    image: '/products/bhd308.jpg',
    avgRating: 4.3,
    reviewCount: 16,
    verifiedReviewCount: 5,
    warranty: '2 years',
    highlights: JSON.stringify(['ThermoProtect', '1600W', 'Cool Shot']),
    boxContents: JSON.stringify(['Hair dryer', 'Concentrator nozzle (14mm)']),
    specs: [
      { key: 'wattage', value: '1600', unit: 'W', category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'heat_settings', value: '3', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'speed_settings', value: '3', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'cool_shot', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'thermo_protect', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'ionic_conditioning', value: null, unit: null, category: 'Performance', applicability: 'NOT_APPLICABLE' },
      { key: 'concentrator_nozzle', value: 'Yes (14 mm)', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'diffuser', value: null, unit: null, category: 'General', applicability: 'NOT_APPLICABLE' },
      { key: 'cord_length_m', value: '1.8', unit: 'm', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'hanging_loop', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '400', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
  {
    familyKey: 'bhs3000',
    model: 'BHS378/10',
    name: 'Philips BHS378/10',
    gender: 'women',
    priceRange: '₹1,895 – ₹2,199',
    description: '3000 Series Hair Straightener with ThermoProtect and keratin-infused ceramic plates. Heats up in 60 seconds.',
    image: '/products/bhs378.jpg',
    avgRating: 4.2,
    reviewCount: 13,
    verifiedReviewCount: 4,
    warranty: '2 years',
    highlights: JSON.stringify(['Keratin Ceramic', 'ThermoProtect', 'Ionic']),
    boxContents: JSON.stringify(['Hair straightener', 'Heat-resistant pouch']),
    specs: [
      { key: 'plate_material', value: 'Keratin Ceramic', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'plate_width_mm', value: '28', unit: 'mm', category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'max_temperature_c', value: '230', unit: '°C', category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'heat_settings', value: '6', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'heat_up_time_seconds', value: '60', unit: 'sec', category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'thermo_protect', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'ionic_conditioning', value: 'Yes', unit: null, category: 'Performance', applicability: 'AVAILABLE' },
      { key: 'auto_shutoff', value: 'Yes (60 min)', unit: null, category: 'General', applicability: 'AVAILABLE' },
      { key: 'swivel_cord', value: 'Yes', unit: null, category: 'Build', applicability: 'AVAILABLE' },
      { key: 'cord_length_m', value: '1.8', unit: 'm', category: 'Build', applicability: 'AVAILABLE' },
      { key: 'weight_grams', value: '350', unit: 'g', category: 'Build', applicability: 'AVAILABLE' },
    ],
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Clearing existing data...');

  // 1. Clear in FK-safe order
  await prisma.review.deleteMany();
  await prisma.userProduct.deleteMany();
  await prisma.productSerial.deleteMany();
  await prisma.spec.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productFamily.deleteMany();
  await prisma.user.deleteMany();

  console.log('Existing data cleared.');

  // 2. Create families
  const familyMap = {};
  for (const f of families) {
    const created = await prisma.productFamily.create({
      data: {
        name: f.name,
        brand: f.brand,
        category: f.category,
        gender: f.gender,
      },
    });
    familyMap[f.key] = created.id;
  }
  console.log(`Created ${families.length} product families.`);

  // 3. Create products with specs
  let totalSpecs = 0;
  for (const p of products) {
    const familyId = familyMap[p.familyKey];
    if (!familyId) {
      throw new Error(`Family key "${p.familyKey}" not found in familyMap`);
    }

    const created = await prisma.product.create({
      data: {
        name: p.name,
        model: p.model,
        description: p.description,
        image: p.image,
        gender: p.gender,
        priceRange: p.priceRange,
        familyId,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        verifiedReviewCount: p.verifiedReviewCount,
        warranty: p.warranty,
        highlights: p.highlights,
        boxContents: p.boxContents,
        specs: {
          create: p.specs.map((s) => ({
            key: s.key,
            value: s.value,
            unit: s.unit,
            category: s.category,
            applicability: s.applicability,
            source: SOURCE,
            verifiedAt: VERIFIED_AT,
          })),
        },
      },
    });

    totalSpecs += p.specs.length;
    console.log(`  Created product: ${created.name} (${p.specs.length} specs)`);
  }

  // 4. Create users — admin and demo
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@productpulse.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'user@productpulse.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log(`Created users: ${adminUser.email} (ADMIN), ${demoUser.email} (USER)`);

  // 5. Create serial numbers — 2 per product (36 total), bcrypt-hashed
  const allProducts = await prisma.product.findMany({ select: { id: true, model: true } });
  let serialCount = 0;
  for (const prod of allProducts) {
    // Generate two predictable demo serials per product based on model number
    const base = prod.model.replace(/\//g, '').toUpperCase();
    const serial1 = `SN-${base}-001`;
    const serial2 = `SN-${base}-002`;

    for (const serial of [serial1, serial2]) {
      const hashed = await bcrypt.hash(serial, 10);
      await prisma.productSerial.create({
        data: {
          hashedSerial: hashed,
          productId: prod.id,
        },
      });
      serialCount++;
    }
  }
  console.log(`Created ${serialCount} serial numbers (2 per product).`);

  // 6. Create demo reviews — 8 reviews across products with varied ratings, retailers,
  //    anonymity choices, and verification statuses. Some verified via serial claim.
  const productsByModel = {};
  for (const prod of allProducts) {
    productsByModel[prod.model] = prod.id;
  }

  // Helper: claim a serial for verified reviews
  async function claimSerial(userId, productId) {
    const serial = await prisma.productSerial.findFirst({
      where: { productId, claimed: false },
    });
    if (!serial) return null;

    const userProduct = await prisma.userProduct.create({
      data: { userId, serialId: serial.id, productId },
    });
    await prisma.productSerial.update({
      where: { id: serial.id },
      data: { claimed: true },
    });
    return userProduct.id;
  }

  const reviewsData = [
    {
      productModel: 'BT3211/15', user: demoUser, isAnonymous: false, isVerified: true,
      overallRating: 5, batteryRating: 5, buildRating: 4, easeOfUseRating: 5, performanceRating: 5, valueRating: 4,
      positiveText: 'Excellent battery life and very comfortable to use. The DuraPower technology really makes a difference — I charge it once a week.',
      negativeText: 'Wish it came with a travel pouch.',
      purchaseDate: new Date('2024-08-15'), retailer: 'Amazon India',
    },
    {
      productModel: 'BT3211/15', user: adminUser, isAnonymous: true, isVerified: false,
      overallRating: 3, batteryRating: 3, buildRating: 3, easeOfUseRating: 4, performanceRating: 3, valueRating: 3,
      positiveText: 'Does the job for basic trimming.',
      negativeText: 'Not great for very thick beards. Struggled to cut evenly on longer settings.',
      purchaseDate: null, retailer: 'Flipkart',
    },
    {
      productModel: 'MG7745/15', user: demoUser, isAnonymous: false, isVerified: true,
      overallRating: 5, batteryRating: 4, buildRating: 5, easeOfUseRating: 5, performanceRating: 5, valueRating: 5,
      positiveText: 'The 18-in-1 kit is incredible. I use the nose trimmer, beard trimmer, and body groomer every week. All in one device.',
      negativeText: 'Charging takes 5 hours — that is a LOT. Only real downside.',
      purchaseDate: new Date('2024-06-10'), retailer: 'Amazon India',
    },
    {
      productModel: 'BT5515/15', user: adminUser, isAnonymous: false, isVerified: true,
      overallRating: 5, batteryRating: 5, buildRating: 5, easeOfUseRating: 5, performanceRating: 5, valueRating: 4,
      positiveText: 'The Lift & Trim really works — much neater results compared to the 3000 series. 90 min runtime is plenty.',
      negativeText: 'Pricier than the 3000 series, but you can feel the quality difference.',
      purchaseDate: new Date('2024-10-05'), retailer: 'Official Brand Store',
    },
    {
      productModel: 'BT9810/15', user: demoUser, isAnonymous: false, isVerified: true,
      overallRating: 5, batteryRating: 5, buildRating: 5, easeOfUseRating: 4, performanceRating: 5, valueRating: 3,
      positiveText: 'Premium build quality. The metal body feels substantial. Best trimmer I have ever used — precise, powerful, and silent.',
      negativeText: 'Very expensive. Hard to justify unless grooming is important to you.',
      purchaseDate: new Date('2024-08-01'), retailer: 'Amazon India',
    },
    {
      productModel: 'BG5020/15', user: adminUser, isAnonymous: true, isVerified: false,
      overallRating: 4, batteryRating: 3, buildRating: 4, easeOfUseRating: 5, performanceRating: 4, valueRating: 4,
      positiveText: 'Works great in the shower. The rounded tips really do prevent nicks — I have sensitive skin and this is the first body groomer I trust.',
      negativeText: 'Battery could be better. 70 minutes is okay but I wish it were 90+.',
      purchaseDate: null, retailer: 'Flipkart',
    },
    {
      productModel: 'S5588/20', user: demoUser, isAnonymous: false, isVerified: true,
      overallRating: 4, batteryRating: 5, buildRating: 4, easeOfUseRating: 4, performanceRating: 4, valueRating: 3,
      positiveText: 'SkinIQ is impressive — it adapts to my beard density. Very close shave without irritation.',
      negativeText: 'Expensive for a shaver. The pop-up trimmer could be sharper.',
      purchaseDate: new Date('2024-09-10'), retailer: 'Croma',
    },
    {
      productModel: 'BHD308/30', user: adminUser, isAnonymous: false, isVerified: true,
      overallRating: 4, batteryRating: null, buildRating: 4, easeOfUseRating: 5, performanceRating: 4, valueRating: 5,
      positiveText: 'Perfect everyday dryer. ThermoProtect keeps heat gentle — my hair feels healthier.',
      negativeText: 'No ionic. My hair gets a bit frizzy compared to pricier models.',
      purchaseDate: new Date('2024-07-15'), retailer: 'Amazon India',
    },
  ];

  let reviewCount = 0;
  for (const r of reviewsData) {
    const productId = productsByModel[r.productModel];
    if (!productId) {
      console.warn(`  Skipping review: product ${r.productModel} not found`);
      continue;
    }

    let userProductId = null;
    if (r.isVerified) {
      userProductId = await claimSerial(r.user.id, productId);
    }

    await prisma.review.create({
      data: {
        productId,
        userId: r.user.id,
        userProductId,
        isAnonymous: r.isAnonymous,
        overallRating: r.overallRating,
        batteryRating: r.batteryRating,
        buildRating: r.buildRating,
        easeOfUseRating: r.easeOfUseRating,
        performanceRating: r.performanceRating,
        valueRating: r.valueRating,
        positiveText: r.positiveText,
        negativeText: r.negativeText,
        purchaseDate: r.purchaseDate,
        retailer: r.retailer,
        isVerified: r.isVerified && userProductId != null,
      },
    });
    reviewCount++;
  }
  console.log(`Created ${reviewCount} demo reviews.`);

  // 7. Update denormalized rating summaries on reviewed products
  const reviewedProductIds = [...new Set(reviewsData.map(r => productsByModel[r.productModel]).filter(Boolean))];
  for (const pid of reviewedProductIds) {
    const reviews = await prisma.review.findMany({ where: { productId: pid } });
    const avg = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;
    const verified = reviews.filter(r => r.isVerified).length;
    await prisma.product.update({
      where: { id: pid },
      data: {
        avgRating: Math.round(avg * 10) / 10,
        reviewCount: reviews.length,
        verifiedReviewCount: verified,
      },
    });
  }
  console.log(`Updated rating summaries for ${reviewedProductIds.length} products.`);

  console.log('');
  console.log(`Seed complete: ${products.length} products with ${totalSpecs} specs across ${families.length} families.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
