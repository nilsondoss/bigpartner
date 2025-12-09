import type { Request, Response } from 'express';
import { deleteSession } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    // Clear session cookie
    res.clearCookie('sessionId');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout',
    });
  }
}
