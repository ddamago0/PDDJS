import loginView from '../views/loginView.js';
import homeView from '../views/homeView.js';
import reservationsView from '../views/reservationsView.js';
import { isAuthenticated, isAdmin, navigateTo } from '../utils.js';
import notFoundView from '@/views/notFound';

const routes = {
  '/': loginView,
  '/home': homeView,
  '/reservations': reservationsView,
};

export const router = () => {
  const app = document.querySelector('#app');
  let path = window.location.pathname;
  if (path === '/home' && !isAuthenticated()) {
    navigateTo('/');
    return;
  }
  const view = routes[path] || notFoundView;
  app.innerHTML = view();
};

window.addEventListener('popstate', router);

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-link]');
  if (link) {
    e.preventDefault();
    navigateTo(link.getAttribute('href'));
  }
});
