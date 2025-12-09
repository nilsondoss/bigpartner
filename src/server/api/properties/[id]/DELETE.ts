import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../../../lib/permissions.js';

/**
 * DELETE /api/properties/:id
 * Delete a property by ID
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

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check ownership: user can only delete their own properties (unless admin)
    const isAdmin = user.email === 'admin@bigpartner.com';
    const isOwner = existingProperty[0].createdBy === user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You can only delete your own properties' 
      });
    }

    // Check if permanent delete is requested (admin only)
    const permanent = req.query.permanent === 'true';
    
    if (permanent && isAdmin) {
      // Permanent delete (admin only)
      await db.delete(properties).where(eq(properties.id, parseInt(id)));
      return res.json({ 
        success: true, 
        message: 'Property permanently deleted',
        permanent: true,
        id: parseInt(id)
      });
    } else {
      // Soft delete (set deleted flag)
      await db
        .update(properties)
        .set({ 
          deleted: true, 
          deletedAt: new Date() 
        })
        .where(eq(properties.id, parseInt(id)));
      
      return res.json({ 
        success: true, 
        message: 'Property moved to trash',
        permanent: false,
        id: parseInt(id)
      });
    }
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      error: 'Failed to delete property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
