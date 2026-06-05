import { http } from './http';

export const reservationApi = {
  getAll: () => http.get('/reservations'),
  getById: (id) => http.get(`/reservations/${id}`),
  create: (data) => http.post('/reservations', data),
  update: (id, data) => http.patch(`/reservations/${id}`, data),
  delete: (id) => http.delete(`/reservations/${id}`),
};
