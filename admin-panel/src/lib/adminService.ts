import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  getRecentVideos: async () => {
    const response = await api.get('/admin/recent-videos');
    return response.data;
  },
  
  getRecentUsers: async () => {
    const response = await api.get('/admin/recent-users');
    return response.data;
  },
  
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },
  
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  toggleUserBan: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/ban`);
    return response.data;
  },

  getAllVideos: async () => {
    const response = await api.get('/admin/videos');
    return response.data;
  },

  deleteVideo: async (id: string) => {
    const response = await api.delete(`/admin/videos/${id}`);
    return response.data;
  },

  getAllReports: async () => {
    const response = await api.get('/admin/reports/all');
    return response.data;
  },

  resolveReport: async (id: string, status: string) => {
    const response = await api.put(`/admin/reports/${id}/resolve`, { status });
    return response.data;
  }
};
