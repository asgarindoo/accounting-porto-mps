import { api } from './api.js';

export const educationService = {
  getAll: () => api.education.getAll(),
  getById: (id) => api.education.getById(id),
  create: (data) => api.education.create(data),
  update: (id, data) => api.education.update(id, data),
  delete: (id) => api.education.delete(id),
};
