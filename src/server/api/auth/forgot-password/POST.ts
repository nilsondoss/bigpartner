import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../../lib/email.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Update user with reset token
      await db
        .update(users)
        .set({
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry,
        })
        .where(eq(users.id, user.id));

      // Get the preview URL from environment or construct it
      const baseUrl = process.env.VITE_PREVIEW_URL || 'https://bigpartner.in';
      const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

      // Send password reset email
      await sendPasswordResetEmail(email, user.fullName, resetUrl);
    }

    // Always return success message
    res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
}
