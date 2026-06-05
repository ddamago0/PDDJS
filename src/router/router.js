import loginView from '../views/loginView.js';
import homeView from '../views/homeView.js';
import reservationsView from '../views/reservationsView.js';
import { isAuthenticated, isAdmin, navigateTo } from '../utils.js';
import { initReservationsPage } from '../controllers/reservation.controller.js';
import { homeController } from '../controllers/home.controller.js';

const routes = {
  '/': loginView,
  '/home': homeView,
  '/reservations': reservationsView,
};

export const router = async () => {
  const app = document.querySelector('#app');
  const path = window.location.pathname;

  if (!isAuthenticated() && !['/', '/home'].includes(path)) {
    navigateTo('/');
    return;
  }

  const view = routes[path] || loginView;
  app.innerHTML = view();

  if (path === '/home') {
    homeController();
  } else if (path === '/reservations') {
    initReservationsPage();
  }
};

window.addEventListener('popstate', router);

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-link]');
  if (link) {
    e.preventDefault();
    navigateTo(link.getAttribute('href'));
  }
});
