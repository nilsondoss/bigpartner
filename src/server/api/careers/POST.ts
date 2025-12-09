import type { Request, Response } from 'express';
import { sendCareerApplicationEmail } from '../../lib/email.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { name, email, phone, position, message, resumeUrl } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and phone are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Send email notification
    await sendCareerApplicationEmail({
      name,
      email,
      phone,
      position: position || 'General Application',
      message: message || 'No additional message provided',
      resumeUrl: resumeUrl || 'No resume attached',
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Career application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit application',
      message: String(error),
    });
  }
}
