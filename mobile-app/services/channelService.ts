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
  
  subscribeToChannel: async (id: string) => {
    const response = await api.post(`/subscribe/${id}`);
    return response.data;
  },

  createChannel: async (channelData: any) => {
    const response = await api.post('/channel', channelData);
    return response.data;
  }
};
