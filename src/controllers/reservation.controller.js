import { getSession, isAdmin } from '../utils.js';
import { reservationService } from '../services/reservation.service.js';

export const reservationController = {
  getReservations: async () => {
    const user = getSession();
    const data = await reservationService.getAll();
    return isAdmin() ? data : data.filter((r) => r.userId === user?.id);
  },

  createReservation: async (data) => {
    const user = getSession();
    const newRes = {
      ...data,
      userId: user?.id,
      status: 'pending',
    };

    const existing = await reservationService.getAll();
    const conflict = existing.some(
      (r) =>
        r.workspaceId === newRes.workspaceId &&
        r.date === newRes.date &&
        r.startHour < newRes.endHour &&
        r.endHour > newRes.startHour
    );
    if (conflict) throw new Error('Ya existe una reserva en este horario');

    return reservationService.create(newRes);
  },

  updateReservation: async (id, data) => {
    const user = getSession();
    const res = await reservationService.getById(id);

    if (res.userId !== user?.id) throw new Error('No tienes permiso');
    if (res.status !== 'pending')
      throw new Error('Solo se pueden modificar reservas pendientes');

    return reservationService.update(id, data);
  },

  deleteReservation: async (id) => {
    const user = getSession();
    const res = await reservationService.getById(id);

    if (res.status === 'approved')
      throw new Error('No se pueden eliminar reservas aprobadas');
    if (res.userId !== user?.id) throw new Error('No tienes permiso');

    return reservationService.delete(id);
  },

  approveReservation: async (id) => {
    if (!isAdmin()) throw new Error('Acceso denegado');
    return reservationService.update(id, { status: 'approved' });
  },

  rejectReservation: async (id) => {
    if (!isAdmin()) throw new Error('Acceso denegado');
    return reservationService.update(id, { status: 'rejected' });
  },
};
export const initReservationsPage = async () => {
  const container = document.querySelector('#reservationsContainer');
  if (!container) return;

  const loadCards = async () => {
    try {
      const user = getSession();

      const reservations = await reservationController.getReservations();

      if (!reservations || reservations.length === 0) {
        container.innerHTML = `
          <div class="col-span-full text-center py-8">
            <p class="text-slate-400">No hay reservas registradas en el sistema.</p>
          </div>`;
        return;
      }

      container.innerHTML = reservations
        .map(
          (r) => `
        <div class="bg-slate-900 p-6 rounded-xl shadow border border-slate-700">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-xl text-indigo-400">Mesa: ${
              r.workspaceId
            }</h3>
            <span class="px-2 py-1 rounded text-xs font-bold ${
              r.status === 'approved'
                ? 'bg-green-500/20 text-green-400'
                : r.status === 'rejected'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }">${r.status.toUpperCase()}</span>
          </div>
          <p class="text-slate-300"><span class="text-slate-500">Fecha:</span> ${
            r.date
          }</p>
          <p class="text-slate-300 mb-4"><span class="text-slate-500">Horario:</span> ${
            r.startHour
          } - ${r.endHour}</p>
          
          <div class="flex gap-2 mt-4">
            ${
              r.status === 'pending' && isAdmin()
                ? `
              <button data-action="approve" data-id="${r.id}" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-semibold cursor-pointer flex-1">Aprobar</button>
              <button data-action="reject" data-id="${r.id}" class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-sm font-semibold cursor-pointer flex-1">Rechazar</button>
            `
                : ''
            }
            ${
              r.userId === user?.id && r.status === 'pending'
                ? `
              <button data-action="cancel" data-id="${r.id}" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-semibold cursor-pointer flex-1">Cancelar</button>
            `
                : ''
            }
          </div>
        </div>
      `
        )
        .join('');
    } catch (err) {
      container.innerHTML = `
        <div class="col-span-full text-center py-8">
          <p class="text-red-400">Error al renderizar los datos: ${err.message}</p>
        </div>`;
    }
  };

  container.addEventListener('click', async (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    try {
      if (action === 'approve') {
        await reservationController.approveReservation(id);
        alert('Reserva aprobada exitosamente');
      } else if (action === 'reject') {
        await reservationController.rejectReservation(id);
        alert('Reserva rechazada de forma correcta');
      } else if (action === 'cancel') {
        if (confirm('¿Estás seguro de que deseas dar de baja esta reserva?')) {
          await reservationController.deleteReservation(id);
          alert('Reserva cancelada exitosamente');
        } else return;
      }
      loadCards();
    } catch (err) {
      alert(err.message);
    }
  });

  loadCards();
};
