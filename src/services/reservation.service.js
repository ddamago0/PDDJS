import { reservationApi } from '../api/reservations.api';

export const reservationService = {
  getAll: () => reservationApi.getAll(),
  getById: (id) => reservationApi.getById(id),
  create: (data) => reservationApi.create(data),
  update: (id, data) => reservationApi.update(id, data),
  delete: (id) => reservationApi.delete(id),
};
