import api from '../utils/api';

export const commentService = {
  getVideoComments: async (videoId: string) => {
    const response = await api.get(`/comment/${videoId}`);
    return response.data;
  },

  addComment: async (videoId: string, text: string, parentCommentId?: string) => {
    const response = await api.post('/comment/add', { videoId, text, parentCommentId });
    return response.data;
  },

  likeComment: async (commentId: string) => {
    const response = await api.post(`/comment/${commentId}/like`);
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/comment/${commentId}`);
    return response.data;
  },

  reportComment: async (commentId: string, reason: string) => {
    const response = await api.post(`/comment/${commentId}/report`, { reason });
    return response.data;
  },

  getCommentReplies: async (commentId: string) => {
    const response = await api.get(`/comment/replies/${commentId}`);
    return response.data;
  }
};
