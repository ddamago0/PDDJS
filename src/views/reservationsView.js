import { reservationController } from '../controllers/reservation.controller.js';
import { navigateTo, isAdmin } from '../utils.js';
import Sidebar from '../components/Sidebar.js';

export default function reservationsView() {
  let reservations = [];

  const loadReservations = async () => {
    try {
      reservations = await reservationController.getReservations();
      render();
    } catch (e) {
      alert(e.message);
    }
  };

  const render = () => {
    const container = document.querySelector('#reservationsContainer');
    container.innerHTML = reservations.map((r) => ReservationCard(r)).join('');
  };

  return `
    <div class="flex">
      ${Sidebar()}
      <main class="flex-1 p-8 bg-slate-100 min-h-screen">
        <h1 class="text-3xl font-bold mb-6">Gestión de Reservas</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${reservations
            .map(
              (r) => `
            <div class="bg-white p-6 rounded-xl shadow">
              <h3 class="font-bold">${r.workspaceId} - ${r.date}</h3>
              <p>${r.startHour} - ${r.endHour}</p>
              <p>Estado: <span class="font-semibold">${r.status}</span></p>
              <div class="mt-4 flex gap-2">
                ${
                  r.status === 'pending' && isAdmin()
                    ? `
                  <button onclick="approve(${r.id})" class="bg-green-600 text-white px-4 py-2 rounded">Aprobar</button>
                  <button onclick="reject(${r.id})" class="bg-red-600 text-white px-4 py-2 rounded">Rechazar</button>
                `
                    : ''
                }
                ${
                  r.userId === getSession().id && r.status === 'pending'
                    ? `
                  <button onclick="edit(${r.id})" class="bg-blue-600 text-white px-4 py-2 rounded">Editar</button>
                  <button onclick="cancel(${r.id})" class="bg-red-600 text-white px-4 py-2 rounded">Cancelar</button>
                `
                    : ''
                }
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </main>
    </div>
  `;
}
