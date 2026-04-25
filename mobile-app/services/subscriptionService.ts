import api from '../utils/api';

export const subscriptionService = {
  getSubscribedChannels: async () => {
    const response = await api.get('/subscribe/channels');
    return response.data;
  },

  getSubscriptionVideos: async () => {
    const response = await api.get('/subscribe/videos');
    return response.data;
  },

  toggleSubscribe: async (channelId: string) => {
    const response = await api.post(`/subscribe/${channelId}`);
    return response.data;
  }
};
