import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function migrate() {
  console.log('Executing OAuth migration...');
  
  try {
    // Step 1: Add new columns as nullable first
    console.log('Step 1: Adding new columns...');
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
    
    // Step 2: Make password nullable
    console.log('Step 2: Making password nullable...');
    await sql`ALTER TABLE users ALTER COLUMN password DROP NOT NULL`;
    
    // Step 3: Add placeholder emails for existing users
    console.log('Step 3: Adding placeholder emails for existing users...');
    await sql`UPDATE users SET email = username || '@legacy.local' WHERE email IS NULL`;
    
    // Step 4: Add NOT NULL constraint on email
    console.log('Step 4: Adding NOT NULL constraint on email...');
    await sql`ALTER TABLE users ALTER COLUMN email SET NOT NULL`;
    
    // Step 5: Add unique constraints
    console.log('Step 5: Adding unique constraints...');
    await sql`ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email)`;
    await sql`ALTER TABLE users ADD CONSTRAINT users_google_id_unique UNIQUE (google_id)`;
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate();
