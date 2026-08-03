import { api } from './api.js';

export const achievementService = {
  getAll: () => api.achievements.getAll(),
  getById: (id) => api.achievements.getById(id),
  create: (data) => api.achievements.create(data),
  update: (id, data) => api.achievements.update(id, data),
  delete: (id) => api.achievements.delete(id),
};
