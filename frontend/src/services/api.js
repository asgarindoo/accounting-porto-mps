const BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api';

async function fetchApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Send session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API Error');
  }

  return result.data;
}

// Basic CRUD generator for standard entities
const createCrudService = (path) => ({
  getAll: () => fetchApi(path),
  getById: (id) => fetchApi(`${path}/${id}`),
  create: (data) => fetchApi(path, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchApi(`${path}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchApi(`${path}/${id}`, { method: 'DELETE' }),
});

export const api = {
  portfolio: {
    get: () => fetchApi('/portfolio'),
  },
  profile: {
    get: () => fetchApi('/profile'),
    update: (data) => fetchApi('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  contact: createCrudService('/contact'),
  settings: {
    get: () => fetchApi('/settings'),
    update: (data) => fetchApi('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
  projects: createCrudService('/projects'),
  experiences: createCrudService('/experiences'),
  skills: createCrudService('/skills'),
  achievements: createCrudService('/achievements'),
  education: createCrudService('/education'),
  
  // New Content endpoints
  headlines: createCrudService('/headlines'),
  bios: createCrudService('/bios'),
  stats: createCrudService('/stats'),
  badges: createCrudService('/badges'),
  softskills: createCrudService('/softskills'),
  resume: createCrudService('/resume'),
  nav: createCrudService('/nav'),
};
