export default function ReservationCard(reservation) {
  const { workspaceId, date, startHour, endHour, reason, status } = reservation;
  return `
    <article class="bg-white p-6 rounded-xl shadow">
      <h3 class="font-bold text-lg">Espacio: ${workspaceId}</h3>
      <p>Fecha: ${date}</p>
      <p>Horario: ${startHour} - ${endHour}</p>
      <p>Motivo: ${reason}</p>
      <p>Estado: <span class="font-semibold">${status}</span></p>
    </article>
  `;
}
