import { db } from './client.js';
import { sql } from 'drizzle-orm';

async function checkTables() {
  try {
    const result = await db.execute(sql`SHOW TABLES`);
    console.log('📋 Existing tables:');
    console.log(result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTables();
