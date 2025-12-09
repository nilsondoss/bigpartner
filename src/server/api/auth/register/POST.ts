import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, createSession, isValidEmail, isValidPassword } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    console.log('📝 Registration attempt:', { body: req.body });
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Full name, email, and password are required',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must be at least 8 characters',
      });
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser) {
      return res.status(409).json({
        error: 'User exists',
        message: 'An account with this email already exists',
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await db.insert(users).values({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
    });

    const userId = Number(result[0].insertId);

    // Fetch the newly created user
    const [newUser] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Create session
    const sessionId = await createSession(userId, 'user');

    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      success: true,
      user: newUser,
      sessionId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration',
    });
  }
}
