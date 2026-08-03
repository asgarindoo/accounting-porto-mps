import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const getAll = async () => {
  return await db.select().from(schema.educations).orderBy(asc(schema.educations.sortOrder));
};

export const getById = async (id) => {
  const result = await db.select().from(schema.educations).where(eq(schema.educations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
};

export const create = async (data) => {
  if (data.sortOrder === undefined) {
    const existing = await db.select().from(schema.educations).orderBy(asc(schema.educations.sortOrder));
    data.sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;
  }
  const result = await db.insert(schema.educations).values(data).returning();
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(schema.educations).set(data).where(eq(schema.educations.id, id)).returning();
  return result.length > 0 ? result[0] : null;
};

export const remove = async (id) => {
  await db.delete(schema.educations).where(eq(schema.educations.id, id));
};
