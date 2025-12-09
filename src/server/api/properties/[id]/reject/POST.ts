import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { properties, users } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../../../lib/permissions.js';
import { sendEmail } from '../../../../lib/email.js';

/**
 * POST /api/properties/:id/reject
 * Reject a property (admin only)
 */
export default async function handler(req: Request, res: Response) {
  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return;

    // Check if user is admin
    const isAdmin = user.email === 'admin@bigpartner.com';
    if (!isAdmin) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Only admins can reject properties' 
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = existingProperty[0];

    // Update property status
    await db
      .update(properties)
      .set({ 
        approvalStatus: 'rejected',
        isVerified: false,
        rejectionReason: reason,
        approvedBy: user.id,
        approvedAt: new Date()
      })
      .where(eq(properties.id, parseInt(id)));

    // Get property owner details for email notification
    if (property.createdBy) {
      const owner = await db
        .select()
        .from(users)
        .where(eq(users.id, property.createdBy))
        .limit(1);

      if (owner.length > 0 && owner[0].email) {
        // Send rejection email to property owner
        try {
          await sendEmail({
            to: owner[0].email,
            subject: 'Property Listing Update - Action Required',
            html: `
              <h2>Property Listing Update</h2>
              <p>We've reviewed your property listing and it requires some updates before it can be published.</p>
              
              <h3>Property Details:</h3>
              <ul>
                <li><strong>Title:</strong> ${property.title}</li>
                <li><strong>Location:</strong> ${property.city}, ${property.state}</li>
              </ul>
              
              <h3>Reason for Update Request:</h3>
              <p style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 12px; margin: 16px 0;">${reason}</p>
              
              <p>Please update your listing and resubmit for review.</p>
              
              <p><a href="${process.env.VITE_PREVIEW_URL || 'https://bigpartner.com'}/my-properties" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Edit Property</a></p>
              
              <p>If you have any questions, please contact our support team.</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send rejection email:', emailError);
          // Don't fail the request if email fails
        }
      }
    }

    res.json({ 
      success: true, 
      message: 'Property rejected successfully',
      property: {
        id: parseInt(id),
        approvalStatus: 'rejected',
        rejectionReason: reason
      }
    });
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({
      error: 'Failed to reject property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
