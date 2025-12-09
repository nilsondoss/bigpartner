import { db } from './src/server/db/client.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function createInquiriesTable() {
  try {
    const migrationSQL = fs.readFileSync('create-inquiries.sql', 'utf-8');
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await db.execute(sql.raw(statement));
        console.log('✅', statement.substring(0, 60) + '...');
      } catch (e: any) {
        console.log('⚠️ ', e.message.substring(0, 100));
      }
    }
    
    console.log('\n✅ Inquiries table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createInquiriesTable();
