import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 30 second timeout — Render free tier can take ~15-30s to wake up from sleep
  timeout: 30000,
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle server waking up (Render cold start) — retry once after 6 seconds
    if (
      !error.response &&
      !originalRequest._retried &&
      (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.message?.includes('Network Error'))
    ) {
      originalRequest._retried = true;
      Alert.alert(
        '⏳ Server Waking Up',
        'Our server is starting up (this happens after inactivity). Retrying in 6 seconds...',
        [{ text: 'OK' }]
      );
      await new Promise((resolve) => setTimeout(resolve, 6000));
      return api(originalRequest);
    }

    // Handle 401 Unauthorized — clear token and let app redirect to login
    if (error.response && error.response.status === 401) {
      await SecureStore.deleteItemAsync('userToken');
    }

    return Promise.reject(error);
  }
);

export default api;
