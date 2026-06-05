import { saveSession, navigateTo } from '../utils.js';
import { http } from '../api/http.js';

export const loginController = () => {
  const form = document.querySelector('#loginForm');

  if (!form) {
    console.error('El formulario #loginForm no fue encontrado.');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const users = await http.get(
        `/users?email=${email}&password=${password}`
      );

      if (!users || users.length === 0) {
        alert('Credenciales incorrectas');
        return;
      }

      const user = users[0];

      saveSession({
        id: user.id,
        name: user.name,
        role: user.role,
        token: user.token,
      });

      navigateTo('/home');
    } catch (error) {
      console.error('Error de autenticación:', error);
      alert('Error de conexión con el servidor. Inténtalo más tarde.');
    }
  });
};
