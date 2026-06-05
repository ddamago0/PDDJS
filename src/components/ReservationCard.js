export default function ReservationCard(reservation) {
  const { date, startHour, endHour, reason, status } = reservation;
  return `
    <article class="bg-white p-6 rounded-xl shadow">
      <h3>Espacio: ${reservation.workspace || reservation.workspaceId}</h3>
      <p>Fecha: ${date}</p>
      <p>Horario: ${startHour} - ${endHour}</p>
      <p>Motivo: ${reason}</p>
      <p>Estado: <span class="font-semibold">${status}</span></p>
    </article>
  `;
}
