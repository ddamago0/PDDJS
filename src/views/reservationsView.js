import { Sidebar } from '../components/Sidebar.js';

export default function reservationsView() {
  return `
    <div class="flex bg-slate-800 min-h-screen">
      ${Sidebar()}
      
      <main class="flex-1 p-8 text-white">
        <h1 class="text-3xl font-bold mb-6">Panel de Gestión de Reservas</h1>

        <!-- 1. Contenedor donde el controlador inyectará el formulario para CREAR -->
        <div id="formContainer" class="mb-8"></div>

        <!-- 2. Contenedor donde el controlador inyectará las tarjetas para VER y ELIMINAR -->
        <div id="reservationsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="col-span-full text-center py-8">
            <p class="text-slate-400 animate-pulse">Cargando panel de control...</p>
          </div>
        </div>
      </main>
    </div>
  `;
}
