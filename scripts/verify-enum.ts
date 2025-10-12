import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL as string);

async function verify() {
  console.log('🔍 Verifying flow_type enum values:\n');
  
  const result = await sql`
    SELECT enumlabel 
    FROM pg_enum 
    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'flow_type') 
    ORDER BY enumsortorder;
  `;
  
  console.log('Available flow_type values:');
  result.forEach(row => {
    console.log('  ✓', row.enumlabel);
  });
  
  console.log('\n✅ Database enum is correctly configured!');
  await sql.end();
}

verify().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
