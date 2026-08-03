import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  
  console.log('Creating analytics_events table...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    console.log('Successfully created analytics_events table');
  } catch (err) {
    console.error('Failed to create table:', err);
  }
}

run();
