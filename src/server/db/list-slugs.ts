import { db } from './client.js';
import { properties } from './schema.js';

async function listSlugs() {
  try {
    const props = await db.select({ 
      slug: properties.slug, 
      type: properties.propertyType 
    }).from(properties);
    
    console.log(JSON.stringify(props, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listSlugs();
