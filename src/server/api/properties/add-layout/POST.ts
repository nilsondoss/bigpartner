import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';

export default async function handler(req: Request, res: Response) {
  try {
    console.log('🌱 Adding layout property via API...');
    
    const property = {
      // Basic Information
      title: 'Land for Layout – 15 km from Chennai',
      slug: 'land-for-layout-15-km-chennai-' + Date.now(),
      description: `Looking for 10 acres of Punjai or dry land suitable for layout purposes within a 15 km radius of Chennai. Interested sellers, please contact with details and price.

KEY HIGHLIGHTS:
• Requirement: 10 acres of Punjai or dry land
• Purpose: Layout development
• Location: Within 15 km radius of Chennai
• Flexible land facing
• Price: Negotiable with the seller
• Immediate requirement for serious sellers

SPECIFICATIONS:
• Plot Area: 10 acres (approx. 435,600 sq.ft)
• Facing: Any
• Boundary Wall: Optional
• Road Width: Negotiable
• Zoning: Suitable for layout development
• Floor Space Index (FSI): As per local regulations
• Ownership: Clear and marketable title required
• Possession: Immediate / As per agreement

AMENITIES:
• Easy accessibility from main roads and Chennai city
• Close to public utilities (water, electricity)
• Suitable for residential layout development
• Ample open space for planning roads and plots
• Clear legal title
• Surrounded by developing residential/commercial areas

LOCATION & NEARBY FACILITIES:
• Located within a 15 km radius from Chennai
• Well-connected via main roads and highways
• Proximity to schools, hospitals, and markets
• Nearby public transport facilities
• Close to upcoming residential and commercial developments
• Surrounded by essential amenities

AVAILABLE DOCUMENTS:
• Title Deed
• Property Tax Receipt
• Survey Plan
• Approved Building Plan
• Encumbrance Certificate
• Patta / Chitta (if applicable)
• Any other relevant documents as per seller`,
      
      propertyType: 'farmland',
      status: 'available',
      
      // Location
      addressLine1: 'Within 15 km radius from Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      locality: 'Chennai Outskirts',
      
      // Pricing
      price: 0, // To be discussed with Channel Partners
      currency: 'INR',
      negotiable: true,
      
      // Property Details
      plotArea: 435600, // 10 acres in sqft
      areaUnit: 'sqft',
      
      // Amenities
      amenities: JSON.stringify([
        'road_access',
        'electricity',
        'water_supply',
        'clear_title',
        'open_space',
        'developing_area'
      ]),
      
      // SEO
      metaTitle: 'Land for Layout – 15 km from Chennai | 10 Acres Punjai Land',
      metaDescription: 'Looking for 10 acres of Punjai or dry land suitable for layout purposes within a 15 km radius of Chennai. Price negotiable with seller.',
      keywords: JSON.stringify([
        'land for sale chennai',
        'punjai land chennai',
        'layout land chennai',
        '10 acres land',
        'farmland chennai',
        'dry land chennai'
      ]),
      
      isFeatured: true,
      isVerified: true,
      
      // Timestamps
      publishedAt: new Date(),
    };
    
    const result = await db.insert(properties).values(property);
    
    const propertyId = result[0].insertId;
    
    console.log('✅ Property added successfully!');
    console.log(`Property ID: ${propertyId}`);
    
    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      propertyId: propertyId,
      property: {
        id: propertyId,
        title: property.title,
        type: property.propertyType,
        area: property.plotArea,
        location: property.city,
        status: property.status
      }
    });
  } catch (error) {
    console.error('❌ Error adding property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add property',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
