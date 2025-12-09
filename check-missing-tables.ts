import { db } from './src/server/db/client.js';
import { sql } from 'drizzle-orm';

async function checkTables() {
  const tables = ['partners', 'favorites', 'inquiries'];
  
  for (const table of tables) {
    try {
      await db.execute(sql.raw(`SELECT 1 FROM ${table} LIMIT 1`));
      console.log(`✅ ${table} exists`);
    } catch (e) {
      console.log(`❌ ${table} MISSING`);
    }
  }
  
  process.exit(0);
}

checkTables();
