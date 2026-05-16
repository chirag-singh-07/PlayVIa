import api from '../utils/api';

export const channelService = {
  getChannelById: async (id: string) => {
    const response = await api.get(`/channel/${id}`);
    return response.data;
  },
  
  getChannelVideos: async (id: string) => {
    const response = await api.get(`/channel/${id}/videos`);
    return response.data;
  },
  
  getChannelShorts: async (id: string) => {
    const response = await api.get(`/channel/${id}/shorts`);
    return response.data;
  },
  
  getAllChannelContent: async (id: string) => {
    const response = await api.get(`/channel/${id}/all`);
    return response.data;
  },
  
  subscribeToChannel: async (id: string) => {
    const response = await api.post(`/subscribe/${id}`);
    return response.data;
  },

  createChannel: async (channelData: any) => {
    const response = await api.post('/channel/create', channelData);
    return response.data;
  },
  
  getMyChannel: async () => {
    const response = await api.get('/channel/me');
    return response.data;
  },

  updateChannel: async (id: string, formData: FormData) => {
    const response = await api.put(`/channel/${id}`, formData, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.data;
  },

  getChannelStats: async () => {
    const response = await api.get('/channel/stats/me');
    return response.data;
  }
};
