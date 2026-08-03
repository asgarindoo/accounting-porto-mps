import * as service from '../services/achievement.service.js';
import { sendSuccess } from '../utils/response.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAll = catchAsync(async (req, res) => {
  const data = await service.getAll();
  sendSuccess(res, data, 'Data retrieved successfully');
});

export const getById = catchAsync(async (req, res) => {
  const data = await service.getById(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: 'Not found' });
  sendSuccess(res, data, 'Data retrieved successfully');
});

export const create = catchAsync(async (req, res) => {
  const data = await service.create(req.body);
  sendSuccess(res, data, 'Created successfully', 201);
});

export const update = catchAsync(async (req, res) => {
  const exists = await service.getById(req.params.id);
  if (!exists) return res.status(404).json({ success: false, message: 'Not found' });

  const data = await service.update(req.params.id, req.body);
  sendSuccess(res, data, 'Updated successfully');
});

export const remove = catchAsync(async (req, res) => {
  const exists = await service.getById(req.params.id);
  if (!exists) return res.status(404).json({ success: false, message: 'Not found' });

  await service.remove(req.params.id);
  sendSuccess(res, null, 'Deleted successfully');
});
