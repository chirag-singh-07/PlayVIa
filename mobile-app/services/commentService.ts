import api from '../utils/api';

export const commentService = {
  getVideoComments: async (videoId: string) => {
    const response = await api.get(`/comment/${videoId}`);
    return response.data;
  },

  addComment: async (videoId: string, text: string) => {
    const response = await api.post('/comment', { videoId, text });
    return response.data;
  },

  likeComment: async (commentId: string) => {
    const response = await api.post(`/comment/like/${commentId}`);
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/comment/${commentId}`);
    return response.data;
  }
};
