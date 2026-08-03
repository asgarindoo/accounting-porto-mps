import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync.js';

export const getAll = catchAsync(async (req, res) => {
  const data = await db.select().from(schema.resumeSections).orderBy(schema.resumeSections.sortOrder);
  res.status(200).json({ success: true, data });
});

export const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.select().from(schema.resumeSections).where(eq(schema.resumeSections.id, parseInt(id)));
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});

export const create = catchAsync(async (req, res) => {
  const data = await db.insert(schema.resumeSections).values(req.body).returning();
  res.status(201).json({ success: true, data: data[0] });
});

export const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.update(schema.resumeSections).set(req.body).where(eq(schema.resumeSections.id, parseInt(id))).returning();
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});

export const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.delete(schema.resumeSections).where(eq(schema.resumeSections.id, parseInt(id))).returning();
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});
