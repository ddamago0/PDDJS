import { Sidebar } from '../components/Sidebar.js';
import { getSession } from '../utils.js';

export default function homeView() {
  const user = getSession();

  return `
    <div class="flex bg-slate-800 min-h-screen">

      ${Sidebar()}

      <main class="flex-1 p-8 bg-slate-100 min-h-screen">

        <div class="mb-6 bg-white p-5 rounded-lg shadow">
          <h1 class="text-2xl font-bold text-slate-800">
            Bienvenido, ${user?.name || 'Usuario'}
          </h1>
          <p class="text-slate-500 font-semibold mt-1">
            Rol asignado: <span class="text-indigo-600">${user?.role?.toUpperCase()}</span>
          </p>
        </div>

        ${
          user?.role === 'admin'
            ? `
              <section class="bg-white p-5 rounded-lg shadow mb-6">
                <h2 class="font-bold text-xl mb-2 text-slate-800">
                  Panel Administrador
                </h2>
                <p class="text-slate-600">
                  Tienes acceso total para visualizar, aprobar, rechazar o dar de baja todas las solicitudes del sistema.
                </p>
                <!-- 🛠️ CORREGIDO: Se cambia a un enlace con data-link para navegar directamente a la SPA -->
                <a href="/reservations" data-link
                  class="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Gestionar Reservas
                </a>
              </section>
            `
            : `
              <section class="bg-white p-5 rounded-lg shadow mb-6">
                <h2 class="font-bold text-xl mb-2 text-slate-800">
                  Panel Usuario
                </h2>
                <p class="text-slate-600">
                  Aquí puedes consultar el estado en tiempo real de tus solicitudes o programar un nuevo horario de trabajo.
                </p>
                <!-- 🛠️ CORREGIDO: Enlace con data-link hacia el módulo de creación de reservas -->
                <a href="/reservations" data-link
                  class="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Nueva Reserva
                </a>
              </section>
            `
        }

        <section class="bg-white p-5 rounded-lg shadow">

          <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <h2 class="font-bold text-xl text-slate-800">
              Historial de Reservas
            </h2>
            <span class="text-sm font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-500">
              ${
                user?.role === 'admin'
                  ? 'Mostrando todas las reservas'
                  : 'Mostrando únicamente tus reservas'
              }
            </span>
          </div>

          <!-- Contenedor dinámico donde el homeController inyectará las tarjetas reales -->
          <div id="reservationsContainer" class="grid gap-4 md:grid-cols-2">
            <div class="w-full text-center py-8 col-span-2">
              <p class="text-slate-400 animate-pulse">
                Cargando reservas desde el servidor...
              </p>
            </div>
          </div>

        </section>

      </main>

    </div>
  `;
}
