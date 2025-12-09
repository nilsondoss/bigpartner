import { db } from './client.js';
import { properties } from './schema.js';
import { eq, sql } from 'drizzle-orm';

async function updatePropertyTypes() {
  try {
    console.log('🔍 Checking current property types...\n');
    
    // Get distinct property types
    const result = await db.execute(sql`SELECT DISTINCT property_type FROM properties`);
    console.log('Current property types:', result);
    
    console.log('\n🔄 Updating property types to lowercase...\n');
    
    // Update property types to lowercase
    const typeMapping: Record<string, string> = {
      'Residential': 'residential',
      'Commercial': 'commercial',
      'Industrial': 'industrial',
      'Agricultural': 'farmland',
      'Rental': 'rental',
      'Apartment': 'residential',
      'Villa': 'residential',
      'Plot': 'residential',
      'Farmhouse': 'farmland',
    };
    
    for (const [oldType, newType] of Object.entries(typeMapping)) {
      const updated = await db.execute(
        sql`UPDATE properties SET property_type = ${newType} WHERE property_type = ${oldType}`
      );
      console.log(`✅ Updated ${oldType} → ${newType}`);
    }
    
    console.log('\n✅ Property types updated successfully!');
    
    // Verify
    const verifyResult = await db.execute(sql`SELECT DISTINCT property_type FROM properties`);
    console.log('\n📊 New property types:', verifyResult);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating property types:', error);
    process.exit(1);
  }
}

updatePropertyTypes();
