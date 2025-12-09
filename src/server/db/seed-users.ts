import { db } from './client.js';
import { users } from './schema.js';
import bcrypt from 'bcryptjs';

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');

    // Hash passwords
    const userPassword = await bcrypt.hash('user123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Create regular user
    const regularUser = {
      email: 'user@bigpartner.com',
      passwordHash: userPassword,
      fullName: 'John Doe',
      role: 'user',
      isVerified: true,
      createdAt: new Date(),
    };

    // Create admin user
    const adminUser = {
      email: 'admin@bigpartner.com',
      passwordHash: adminPassword,
      fullName: 'Admin User',
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
    };

    // Insert users
    try {
      await db.insert(users).values(regularUser);
      console.log('✅ Regular user created: user@bigpartner.com / user123');
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️  Regular user already exists');
      } else {
        throw error;
      }
    }

    try {
      await db.insert(users).values(adminUser);
      console.log('✅ Admin user created: admin@bigpartner.com / admin123');
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️  Admin user already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ User seeding completed!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Regular User:');
    console.log('  Email: user@bigpartner.com');
    console.log('  Password: user123');
    console.log('');
    console.log('Admin User:');
    console.log('  Email: admin@bigpartner.com');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
