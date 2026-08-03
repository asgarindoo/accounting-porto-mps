import { db } from './db/index.js';
import { sql } from 'drizzle-orm';

async function drop() {
  console.log('Dropping tables...');
  try {
    await db.execute(sql`DROP TABLE IF EXISTS "site_content" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "profiles" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "profile_headlines" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "profile_bios" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "profile_stats" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "floating_badges" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "educations" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "soft_skills" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "experiences" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "project_tags" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "projects" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "achievements" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "skills" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "resume_sections" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "contacts" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "nav_links" CASCADE;`);
    console.log('Dropped all tables');
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
drop();
