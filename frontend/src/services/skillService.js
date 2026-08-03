import { api } from './api.js';

export const skillService = {
  getAll: () => api.skills.getAll(),
  getById: (id) => api.skills.getById(id),
  create: (data) => ({ ...data, featured: data.featured === true || data.featured === 'true' }),
  update: (id, data) => api.skills.update(id, { ...data, featured: data.featured === true || data.featured === 'true' }),
  delete: (id) => api.skills.delete(id),
};

// Override create to also call API
skillService.create = (data) => api.skills.create({ ...data, featured: data.featured === true || data.featured === 'true' });
