import type { Request, Response} from 'express';
import { db } from '../../db/client.js';
import { favorites, properties } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../../lib/permissions.js';

/**
 * POST /api/favorites
 * Add a property to user's favorites
 * Body: { propertyId: number }
 */
export default async function handler(req: Request, res: Response) {
  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return;

    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    // Check if property exists
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if already favorited
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, user.id),
          eq(favorites.propertyId, propertyId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ 
        error: 'Property already in favorites',
        favoriteId: existing[0].id
      });
    }

    // Add to favorites
    const result = await db.insert(favorites).values({
      userId: user.id,
      propertyId: propertyId
    });

    const insertId = Number(result[0].insertId);
    const newFavorite = await db
      .select()
      .from(favorites)
      .where(eq(favorites.id, insertId))
      .limit(1);

    res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      favorite: newFavorite[0]
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      error: 'Failed to add favorite',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
