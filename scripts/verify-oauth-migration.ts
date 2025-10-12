import postgres from 'postgres';
import 'dotenv/config';

async function verify() {
  const sql = postgres(process.env.DATABASE_URL!);
  
  try {
    // Query the users table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;

    console.log('Users table structure:');
    console.table(columns);

    // Query constraints
    const constraints = await sql`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'users'
      ORDER BY constraint_name
    `;

    console.log('\nTable constraints:');
    console.table(constraints);

    // Check existing users
    const users = await sql`SELECT id, username, email, google_id, avatar_url FROM users`;
    console.log('\nExisting users:');
    console.table(users);
    
    console.log('\n✓ Verification complete!');
  } finally {
    await sql.end();
  }
}

verify().catch(console.error);
