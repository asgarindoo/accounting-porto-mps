import { api } from './api.js';

export const experienceService = {
  getAll: () => api.experiences.getAll(),
  getById: (id) => api.experiences.getById(id),
  create: (data) => api.experiences.create(data),
  update: (id, data) => api.experiences.update(id, data),
  delete: (id) => api.experiences.delete(id),
};
