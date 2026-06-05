import { removeSession, navigateTo } from '../utils.js';

export function Sidebar() {
  setTimeout(() => {
    document.querySelector('#logoutBtn')?.addEventListener('click', () => {
      removeSession();
      navigateTo('/');
    });
    setTimeout(() => {
      const btn = document.querySelector('#logoutBtn');
      if (btn) {
        btn.replaceWith(btn.cloneNode(true));
        document.querySelector('#logoutBtn').addEventListener('click', () => {
          removeSession();
          navigateTo('/');
        });
      }
    }, 0);
  });

  return `
    <aside class="w-64 bg-slate-900 text-white h-screen p-5">
      <h2 class="text-2xl font-bold mb-8">SPA Base</h2>
      <nav class="flex flex-col gap-4">
        <a href="/home" class="px-3 py-1 bg-gray-500 rounded-xl" data-link>Home</a>
        <a href="/reservations" class="px-3 py-1 bg-gray-500 rounded-xl" data-link>Gestionar reservas</a>
        <button id="logoutBtn" class="text-left cursor-pointer text-red-400 hover:text-white hover:bg-red-400 px-3 py-1 rounded-xl">
          Cerrar sesión
        </button>
      </nav>
    </aside>
  `;
}
