import api from '../utils/api';

export const earningsService = {
  getChannelEarnings: async (channelId: string) => {
    const response = await api.get(`/earnings/${channelId}`);
    return response.data;
  }
};
