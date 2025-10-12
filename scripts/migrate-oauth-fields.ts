import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!);

async function migrate() {
  console.log('Starting OAuth migration...');
  
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
    const result = await sql`
      UPDATE users 
      SET email = username || '@legacy.local' 
      WHERE email IS NULL
      RETURNING id, username, email
    `;
    console.log(`Updated ${result.length} existing users with placeholder emails`);
    
    // Step 4: Add NOT NULL constraint on email
    console.log('Step 4: Adding NOT NULL constraint on email...');
    await sql`ALTER TABLE users ALTER COLUMN email SET NOT NULL`;
    
    // Step 5: Add unique constraints (using DROP IF EXISTS first to be idempotent)
    console.log('Step 5: Adding unique constraints...');
    await sql`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique`;
    await sql`ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email)`;
    
    await sql`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_google_id_unique`;
    await sql`ALTER TABLE users ADD CONSTRAINT users_google_id_unique UNIQUE (google_id)`;
    
    console.log('✓ Migration completed successfully!');
    console.log('\nNote: Existing users have been assigned placeholder emails (username@legacy.local)');
    console.log('They will need to update their email addresses or link Google accounts.');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate().catch(console.error);
