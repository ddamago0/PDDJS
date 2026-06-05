import { reservationService } from '../services/reservation.service.js';
import { getSession, isAdmin } from '../utils.js';

export const initReservationsPage = async () => {
  const formContainer = document.querySelector('#formContainer');
  const container = document.querySelector('#reservationsContainer');

  if (!container) return;

  // 📝 A. INYECTAR EL FORMULARIO DE CREACIÓN
  if (formContainer) {
    formContainer.innerHTML = `
      <div class="bg-slate-900 p-6 rounded-xl max-w-3xl border border-slate-700">
        <h2 class="text-xl font-bold mb-4 text-indigo-400">Crear Nueva Reserva</h2>
        <form id="reservationForm" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm text-slate-400 mb-1">ID del Espacio</label>
            <input name="workspaceId" type="text" required class="w-full bg-slate-800 p-2 rounded border border-slate-700 text-white" placeholder="Ej: Mesa-01">
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">Fecha</label>
            <input name="date" type="date" required class="w-full bg-slate-800 p-2 rounded border border-slate-700 text-white">
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">Hora Inicio</label>
            <input name="startHour" type="text" required class="w-full bg-slate-800 p-2 rounded border border-slate-700 text-white" placeholder="Ej: 08:00">
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">Hora Fin</label>
            <input name="endHour" type="text" required class="w-full bg-slate-800 p-2 rounded border border-slate-700 text-white" placeholder="Ej: 10:00">
          </div>
          <div class="md:col-span-4">
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold transition cursor-pointer">
              Confirmar y Guardar Reserva
            </button>
          </div>
        </form>
      </div>
    `;

    // Escuchar el envío del formulario para CREAR
    const form = document.querySelector('#reservationForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        workspace: form.workspace.value.trim(),
        date: form.date.value,
        startHour: form.startHour.value.trim(),
        endHour: form.endHour.value.trim(),
        userId: getSession()?.id,
        status: 'pending',
      };

      try {
        // Ejecuta tu método createReservation que valida los choques de horario
        await reservationController.createReservation(formData);
        alert(' ¡Reserva creada exitosamente!');
        form.reset();
        loadCards();
      } catch (err) {
        alert(` Error: ${err.message}`);
      }
    });
  }

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
              r.workspaceId || r.workspace || 'No asignado'
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
            <!-- Acciones del Administrador -->
            ${
              r.status === 'pending' && isAdmin()
                ? `
              <button data-action="approve" data-id="${r.id}" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-semibold cursor-pointer flex-1">Aprobar</button>
              <button data-action="reject" data-id="${r.id}" class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-sm font-semibold cursor-pointer flex-1">Rechazar</button>
            `
                : ''
            }
            
            <!-- Acciones de ELIMINAR / CANCELAR -->
            ${
              r.status === 'pending' || isAdmin()
                ? `
              <button data-action="delete" data-id="${r.id}" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-semibold cursor-pointer flex-1">Eliminar</button>
            `
                : ''
            }
          </div>
        </div>
      `
        )
        .join('');
    } catch (err) {
      container.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-red-400">Error: ${err.message}</p></div>`;
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
        alert('Reserva rechazada');
      } else if (action === 'delete') {
        if (
          confirm(
            '¿Estás completamente seguro de que deseas eliminar esta reserva?'
          )
        ) {
          await reservationController.deleteReservation(id);
          alert(' Reserva eliminada con éxito');
        } else return;
      }
      loadCards();
    } catch (err) {
      alert(`Operación rechazada: ${err.message}`);
    }
  });

  loadCards();
};
