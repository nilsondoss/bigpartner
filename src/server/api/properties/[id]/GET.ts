import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

/**
 * GET /api/properties/:id
 * Fetch a single property by ID or slug and increment view count
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Property ID or slug is required' });
    }

    // Check if id is numeric or a slug
    const isNumericId = /^\d+$/.test(id);
    
    // Fetch property by ID or slug
    const property = await db
      .select()
      .from(properties)
      .where(
        isNumericId
          ? eq(properties.id, parseInt(id))
          : eq(properties.slug, id)
      )
      .limit(1);

    if (property.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const propertyData = property[0];

    // Increment view count
    await db
      .update(properties)
      .set({ viewCount: sql`${properties.viewCount} + 1` })
      .where(eq(properties.id, propertyData.id));

    // Parse JSON fields
    if (propertyData.amenities) {
      try {
        propertyData.amenities = JSON.parse(propertyData.amenities as string) as any;
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    if (propertyData.images) {
      try {
        propertyData.images = JSON.parse(propertyData.images as string) as any;
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    if (propertyData.keywords) {
      try {
        propertyData.keywords = JSON.parse(propertyData.keywords as string) as any;
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    res.json(propertyData);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      error: 'Failed to fetch property',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
