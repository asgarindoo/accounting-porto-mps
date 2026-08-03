import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/index.js';
import * as schema from './db/schema.js';
import dotenv from 'dotenv';

dotenv.config();
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  // Secret for signing tokens
  secret: process.env.AUTH_SECRET,

  // Base URL for callbacks and emails
  baseURL: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,

  // Trusted origins (frontend)
  trustedOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
  ],

  // Email & Password provider
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // Only admin via seed
    requireEmailVerification: false,
  },

  // Session config
  session: {
    expiresIn: 60 * 60, // 1 hour
    updateAge: 15 * 60, // refresh every 15 mins
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 min cache
    },
  },

  // User fields
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'ADMIN',
      },
    },
  },
});
