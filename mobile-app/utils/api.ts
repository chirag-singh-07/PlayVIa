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
    
    // Detailed Request Logging
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      if (config.data instanceof FormData) {
        console.log('📦 [Body] FormData content (binary/file)');
      } else {
        console.log('📦 [Body]', JSON.stringify(config.data, null, 2));
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [Request Error]', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.status} ${response.config.url}`);
    // console.log('📥 [Data]', JSON.stringify(response.data, null, 2));
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`🔴 [API Error] ${error.response?.status || 'Network Error'} ${originalRequest?.url}`);
    if (error.response?.data) {
      console.error('📝 [Error Data]', JSON.stringify(error.response.data, null, 2));
    }

    // Handle server waking up (Render cold start) — retry once after 6 seconds
    if (
      !error.response &&
      !originalRequest._retried &&
      (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.message?.includes('Network Error'))
    ) {
      originalRequest._retried = true;
      console.log('😴 Server is sleeping. Attempting retry in 6s...');
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
      console.log('🔑 Session expired. Clearing token.');
      await SecureStore.deleteItemAsync('userToken');
    }

    return Promise.reject(error);
  }
);

export default api;
