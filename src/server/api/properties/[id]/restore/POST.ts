import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { properties } from '../../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../../../../lib/permissions.js';

/**
 * POST /api/properties/:id/restore
 * Restore a soft-deleted property
 */
export default async function handler(req: Request, res: Response) {
  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    // Check if property exists and is deleted
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = existingProperty[0];

    if (!property.deleted) {
      return res.status(400).json({ 
        error: 'Property is not deleted',
        message: 'This property is already active'
      });
    }

    // Check ownership: user can only restore their own properties (unless admin)
    const isAdmin = user.email === 'admin@bigpartner.com';
    const isOwner = property.createdBy === user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You can only restore your own properties' 
      });
    }

    // Restore property
    await db
      .update(properties)
      .set({ 
        deleted: false, 
        deletedAt: null 
      })
      .where(eq(properties.id, parseInt(id)));

    res.json({
      success: true,
      message: 'Property restored successfully',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Error restoring property:', error);
    res.status(500).json({
      error: 'Failed to restore property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
