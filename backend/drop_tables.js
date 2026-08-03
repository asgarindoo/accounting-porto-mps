import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function run() {
  try {
    await db.execute(sql`DROP TABLE IF EXISTS project_tags CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS projects CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS achievements CASCADE;`);
    console.log('Tables dropped successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
