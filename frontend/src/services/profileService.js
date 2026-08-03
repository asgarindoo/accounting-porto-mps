import { api } from './api.js';

export const profileService = {
  get: () => api.profile.get(),
  update: (data) => api.profile.update(data),
};
