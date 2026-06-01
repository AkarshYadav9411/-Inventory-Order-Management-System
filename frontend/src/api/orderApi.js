import api from './axios';

export const orderApi = {
  list: () => api.get('/orders'),
  get: (id) => api.get(`/orders/${id}`),
  create: (payload) => api.post('/orders', payload),
  remove: (id) => api.delete(`/orders/${id}`),
};
