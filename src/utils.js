export const saveSession = (userData) => {
  localStorage.setItem('user_session', JSON.stringify(userData));
};

export const getSession = () => {
  const session = localStorage.getItem('user_session');
  return session ? JSON.parse(session) : null;
};

export const removeSession = () => {
  localStorage.removeItem('user_session');
};

export const navigateTo = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
};

export const isAdmin = () => {
  const session = getSession();
  return session?.role === 'admin';
};
export const isAuthenticated = () => {
  return getSession() !== null;
};
