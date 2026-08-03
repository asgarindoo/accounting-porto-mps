import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  
  console.log('Altering analytics_events table...');
  try {
    await sql`
      ALTER TABLE analytics_events 
      ADD COLUMN IF NOT EXISTS visitor_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS metadata TEXT;
    `;
    console.log('Successfully added visitor_id and metadata columns');
  } catch (err) {
    console.error('Failed to alter table:', err);
  }
}

run();
