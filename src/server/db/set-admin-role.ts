import { db } from './client.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';

async function setAdminRole() {
  try {
    console.log('🔧 Setting admin role for first user...');

    // Get the first user
    const allUsers = await db.select().from(users).limit(1);

    if (allUsers.length === 0) {
      console.log('❌ No users found in database');
      process.exit(1);
    }

    const firstUser = allUsers[0];
    console.log(`📧 Found user: ${firstUser.email}`);

    // Update the user's role to admin
    await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.id, firstUser.id));

    console.log(`✅ Successfully set ${firstUser.email} as admin!`);
    console.log('🎉 You can now login and see the "Add Property" button');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin role:', error);
    process.exit(1);
  }
}

setAdminRole();
