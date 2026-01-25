import api from '../utils/api';

export const proposalsService = {
  getProposals: async (params = {}) => {
    const response = await api.get('/proposals', { params });
    return response.data;
  },
  
  getProposal: async (id) => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },
  
  createProposal: async (proposalData) => {
    const response = await api.post('/proposals', proposalData);
    return response.data;
  },
  
  updateProposal: async (id, proposalData) => {
    const response = await api.put(`/proposals/${id}`, proposalData);
    return response.data;
  },
  
  deleteProposal: async (id) => {
    const response = await api.delete(`/proposals/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status, governmentResponse) => {
    const response = await api.post(`/proposals/${id}/status`, { status, governmentResponse });
    return response.data;
  },
};
