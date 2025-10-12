import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function migrate() {
  console.log('Executing content_type enum migration...');
  console.log('Adding missing enum values: mood_selection, affirmation_view, intention');
  
  try {
    // Add missing values to the content_type enum
    await sql`
      DO $$ 
      BEGIN
          -- Add 'mood_selection'
          IF NOT EXISTS (
              SELECT 1 FROM pg_enum 
              WHERE enumlabel = 'mood_selection' 
              AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_type')
          ) THEN
              ALTER TYPE content_type ADD VALUE 'mood_selection';
          END IF;

          -- Add 'affirmation_view'
          IF NOT EXISTS (
              SELECT 1 FROM pg_enum 
              WHERE enumlabel = 'affirmation_view' 
              AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_type')
          ) THEN
              ALTER TYPE content_type ADD VALUE 'affirmation_view';
          END IF;

          -- Add 'intention'
          IF NOT EXISTS (
              SELECT 1 FROM pg_enum 
              WHERE enumlabel = 'intention' 
              AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_type')
          ) THEN
              ALTER TYPE content_type ADD VALUE 'intention';
          END IF;
      END $$;
    `;
    
    console.log('Migration completed successfully!');
    console.log('The following values are now available in content_type enum:');
    console.log('  - text');
    console.log('  - notification');
    console.log('  - reminder');
    console.log('  - mood_selection (NEW)');
    console.log('  - affirmation_view (NEW)');
    console.log('  - intention (NEW)');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate();
