import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { inquiries } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, priority, responseMessage, respondedBy } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Inquiry ID is required' });
    }

    const inquiryId = parseInt(id, 10);
    if (isNaN(inquiryId)) {
      return res.status(400).json({ error: 'Invalid inquiry ID' });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (responseMessage) {
      updateData.responseMessage = responseMessage;
      updateData.respondedAt = new Date();
      if (respondedBy) updateData.respondedBy = respondedBy;
    }

    // Update inquiry
    await db.update(inquiries).set(updateData).where(eq(inquiries.id, inquiryId));

    // Fetch updated inquiry
    const updatedInquiry = await db.select().from(inquiries).where(eq(inquiries.id, inquiryId)).limit(1);

    if (updatedInquiry.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry: updatedInquiry[0],
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Failed to update inquiry', message: String(error) });
  }
}
