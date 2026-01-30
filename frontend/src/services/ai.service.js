import api from '../utils/api';

export const aiService = {
  generateSummary: async (text) => {
    const response = await api.post('/ai/summary', { text });
    return response.data;
  },
  
  analyzeText: async (text) => {
    const response = await api.post('/ai/analyze', { text });
    return response.data;
  },

  generateIssueDescription: async (prompt) => {
    const response = await api.post('/ai/generate-issue-description', { prompt });
    return response.data;
  },
};
