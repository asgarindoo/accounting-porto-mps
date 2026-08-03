import { api } from './api.js';

export const headlineService = {
  getAll: () => api.headlines.getAll(),
  getById: (id) => api.headlines.getById(id),
  create: (data) => api.headlines.create(data),
  update: (id, data) => api.headlines.update(id, data),
  delete: (id) => api.headlines.delete(id),
};

export const bioService = {
  getAll: () => api.bios.getAll(),
  getById: (id) => api.bios.getById(id),
  create: (data) => api.bios.create(data),
  update: (id, data) => api.bios.update(id, data),
  delete: (id) => api.bios.delete(id),
};

export const statService = {
  getAll: () => api.stats.getAll(),
  getById: (id) => api.stats.getById(id),
  create: (data) => api.stats.create(data),
  update: (id, data) => api.stats.update(id, data),
  delete: (id) => api.stats.delete(id),
};

export const badgeService = {
  getAll: () => api.badges.getAll(),
  getById: (id) => api.badges.getById(id),
  create: (data) => api.badges.create(data),
  update: (id, data) => api.badges.update(id, data),
  delete: (id) => api.badges.delete(id),
};

export const softskillService = {
  getAll: () => api.softskills.getAll(),
  getById: (id) => api.softskills.getById(id),
  create: (data) => api.softskills.create(data),
  update: (id, data) => api.softskills.update(id, data),
  delete: (id) => api.softskills.delete(id),
};

export const resumeService = {
  getAll: () => api.resume.getAll(),
  getById: (id) => api.resume.getById(id),
  create: (data) => api.resume.create(data),
  update: (id, data) => api.resume.update(id, data),
  delete: (id) => api.resume.delete(id),
};

export const navService = {
  getAll: () => api.nav.getAll(),
  getById: (id) => api.nav.getById(id),
  create: (data) => api.nav.create(data),
  update: (id, data) => api.nav.update(id, data),
  delete: (id) => api.nav.delete(id),
};

export const educationService = {
  getAll: () => api.education.getAll(),
  getById: (id) => api.education.getById(id),
  create: (data) => api.education.create(data),
  update: (id, data) => api.education.update(id, data),
  delete: (id) => api.education.delete(id),
};

export const contactService = {
  getAll: () => api.contact.getAll(),
  getById: (id) => api.contact.getById(id),
  create: (data) => api.contact.create(data),
  update: (id, data) => api.contact.update(id, data),
  delete: (id) => api.contact.delete(id),
};

export const settingsService = {
  get: () => api.settings.get(),
  update: (data) => api.settings.update(data),
};
