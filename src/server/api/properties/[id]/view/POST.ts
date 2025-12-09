import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { properties } from '../../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

/**
 * POST /api/properties/:id/view
 * Increment view count for a property
 * No authentication required (public endpoint)
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    // Check if property exists
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (property.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    await db
      .update(properties)
      .set({ 
        viewCount: sql`${properties.viewCount} + 1`
      })
      .where(eq(properties.id, parseInt(id)));

    // Get updated view count
    const updated = await db
      .select({ viewCount: properties.viewCount })
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    res.json({
      success: true,
      viewCount: updated[0].viewCount
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({
      error: 'Failed to increment view count',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
