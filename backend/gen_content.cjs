const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'headline', table: 'profileHeadlines' },
  { name: 'bio', table: 'profileBios' },
  { name: 'stat', table: 'profileStats' },
  { name: 'badge', table: 'floatingBadges' },
  { name: 'softskill', table: 'softSkills' },
  { name: 'resume', table: 'resumeSections' },
  { name: 'nav', table: 'navLinks' }
];

const controllersDir = path.join(__dirname, 'src', 'controllers');
const routesDir = path.join(__dirname, 'src', 'routes');

entities.forEach(entity => {
  const controllerContent = `import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync.js';

export const getAll = catchAsync(async (req, res) => {
  const data = await db.select().from(schema.${entity.table}).orderBy(schema.${entity.table}.sortOrder);
  res.status(200).json({ success: true, data });
});

export const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.select().from(schema.${entity.table}).where(eq(schema.${entity.table}.id, parseInt(id)));
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});

export const create = catchAsync(async (req, res) => {
  const data = await db.insert(schema.${entity.table}).values(req.body).returning();
  res.status(201).json({ success: true, data: data[0] });
});

export const update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.update(schema.${entity.table}).set(req.body).where(eq(schema.${entity.table}.id, parseInt(id))).returning();
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});

export const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await db.delete(schema.${entity.table}).where(eq(schema.${entity.table}.id, parseInt(id))).returning();
  if (!data.length) return res.status(404).json({ success: false, message: 'Not found' });
  res.status(200).json({ success: true, data: data[0] });
});
`;

  const routeContent = `import express from 'express';
import * as controller from '../controllers/${entity.name}.controller.js';

const router = express.Router();

router.route('/')
  .get(controller.getAll)
  .post(controller.create);

router.route('/:id')
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.remove);

export default router;
`;

  fs.writeFileSync(path.join(controllersDir, `${entity.name}.controller.js`), controllerContent);
  fs.writeFileSync(path.join(routesDir, `${entity.name}.routes.js`), routeContent);
});

// contact is a single record, like profile
const contactControllerContent = `import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { catchAsync } from '../utils/catchAsync.js';

export const get = catchAsync(async (req, res) => {
  const data = await db.select().from(schema.contacts).limit(1);
  res.status(200).json({ success: true, data: data[0] || {} });
});

export const update = catchAsync(async (req, res) => {
  const existing = await db.select().from(schema.contacts).limit(1);
  let data;
  if (existing.length > 0) {
    data = await db.update(schema.contacts).set(req.body).returning();
  } else {
    data = await db.insert(schema.contacts).values(req.body).returning();
  }
  res.status(200).json({ success: true, data: data[0] });
});
`;

const contactRouteContent = `import express from 'express';
import * as controller from '../controllers/contact.controller.js';

const router = express.Router();

router.route('/')
  .get(controller.get)
  .put(controller.update);

export default router;
`;

fs.writeFileSync(path.join(controllersDir, `contact.controller.js`), contactControllerContent);
fs.writeFileSync(path.join(routesDir, `contact.routes.js`), contactRouteContent);

console.log('All backend CRUD files generated.');
