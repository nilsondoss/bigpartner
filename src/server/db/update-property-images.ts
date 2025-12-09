import { db } from './client.js';
import { properties } from './schema.js';
import { eq } from 'drizzle-orm';

/**
 * Update property images with unique, category-specific Unsplash images
 * 
 * This script assigns professional, relevant images to each property based on its type.
 * Each property gets a unique image URL to ensure visual variety.
 */

// Category-specific image collections from Unsplash
const imagesByCategory: Record<string, string[]> = {
  residential: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Modern house
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // Luxury home
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', // Contemporary house
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', // Villa
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', // Suburban home
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', // Family house
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Office building
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', // Modern office
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', // Corporate building
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', // Business center
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80', // Retail space
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', // Shopping center
  ],
  industrial: [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', // Warehouse
    'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?w=800&q=80', // Factory
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80', // Industrial facility
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80', // Manufacturing
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=80', // Distribution center
    'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&q=80', // Logistics hub
  ],
  farmland: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', // Agricultural land
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', // Farm field
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80', // Countryside
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80', // Rural property
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', // Farmhouse
    'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800&q=80', // Vineyard
  ],
  rental: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', // Apartment interior
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', // Modern apartment
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', // Rental unit
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', // Condo
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', // Studio apartment
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // Townhouse
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80', // Lakefront condo
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80', // Family rental
  ],
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', // Modern apartment
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', // Luxury apartment
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', // City apartment
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80', // Downtown condo
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', // Studio
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // Penthouse
  ],
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', // Luxury villa
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Estate home
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // Waterfront villa
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', // Mediterranean villa
  ],
};

// Fallback images for unknown categories
const fallbackImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
];

async function updatePropertyImages() {
  try {
    console.log('🔄 Starting property image update...\n');

    // Fetch all properties
    const allProperties = await db.select().from(properties);
    console.log(`📊 Found ${allProperties.length} properties\n`);

    // Track image usage to ensure uniqueness
    const usedImages = new Set<string>();
    const imageIndexByCategory: Record<string, number> = {};

    // Group properties by type
    const propertiesByType: Record<string, typeof allProperties> = {};
    for (const property of allProperties) {
      const type = (property.propertyType || 'residential').toLowerCase();
      if (!propertiesByType[type]) {
        propertiesByType[type] = [];
      }
      propertiesByType[type].push(property);
    }

    // Update each property with a unique image
    for (const [type, typeProperties] of Object.entries(propertiesByType)) {
      console.log(`📁 Updating ${type} properties (${typeProperties.length} total):`);
      
      const categoryImages = imagesByCategory[type] || fallbackImages;
      
      for (let i = 0; i < typeProperties.length; i++) {
        const property = typeProperties[i];
        
        // Get next available image for this category
        const imageIndex = i % categoryImages.length;
        let imageUrl = categoryImages[imageIndex];
        
        // If image already used, add a unique parameter
        if (usedImages.has(imageUrl)) {
          imageUrl = `${imageUrl}&v=${Date.now()}-${i}`;
        }
        usedImages.add(imageUrl);

        // Update the property
        await db
          .update(properties)
          .set({ featuredImage: imageUrl })
          .where(eq(properties.id, property.id));

        console.log(`  ✅ ${property.title}: ${imageUrl}`);
      }
      console.log('');
    }

    console.log('✅ All property images updated successfully!');
    console.log(`📊 Total properties updated: ${allProperties.length}`);
    console.log(`🎨 Unique images assigned: ${usedImages.size}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating property images:', error);
    process.exit(1);
  }
}

updatePropertyImages();
