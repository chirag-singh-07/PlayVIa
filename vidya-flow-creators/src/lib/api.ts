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
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if unauthorized
      localStorage.removeItem('viral_auth_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/creator/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
