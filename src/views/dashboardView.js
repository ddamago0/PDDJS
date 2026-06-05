import { reservationService } from '../services/reservation.service';
import { isAdmin } from '../utils';

export default async function dashboardView() {
  const data = await reservationService.getAll();
  const stats = {
    total: data.length,
    pending: data.filter((r) => r.status === 'pending').length,
    approved: data.filter((r) => r.status === 'approved').length,
  };

  return `
    <div class="p-8">
      <h1 class="text-4xl font-bold mb-6">Dashboard Administrador</h1>
      <div class="grid grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl shadow">
          <h3>Total Reservas</h3>
          <p class="text-5xl">${stats.total}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow">
          <h3>Pendientes</h3>
          <p class="text-5xl text-yellow-500">${stats.pending}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow">
          <h3>Aprobadas</h3>
          <p class="text-5xl text-green-500">${stats.approved}</p>
        </div>
      </div>
    </div>
  `;
}
