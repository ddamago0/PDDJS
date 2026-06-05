import ReservationCard from '../components/ReservationCard.js';

import { reservationService } from '../services/reservation.service.js';
import { getSession } from '../utils.js';

export const homeController = async () => {
  const container = document.querySelector('#reservationsContainer');

  if (!container) {
    console.error('El contenedor #reservationsContainer no fue encontrado.');
    return;
  }

  const user = getSession();

  container.innerHTML = `
    <div class="w-full text-center py-8 col-span-2">
      <p class="text-slate-500 animate-pulse">Cargando reservas...</p>
    </div>
  `;

  try {
    const reservations = await reservationService.getAll();

    const filteredReservations =
      user?.role === 'admin'
        ? reservations
        : reservations.filter((reservation) => reservation.userId === user?.id);

    container.innerHTML = filteredReservations?.length
      ? filteredReservations
          .map((reservation) => ReservationCard(reservation))
          .join('')
      : `
        <div class="w-full text-center py-8 col-span-2">
          <p class="text-slate-500">
            No hay reservas disponibles
          </p>
        </div>
      `;
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    container.innerHTML = `
      <div class="w-full text-center py-8 col-span-2">
        <p class="text-red-500">Error al cargar las reservas. Inténtalo más tarde.</p>
      </div>
    `;
  }
};
