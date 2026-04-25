import api from '../utils/api';

export const historyService = {
  getWatchHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },

  addToHistory: async (videoId: string) => {
    const response = await api.post('/history', { videoId });
    return response.data;
  },

  removeFromHistory: async (id: string) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  }
};
