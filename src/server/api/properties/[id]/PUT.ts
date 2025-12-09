import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../../lib/permissions.js';

/**
 * PUT /api/properties/:id
 * Update a property by ID
 */
export default async function handler(req: Request, res: Response) {
  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const updateData = req.body;

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

    // Check ownership: user can only edit their own properties (unless admin)
    const isAdmin = user.email === 'admin@bigpartner.com';
    const isOwner = existingProperty[0].createdBy === user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You can only edit your own properties' 
      });
    }

    // Convert JSON fields to strings if they're objects/arrays
    if (updateData.amenities && typeof updateData.amenities === 'object') {
      updateData.amenities = JSON.stringify(updateData.amenities);
    }

    if (updateData.images && typeof updateData.images === 'object') {
      updateData.images = JSON.stringify(updateData.images);
    }

    if (updateData.keywords && typeof updateData.keywords === 'object') {
      updateData.keywords = JSON.stringify(updateData.keywords);
    }

    // Update property
    await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, parseInt(id)));

    // Fetch updated property
    const updatedProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    res.json(updatedProperty[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      error: 'Failed to update property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
