import { db } from './client.js';
import { properties } from './schema.js';

async function checkProperties() {
  try {
    console.log('🔍 Checking properties in database...\n');
    
    // Get total count
    const allProperties = await db.select().from(properties);
    console.log(`✅ Total properties in database: ${allProperties.length}\n`);
    
    if (allProperties.length > 0) {
      console.log('📋 First 3 properties:');
      allProperties.slice(0, 3).forEach((prop, index) => {
        console.log(`\n${index + 1}. ${prop.title}`);
        console.log(`   - ID: ${prop.id}`);
        console.log(`   - Type: ${prop.propertyType}`);
        console.log(`   - Location: ${prop.city}, ${prop.state}`);
        console.log(`   - Price: ${prop.price}`);
        console.log(`   - Featured Image: ${prop.featuredImage ? 'Yes' : 'No'}`);
      });
      
      // Count by type
      console.log('\n📊 Properties by type:');
      const types = ['residential', 'commercial', 'industrial', 'farmland', 'rental'];
      for (const type of types) {
        const count = allProperties.filter(p => p.propertyType === type).length;
        console.log(`   - ${type}: ${count}`);
      }
    } else {
      console.log('⚠️  No properties found in database!');
      console.log('   Run: npm run db:seed to populate the database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking properties:', error);
    process.exit(1);
  }
}

checkProperties();
