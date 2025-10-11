/**
 * Script to create a test user for SMS testing
 * Run with: node scripts/create-test-user.js +YOUR_PHONE_NUMBER
 */

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const phoneNumber = process.argv[2];

if (!phoneNumber) {
  console.error('Usage: node scripts/create-test-user.js +14074869261');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTestUser() {
  try {
    console.log(`Creating test user with phone number: ${phoneNumber}`);

    const result = await pool.query(
      `INSERT INTO users ("phoneNumber", channel, "isActive")
       VALUES ($1, $2, $3)
       ON CONFLICT ("phoneNumber") DO NOTHING
       RETURNING *`,
      [phoneNumber, 'sms', true]
    );

    if (result.rows.length > 0) {
      console.log('✅ Test user created successfully!');
      console.log('User ID:', result.rows[0].id);
      console.log('Phone Number:', result.rows[0].phoneNumber);
    } else {
      console.log('✅ User already exists with this phone number.');
    }

    console.log('\nYou can now send SMS messages from this number to your Twilio number.');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createTestUser();
