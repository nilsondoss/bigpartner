import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    console.log('🔄 Updating property types...');

    // Update residential properties (villa -> residential)
    const residentialTitles = [
      'Luxury Estate Home',
      'Modern Family Home',
      'Charming Townhouse',
      'Waterfront Villa',
      'Starter Home'
    ];

    for (const title of residentialTitles) {
      await db.update(properties)
        .set({ propertyType: 'residential' })
        .where(eq(properties.title, title));
      console.log(`✅ Updated: ${title} -> residential`);
    }

    // Update farmland properties (farmhouse -> farmland)
    const farmlandTitles = [
      'Premium Cattle Ranch',
      'Organic Farm Land',
      'Vineyard Estate',
      'Hay Production Farm',
      'Pecan Orchard'
    ];

    for (const title of farmlandTitles) {
      await db.update(properties)
        .set({ propertyType: 'farmland' })
        .where(eq(properties.title, title));
      console.log(`✅ Updated: ${title} -> farmland`);
    }

    // Update rental properties (apartment -> rental)
    const rentalTitles = [
      'Luxury Downtown Apartment',
      'Family Home for Rent',
      'Modern Studio Apartment',
      'Townhouse Rental',
      'Commercial Office Space',
      'Lakefront Condo'
    ];

    for (const title of rentalTitles) {
      await db.update(properties)
        .set({ propertyType: 'rental' })
        .where(eq(properties.title, title));
      console.log(`✅ Updated: ${title} -> rental`);
    }

    res.json({ 
      success: true, 
      message: 'Property types updated successfully',
      updated: {
        residential: residentialTitles.length,
        farmland: farmlandTitles.length,
        rental: rentalTitles.length
      }
    });
  } catch (error) {
    console.error('❌ Error updating property types:', error);
    res.status(500).json({ error: 'Failed to update property types', message: String(error) });
  }
}
