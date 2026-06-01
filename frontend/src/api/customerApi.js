import api from './axios';

export const customerApi = {
  list: () => api.get('/customers'),
  get: (id) => api.get(`/customers/${id}`),
  create: (payload) => api.post('/customers', payload),
  remove: (id) => api.delete(`/customers/${id}`),
};
