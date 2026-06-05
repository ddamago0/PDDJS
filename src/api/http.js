const API_URL = 'http://localhost:3001';

const request = async (endpoint, options = {}) => {
  const session = JSON.parse(localStorage.getItem('user_session'));

  const headers = { 'Content-Type': 'application/json' };

  if (session && session.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const error = new Error(`HTTP Error ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const http = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data) =>
    request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
