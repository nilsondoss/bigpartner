import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyPassword, createSession, isValidEmail } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
      });
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Update last login time
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Create session
    const sessionId = await createSession(user.id, 'user');

    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Return user data (without password hash)
    const { passwordHash, ...userData } = user;

    res.status(200).json({
      success: true,
      user: userData,
      sessionId,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login',
    });
  }
}
