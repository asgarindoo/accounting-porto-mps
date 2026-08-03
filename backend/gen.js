import fs from 'fs';
import path from 'path';

const entities = [
  { name: 'experience', table: 'experiences', fields: "['type', 'role', 'company', 'period', 'description', 'align']" },
  { name: 'skill', table: 'skills', fields: "['icon', 'title', 'subtitle', 'featured']" },
  { name: 'achievement', table: 'achievements', fields: "['icon', 'title', 'subtitle', 'description', 'image']" },
  { name: 'education', table: 'educations', fields: "['degree', 'institution', 'period', 'detail']" }
];

entities.forEach(ent => {
  const serviceCode = `import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const getAll = async () => {
  return await db.select().from(schema.${ent.table}).orderBy(asc(schema.${ent.table}.sortOrder));
};

export const getById = async (id) => {
  const result = await db.select().from(schema.${ent.table}).where(eq(schema.${ent.table}.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
};

export const create = async (data) => {
  if (data.sortOrder === undefined) {
    const existing = await db.select().from(schema.${ent.table}).orderBy(asc(schema.${ent.table}.sortOrder));
    data.sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;
  }
  const result = await db.insert(schema.${ent.table}).values(data).returning();
  return result[0];
};

export const update = async (id, data) => {
  const result = await db.update(schema.${ent.table}).set(data).where(eq(schema.${ent.table}.id, id)).returning();
  return result.length > 0 ? result[0] : null;
};

export const remove = async (id) => {
  await db.delete(schema.${ent.table}).where(eq(schema.${ent.table}.id, id));
};
`;

  fs.writeFileSync(path.join('src', 'services', `${ent.name}.service.js`), serviceCode);

  const controllerCode = `import * as service from '../services/${ent.name}.service.js';
import { sendSuccess } from '../utils/response.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAll = catchAsync(async (req, res) => {
  const data = await service.getAll();
  sendSuccess(res, data, 'Data retrieved successfully');
});

export const getById = catchAsync(async (req, res) => {
  const data = await service.getById(Number(req.params.id));
  if (!data) return res.status(404).json({ success: false, message: 'Not found' });
  sendSuccess(res, data, 'Data retrieved successfully');
});

export const create = catchAsync(async (req, res) => {
  const data = await service.create(req.body);
  sendSuccess(res, data, 'Created successfully', 201);
});

export const update = catchAsync(async (req, res) => {
  const exists = await service.getById(Number(req.params.id));
  if (!exists) return res.status(404).json({ success: false, message: 'Not found' });

  const data = await service.update(Number(req.params.id), req.body);
  sendSuccess(res, data, 'Updated successfully');
});

export const remove = catchAsync(async (req, res) => {
  const exists = await service.getById(Number(req.params.id));
  if (!exists) return res.status(404).json({ success: false, message: 'Not found' });

  await service.remove(Number(req.params.id));
  sendSuccess(res, null, 'Deleted successfully');
});
`;

  fs.writeFileSync(path.join('src', 'controllers', `${ent.name}.controller.js`), controllerCode);

  const routeCode = `import express from 'express';
import * as controller from '../controllers/${ent.name}.controller.js';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
`;

  fs.writeFileSync(path.join('src', 'routes', `${ent.name}.routes.js`), routeCode);
});

console.log('Generated files for standard CRUD entities.');
