import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export default async function handler(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    // Validate inputs
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Reset token is required' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Find user with valid reset token
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.resetPasswordToken, token),
          gt(users.resetPasswordExpires, new Date())
        )
      )
      .limit(1);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    await db
      .update(users)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where(eq(users.id, user.id));

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
}
