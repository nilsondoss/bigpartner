import { db } from './client.js';
import { sql } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

async function runMigration(filePath: string) {
  try {
    console.log(`🔄 Running migration: ${filePath}...`);
    
    // Read the SQL file
    const sqlContent = await fs.readFile(filePath, 'utf-8');
    
    // Split by statement-breakpoint and filter out empty statements
    const statements = sqlContent
      .split('--> statement-breakpoint')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Statement ${i}: ${statement.substring(0, 80)}...`);
      console.log(`Executing: ${statement.substring(0, 60)}...`);
      
      try {
        await db.execute(sql.raw(statement));
        console.log(`✅ Statement ${i} executed successfully`);
      } catch (error: any) {
        console.error(`❌ Failed to execute statement ${i}:`, error.message);
        throw error;
      }
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('❌ Please provide a migration file path');
  process.exit(1);
}

const fullPath = path.resolve(process.cwd(), migrationFile);
runMigration(fullPath).then(() => process.exit(0));
