import { api } from './api.js';

export const projectService = {
  getAll: () => api.projects.getAll(),

  getById: (id) => api.projects.getById(id),

  create: (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      content: data.content || null,
      link: data.link || null,
      image: data.image || null,
      featured: data.featured === true || data.featured === 'true',
      tags: data.tags || [],
    };
    return api.projects.create(payload);
  },

  update: (id, data) => {
    const payload = {
      title: data.title,
      description: data.description,
      content: data.content || null,
      link: data.link || null,
      image: data.image || null,
      featured: data.featured === true || data.featured === 'true',
      tags: data.tags || [],
    };
    return api.projects.update(id, payload);
  },

  delete: (id) => api.projects.delete(id),
};
