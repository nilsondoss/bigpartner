/**
 * Auto-cleanup script for soft-deleted properties
 * Permanently deletes properties that have been in trash for 30+ days
 * 
 * Usage:
 * - Run manually: npm run db:cleanup-trash
 * - Schedule with cron: 0 0 * * * (daily at midnight)
 */

import { db } from './client.js';
import { properties } from './schema.js';
import { and, eq, lt, isNotNull } from 'drizzle-orm';

/**
 * Calculate the date 30 days ago
 */
function getThirtyDaysAgo(): Date {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
}

/**
 * Permanently delete properties that have been soft-deleted for 30+ days
 */
export async function cleanupOldTrash() {
  try {
    const thirtyDaysAgo = getThirtyDaysAgo();
    
    console.log('🗑️  Starting trash cleanup...');
    console.log(`📅 Deleting properties older than: ${thirtyDaysAgo.toISOString()}`);

    // Find properties that are:
    // 1. Soft-deleted (deleted = true)
    // 2. Have a deletedAt timestamp
    // 3. deletedAt is older than 30 days
    const oldProperties = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.deleted, true),
          isNotNull(properties.deletedAt),
          lt(properties.deletedAt, thirtyDaysAgo)
        )
      );

    if (oldProperties.length === 0) {
      console.log('✅ No properties to delete. Trash is clean!');
      return { deleted: 0, properties: [] };
    }

    console.log(`🔍 Found ${oldProperties.length} properties to permanently delete:`);
    oldProperties.forEach((prop) => {
      console.log(`   - ${prop.title} (ID: ${prop.id}, Deleted: ${prop.deletedAt})`);
    });

    // Permanently delete the properties
    const deletedIds: number[] = [];
    for (const prop of oldProperties) {
      await db.delete(properties).where(eq(properties.id, prop.id));
      deletedIds.push(prop.id);
      console.log(`   ✅ Permanently deleted: ${prop.title}`);
    }

    console.log(`🎉 Cleanup complete! Permanently deleted ${deletedIds.length} properties.`);

    return {
      deleted: deletedIds.length,
      properties: oldProperties.map((p) => ({
        id: p.id,
        title: p.title,
        deletedAt: p.deletedAt,
      })),
    };
  } catch (error) {
    console.error('❌ Error during trash cleanup:', error);
    throw error;
  }
}

/**
 * Get statistics about current trash
 */
export async function getTrashStats() {
  try {
    const thirtyDaysAgo = getThirtyDaysAgo();

    // Count all soft-deleted properties
    const allTrash = await db
      .select()
      .from(properties)
      .where(eq(properties.deleted, true));

    // Count properties eligible for permanent deletion
    const eligibleForDeletion = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.deleted, true),
          isNotNull(properties.deletedAt),
          lt(properties.deletedAt, thirtyDaysAgo)
        )
      );

    return {
      totalInTrash: allTrash.length,
      eligibleForDeletion: eligibleForDeletion.length,
      safeFromDeletion: allTrash.length - eligibleForDeletion.length,
    };
  } catch (error) {
    console.error('❌ Error getting trash stats:', error);
    throw error;
  }
}

// Run cleanup if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupOldTrash()
    .then((result) => {
      console.log('\n📊 Cleanup Summary:');
      console.log(`   Total deleted: ${result.deleted}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Cleanup failed:', error);
      process.exit(1);
    });
}
