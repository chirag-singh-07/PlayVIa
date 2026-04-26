import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('viral_auth_user');
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only force-logout on 401 (Unauthorized) — not on 404 (resource not found)
    // A 404 on /creator/stats just means the user has no channel yet — that's OK
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      // Don't redirect if the 401 came from the login endpoint itself
      const isLoginRequest = url.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('viral_auth_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/creator/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
