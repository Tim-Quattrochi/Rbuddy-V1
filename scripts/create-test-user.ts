/**
 * Script to create a test user for SMS testing
 * Run with: npx tsx scripts/create-test-user.ts +YOUR_PHONE_NUMBER
 */

import { db } from '../server/storage';
import * as schema from '../shared/schema';

const phoneNumber = process.argv[2];

if (!phoneNumber) {
  console.error('Usage: npx tsx scripts/create-test-user.ts +15555551234');
  process.exit(1);
}

async function createTestUser() {
  try {
    console.log(`Creating test user with phone number: ${phoneNumber}`);

    const [user] = await db.insert(schema.users)
      .values({
        phoneNumber,
        channel: 'sms',
        isActive: true,
      })
      .returning();

    console.log('✅ Test user created successfully!');
    console.log('User ID:', user.id);
    console.log('Phone Number:', user.phoneNumber);
    console.log('\nYou can now send SMS messages from this number to your Twilio number.');

    process.exit(0);
  } catch (error: any) {
    if (error.code === '23505') {
      console.log('✅ User already exists with this phone number.');
      process.exit(0);
    }
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
