import api from '../utils/api';

export const videoService = {
  getVideos: async () => {
    const response = await api.get('/video/feed');
    return response.data;
  },
  
  getVideoById: async (id: string) => {
    const response = await api.get(`/video/${id}`);
    return response.data;
  },
  
  incrementViews: async (id: string) => {
    const response = await api.post(`/video/${id}/view`);
    return response.data;
  },
  
  getTrendingVideos: async () => {
    const response = await api.get('/video/trending');
    return response.data;
  },
  
  getSubscriptionVideos: async () => {
    const response = await api.get('/video/subscriptions');
    return response.data;
  },
  
  searchVideos: async (keyword: string) => {
    const response = await api.get(`/video/feed?keyword=${keyword}`);
    return response.data;
  },
  getShorts: async () => {
    const response = await api.get('/video/feed?videoType=short');
    return response.data;
  },
  uploadVideo: async (formData: FormData) => {
    const response = await api.post('/video/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
