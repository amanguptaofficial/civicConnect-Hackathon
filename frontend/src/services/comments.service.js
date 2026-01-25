import api from '../utils/api';

export const commentsService = {
  getComments: async (params = {}) => {
    const response = await api.get('/comments', { params });
    return response.data;
  },
  
  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },
  
  updateComment: async (id, content) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },
  
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};
