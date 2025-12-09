import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { inquiries } from '../../db/schema.js';
import { sendInquiryConfirmationEmail, sendInquiryNotificationToAdmin } from '../../lib/email.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { fullName, email, phone, inquiryType, userType, subject, message, propertyId, propertyName } = req.body;

    // Validation
    if (!fullName || !email || !phone || !inquiryType || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Insert inquiry into database
    const result = await db.insert(inquiries).values({
      fullName,
      email,
      phone,
      inquiryType,
      userType: userType || 'other',
      subject,
      message,
      propertyId: propertyId || null,
      propertyName: propertyName || null,
      status: 'pending',
      priority: 'medium',
    });

    const insertId = Number(result[0].insertId);

    // Send confirmation email to user
    try {
      await sendInquiryConfirmationEmail({
        to: email,
        name: fullName,
        inquiryType,
        subject,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification to admin
    try {
      await sendInquiryNotificationToAdmin({
        inquiryId: insertId,
        fullName,
        email,
        phone,
        inquiryType,
        userType: userType || 'other',
        subject,
        message,
        propertyName,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiryId: insertId,
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry', message: String(error) });
  }
}
