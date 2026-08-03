import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getProfile = async () => {
  const result = await db.select().from(schema.profiles).limit(1);
  return result.length > 0 ? result[0] : null;
};

export const updateProfile = async (data) => {
  const existing = await getProfile();
  if (existing) {
    const result = await db.update(schema.profiles).set(data).where(eq(schema.profiles.id, existing.id)).returning();
    return result[0];
  } else {
    // If no profile exists, create one
    const result = await db.insert(schema.profiles).values(data).returning();
    return result[0];
  }
};
