import api from './axios';

export const productApi = {
  list: (search = '') => api.get('/products', { params: search ? { search } : {} }),
  get: (id) => api.get(`/products/${id}`),
  create: (payload) => api.post('/products', payload),
  update: (id, payload) => api.put(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
};
