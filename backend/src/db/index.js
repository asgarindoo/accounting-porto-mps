import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import dotenv from 'dotenv'

// Muat variabel environment
dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env')
}

// Koneksi ke Neon Database
const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql)

console.log('Neon Database connection initialized')
