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

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
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
  
  uploadVideo: async (formData: FormData) => {
    const response = await api.post('/admin/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllReports: async () => {
    const response = await api.get('/admin/reports/all');
    return response.data;
  },

  resolveReport: async (id: string, status: string) => {
    const response = await api.put(`/admin/reports/${id}/resolve`, { status });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  addCategory: async (data: any) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: any) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  getAnnouncements: async () => {
    const response = await api.get('/admin/announcements');
    return response.data;
  },

  createAnnouncement: async (data: any) => {
    const response = await api.post('/admin/announcements', data);
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (data: any) => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  },

  getComments: async () => {
    const response = await api.get('/admin/comments');
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await api.delete(`/admin/comments/${id}`);
    return response.data;
  },

  getCreatorApplications: async () => {
    const response = await api.get('/admin/creator-applications');
    return response.data;
  },

  updateCreatorApplication: async (id: string, status: string) => {
    const response = await api.put(`/admin/creator-applications/${id}`, { status });
    return response.data;
  },

  getChannels: async () => {
    const response = await api.get('/admin/channels');
    return response.data;
  },
  
  getStorageStats: async () => {
    const response = await api.get('/admin/storage');
    return response.data;
  },

  getWithdrawals: async () => {
    const response = await api.get('/admin/withdrawals');
    return response.data;
  },

  updateWithdrawalStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/withdrawals/${id}`, { status });
    return response.data;
  }
};
