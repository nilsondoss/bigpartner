import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { properties } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../lib/permissions.js';
import { sendEmail } from '../../lib/email.js';

/**
 * POST /api/properties
 * Create a new property listing
 * 
 * Request Body: Property data matching the schema
 */
export default async function handler(req: Request, res: Response) {
  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return; // requireAuth already sent error response

    const propertyData = req.body;

    // Validate required fields
    const requiredFields = [
      'title',
      'slug',
      'description',
      'propertyType',
      'addressLine1',
      'city',
      'state',
      'pincode',
      'price',
    ];

    const missingFields = requiredFields.filter((field) => !propertyData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields,
      });
    }

    // Check if slug already exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, propertyData.slug))
      .limit(1);

    if (existingProperty.length > 0) {
      return res.status(409).json({
        error: 'Property with this slug already exists',
      });
    }

    // Convert JSON fields to strings if they're objects/arrays
    if (propertyData.amenities && typeof propertyData.amenities === 'object') {
      propertyData.amenities = JSON.stringify(propertyData.amenities);
    }

    if (propertyData.images && typeof propertyData.images === 'object') {
      propertyData.images = JSON.stringify(propertyData.images);
    }

    if (propertyData.keywords && typeof propertyData.keywords === 'object') {
      propertyData.keywords = JSON.stringify(propertyData.keywords);
    }

    // Set default values for new property management fields
    // TODO: Re-enable after migration
    // propertyData.createdBy = user.id;
    // propertyData.approvalStatus = 'pending';
    // propertyData.viewCount = 0;
    // propertyData.deleted = false;
    propertyData.isVerified = false;

    // Insert property
    const result = await db.insert(properties).values(propertyData);

    // Fetch the newly created property (MySQL doesn't support .returning())
    const insertId = Number(result[0].insertId);
    const newProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, insertId))
      .limit(1);

    const createdProperty = newProperty[0];

    // Send email notifications
    try {
      // 1. Send confirmation email to user
      await sendEmail({
        to: user.email,
        subject: 'Property Submitted for Review',
        html: `
          <h2>Thank You for Submitting Your Property!</h2>
          <p>Your property listing has been received and is pending admin approval.</p>
          
          <h3>Property Details:</h3>
          <ul>
            <li><strong>Title:</strong> ${propertyData.title}</li>
            <li><strong>Location:</strong> ${propertyData.city}, ${propertyData.state}</li>
            <li><strong>Price:</strong> ₹${propertyData.price}</li>
          </ul>
          
          <p>We'll review your listing and notify you once it's approved.</p>
          <p>This usually takes 24-48 hours.</p>
          
          <p><a href="${process.env.VITE_PREVIEW_URL || 'https://bigpartner.com'}/my-properties" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View My Properties</a></p>
        `,
      });

      // 2. Send notification email to admin
      await sendEmail({
        to: 'admin@bigpartner.com',
        subject: '🆕 New Property Submitted for Approval',
        html: `
          <h2>New Property Listing Submitted</h2>
          <p>A new property has been submitted and requires your approval.</p>
          
          <h3>Property Details:</h3>
          <ul>
            <li><strong>Title:</strong> ${propertyData.title}</li>
            <li><strong>Location:</strong> ${propertyData.city}, ${propertyData.state}</li>
            <li><strong>Price:</strong> ₹${propertyData.price}</li>
            <li><strong>Type:</strong> ${propertyData.propertyType}</li>
            <li><strong>Submitted by:</strong> ${user.name || user.email}</li>
          </ul>
          
          <p><a href="${process.env.VITE_PREVIEW_URL || 'https://bigpartner.com'}/admin/property-approval" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Review Property</a></p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(createdProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      error: 'Failed to create property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
