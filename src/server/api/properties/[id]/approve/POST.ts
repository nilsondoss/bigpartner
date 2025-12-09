import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { properties, users } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../../../lib/permissions.js';
import { sendEmail } from '../../../../lib/email.js';

/**
 * POST /api/properties/:id/approve
 * Approve a property (admin only)
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
        message: 'Only admins can approve properties' 
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Property ID is required' });
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
        approvalStatus: 'approved',
        isVerified: true,
        approvedBy: user.id,
        approvedAt: new Date(),
        publishedAt: new Date()
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
        // Send approval email to property owner
        try {
          await sendEmail({
            to: owner[0].email,
            subject: '🎉 Your Property Has Been Approved!',
            html: `
              <h2>Great News!</h2>
              <p>Your property listing has been approved and is now live on Big Partner.</p>
              
              <h3>Property Details:</h3>
              <ul>
                <li><strong>Title:</strong> ${property.title}</li>
                <li><strong>Location:</strong> ${property.city}, ${property.state}</li>
                <li><strong>Price:</strong> ₹${property.price}</li>
              </ul>
              
              <p>Your property is now visible to potential buyers and investors.</p>
              
              <p><a href="${process.env.VITE_PREVIEW_URL || 'https://bigpartner.com'}/property-detail/${property.slug}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Your Property</a></p>
              
              <p>Thank you for listing with Big Partner!</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError);
          // Don't fail the request if email fails
        }
      }
    }

    res.json({ 
      success: true, 
      message: 'Property approved successfully',
      property: {
        id: parseInt(id),
        approvalStatus: 'approved',
        isVerified: true
      }
    });
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({
      error: 'Failed to approve property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
