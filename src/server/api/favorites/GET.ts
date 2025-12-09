import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { favorites, properties } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../../lib/permissions.js';

/**
 * GET /api/favorites
 * Get user's favorite properties
 */
export default async function handler(req: Request, res: Response) {
  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return;

    // Get all favorites for this user with property details
    const userFavorites = await db
      .select({
        favoriteId: favorites.id,
        createdAt: favorites.createdAt,
        property: properties
      })
      .from(favorites)
      .leftJoin(properties, eq(favorites.propertyId, properties.id))
      .where(eq(favorites.userId, user.id));

    // Filter out deleted or unapproved properties
    const activeFavorites = userFavorites.filter(
      fav => fav.property && 
      !fav.property.deleted && 
      fav.property.approvalStatus === 'approved'
    );

    res.json({
      success: true,
      count: activeFavorites.length,
      favorites: activeFavorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      error: 'Failed to fetch favorites',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
