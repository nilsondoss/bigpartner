import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { partners } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail, getPartnerVerificationEmail } from '../../../lib/email.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Partner ID is required'
      });
    }

    if (!verificationStatus) {
      return res.status(400).json({
        success: false,
        error: 'Verification status is required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'verified', 'rejected'];
    if (!validStatuses.includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification status. Must be: pending, verified, or rejected'
      });
    }

    // Fetch partner before update to get email and name
    const existing = await db
      .select()
      .from(partners)
      .where(eq(partners.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Partner not found'
      });
    }

    const partner = existing[0];

    // Update the partner
    await db
      .update(partners)
      .set({ 
        verificationStatus,
        updatedAt: new Date()
      })
      .where(eq(partners.id, parseInt(id)));

    // Send email notification if status is verified or rejected
    if (verificationStatus === 'verified' || verificationStatus === 'rejected') {
      const { subject, html } = getPartnerVerificationEmail(
        partner.companyName,
        partner.contactPersonName,
        verificationStatus as 'verified' | 'rejected'
      );
      
      await sendEmail({
        to: partner.email,
        subject,
        html,
      });
    }

    // Fetch the updated partner
    const updated = await db
      .select()
      .from(partners)
      .where(eq(partners.id, parseInt(id)))
      .limit(1);

    res.json({
      success: true,
      data: updated[0],
      message: 'Partner verification status updated and notification sent'
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update partner',
      message: String(error)
    });
  }
}
