/**
 * creatorService.ts
 * Service for creator-related API calls
 */

import api from '../utils/api';

export const creatorService = {
  // Get creator dashboard stats
  getStats: async () => {
    const response = await api.get('/creator/stats');
    return response.data;
  },

  // Get creator videos
  getVideos: async (page = 1, limit = 10) => {
    const response = await api.get(`/creator/videos?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get creator analytics
  getAnalytics: async () => {
    const response = await api.get('/creator/analytics');
    return response.data;
  },

  // Get creator subscribers
  getSubscribers: async () => {
    const response = await api.get('/creator/subscribers');
    return response.data;
  },

  // Get creator comments
  getComments: async () => {
    const response = await api.get('/creator/comments');
    return response.data;
  },

  // Get creator payouts/withdrawals
  getPayouts: async () => {
    const response = await api.get('/creator/payouts');
    return response.data;
  },

  // Create a withdrawal request
  createWithdrawal: async (withdrawalData: {
    amount: number;
    method: 'upi' | 'bank';
    details: {
      upi?: string;
      accountHolder?: string;
      accountNumber?: string;
      ifsc?: string;
      bankName?: string;
    };
    note?: string;
  }) => {
    const response = await api.post('/creator/payouts', withdrawalData);
    return response.data;
  },
};
