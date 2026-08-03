import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync.js';

// GET /api/settings
export const getSettings = catchAsync(async (req, res) => {
  const settingsRaw = await db.select().from(schema.siteSettings);
  const settings = settingsRaw.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  res.status(200).json({ success: true, data: settings });
});

// PUT /api/settings
export const updateSettings = catchAsync(async (req, res) => {
  const updates = req.body;
  
  // Updates is an object like { hero_description: '...', about_title: '...' }
  const promises = [];
  
  for (const [key, value] of Object.entries(updates)) {
    promises.push(
      db.insert(schema.siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: schema.siteSettings.key,
          set: { value },
        })
    );
  }
  
  await Promise.all(promises);
  
  res.status(200).json({ success: true, message: 'Settings updated successfully' });
});
