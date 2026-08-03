import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();
const sql = neon(process.env.DATABASE_URL);
sql`DELETE FROM analytics_events WHERE metadata = 'Manual Test Project'`.then(() => console.log('Deleted dummy data')).catch(console.error);
