import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      // If no email provided, set the first user as admin
      const allUsers = await db.select().from(users).limit(1);

      if (allUsers.length === 0) {
        return res.status(404).json({
          error: 'No users found',
          message: 'No users exist in the database',
        });
      }

      const firstUser = allUsers[0];

      // Update the user's role to admin
      await db
        .update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, firstUser.id));

      return res.status(200).json({
        success: true,
        message: `Successfully set ${firstUser.email} as admin`,
        user: {
          id: firstUser.id,
          email: firstUser.email,
          role: 'admin',
        },
      });
    }

    // Find user by email
    const userList = await db.select().from(users).where(eq(users.email, email));

    if (userList.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user found with email: ${email}`,
      });
    }

    const user = userList[0];

    // Update the user's role to admin
    await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.id, user.id));

    res.status(200).json({
      success: true,
      message: `Successfully set ${email} as admin`,
      user: {
        id: user.id,
        email: user.email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Set admin error:', error);
    res.status(500).json({
      error: 'Failed to set admin role',
      message: String(error),
    });
  }
}
