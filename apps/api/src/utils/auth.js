import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

/**
 * Hash a plaintext password using bcrypt.
 * @param {string} password — plaintext password
 * @returns {Promise<string>} — bcrypt hash
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 * @param {string} password — plaintext password
 * @param {string} hash — bcrypt hash to compare against
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Sign a JWT with the configured secret.
 * @param {{ userId: string, role: string }} payload
 * @returns {string} — signed JWT
 */
export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT.
 * @param {string} token — JWT string
 * @returns {{ userId: string, role: string }} — decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError} on invalid/expired token
 */
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
