import api from '../utils/api';

export const feedbackService = {
  getFeedback: async (params = {}) => {
    const response = await api.get('/feedback', { params });
    return response.data;
  },
  
  getFeedbackItem: async (id) => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },
  
  createFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },
  
  updateFeedback: async (id, feedbackData) => {
    const response = await api.put(`/feedback/${id}`, feedbackData);
    return response.data;
  },
  
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },
  
  updateFeedbackStatus: async (id, status) => {
    const response = await api.put(`/feedback/${id}/status`, { status });
    return response.data;
  },
};
