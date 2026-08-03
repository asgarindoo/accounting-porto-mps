import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { catchAsync } from '../utils/catchAsync.js';

import { eq, asc } from 'drizzle-orm';

export const getAll = catchAsync(async (req, res) => {
  const data = await db.select().from(schema.contacts).orderBy(asc(schema.contacts.sortOrder));
  res.status(200).json({ success: true, data });
});

export const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.select().from(schema.contacts).where(eq(schema.contacts.id, parseInt(id)));
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});

export const create = catchAsync(async (req, res) => {
  const currentContacts = await db.select().from(schema.contacts);
  if (currentContacts.length >= 6) {
    return res.status(400).json({ success: false, message: 'Maximum of 6 contacts reached.' });
  }
  const data = await db.insert(schema.contacts).values(req.body).returning();
  res.status(201).json({ success: true, data: data[0] });
});

export const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.update(schema.contacts).set(req.body).where(eq(schema.contacts.id, parseInt(id))).returning();
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});

export const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.delete(schema.contacts).where(eq(schema.contacts.id, parseInt(id))).returning();
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});
