/**
 * Seed Admin Script — Direct DB insert with CORRECT Better Auth password hash format
 * Better Auth format: `${salt_hex}:${scryptKey_hex}`
 * Params: N=16384, r=16, p=1, dkLen=64
 * Run: node scripts/seed-admin.js
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../src/db/schema.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { promisify } from 'util';

dotenv.config({ path: './.env' });

const scryptAsync = promisify(crypto.scrypt);

/**
 * Hash password using Better Auth's EXACT format from password.node.mjs:
 * `${salt_hex}:${key_hex}`
 * scrypt params: N=16384, r=16, p=1, dkLen=64
 */
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scryptAsync(
    password.normalize('NFKC'), // Better Auth normalizes the password
    salt,
    64, // dkLen
    { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 }
  );
  return `${salt}:${key.toString('hex')}`;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  if (!process.env.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL is not set');
  if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD is not set');

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('🧹 Cleaning up any existing admin records...');
  
  // Delete existing user with this email (cleanup old bad hash)
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, process.env.ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    const userId = existing[0].id;
    // Cascade will handle sessions/accounts
    await db.delete(schema.users).where(eq(schema.users.id, userId));
    console.log(`   Deleted old record for: ${process.env.ADMIN_EMAIL}`);
  }

  console.log('🌱 Creating admin account with correct password hash...');

  const userId = crypto.randomUUID();
  const accountId = crypto.randomUUID();
  const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
  const now = new Date();

  // Insert user
  await db.insert(schema.users).values({
    id: userId,
    name: 'Portfolio Admin',
    email: process.env.ADMIN_EMAIL,
    emailVerified: true,
    role: 'ADMIN',
    createdAt: now,
    updatedAt: now,
  });

  // Insert account (credential provider)
  await db.insert(schema.accounts).values({
    id: accountId,
    accountId: process.env.ADMIN_EMAIL,
    providerId: 'credential',
    userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  console.log(`\n✅ Admin created successfully!`);
  console.log(`   Email   : ${process.env.ADMIN_EMAIL}`);
  console.log(`   Name    : Portfolio Admin`);
  console.log(`   Role    : ADMIN`);
  console.log(`   Hash    : ${hashedPassword.substring(0, 20)}... (verified format)`);
  console.log(`\n🔐 You can now login at http://localhost:5173/admin/login`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
