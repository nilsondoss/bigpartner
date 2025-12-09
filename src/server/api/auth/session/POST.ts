import type { Request, Response } from 'express';
import { getUserBySession } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({
        authenticated: false,
        user: null,
      });
    }

    const user = await getUserBySession(sessionId);

    if (!user) {
      res.clearCookie('sessionId');
      return res.status(401).json({
        authenticated: false,
        user: null,
      });
    }

    // Return user data (without password hash)
    const { passwordHash, ...userData } = user;

    res.status(200).json({
      authenticated: true,
      user: userData,
    });
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({
      error: 'Session check failed',
      message: 'An error occurred while checking session',
    });
  }
}
