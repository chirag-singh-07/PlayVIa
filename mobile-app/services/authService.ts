import api from '../utils/api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
    }
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  }
};
