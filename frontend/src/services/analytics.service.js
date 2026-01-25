import api from '../utils/api';

export const analyticsService = {
  getDashboardData: async (params = {}) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },
  
  getProposalAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/proposals', { params });
    return response.data;
  },
  
  getFeedbackAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/feedback', { params });
    return response.data;
  },
  
  getEngagementMetrics: async (period = 'monthly') => {
    const response = await api.get('/analytics/engagement', { params: { period } });
    return response.data;
  },
  
  getSentimentAnalysis: async (params = {}) => {
    const response = await api.get('/analytics/sentiment', { params });
    return response.data;
  },
};
