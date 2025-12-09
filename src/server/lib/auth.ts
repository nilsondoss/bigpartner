import { db } from '../db/client.js';
import { users, sessions } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Generate a secure random session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a new session for a user
 * @param userId - User ID
 * @param userType - Type of user ('user', 'investor', 'partner')
 * @returns Session ID
 */
export async function createSession(userId: number, userType: 'user' | 'investor' | 'partner'): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    userType,
    expiresAt,
  });

  return sessionId;
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (new Date() > new Date(session.expiresAt)) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return session;
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

/**
 * Get user by session ID
 */
export async function getUserBySession(sessionId: string) {
  const session = await getSession(sessionId);
  if (!session) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return user || null;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * At least 8 characters
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}
