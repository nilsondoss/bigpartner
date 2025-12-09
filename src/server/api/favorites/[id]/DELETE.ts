import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { favorites } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../../../lib/permissions.js';

/**
 * DELETE /api/favorites/:id
 * Remove a property from user's favorites
 * Can use either favorite ID or property ID
 */
export default async function handler(req: Request, res: Response) {
  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.params;
    const { propertyId } = req.query;

    if (!id && !propertyId) {
      return res.status(400).json({ error: 'Favorite ID or Property ID is required' });
    }

    let deleteCondition;
    
    if (propertyId) {
      // Delete by property ID
      deleteCondition = and(
        eq(favorites.userId, user.id),
        eq(favorites.propertyId, parseInt(propertyId as string))
      );
    } else {
      // Delete by favorite ID (must be owned by user)
      deleteCondition = and(
        eq(favorites.userId, user.id),
        eq(favorites.id, parseInt(id))
      );
    }

    // Check if favorite exists
    const existing = await db
      .select()
      .from(favorites)
      .where(deleteCondition)
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    // Delete favorite
    await db.delete(favorites).where(deleteCondition);

    res.json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      error: 'Failed to remove favorite',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
