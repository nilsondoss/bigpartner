import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export default async function handler(req: Request, res: Response) {
  try {
    // Check if user is authenticated
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email, currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Get current user
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email !== currentUser.email) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
    };

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    // Update user
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    // Fetch updated user
    const [updatedUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
