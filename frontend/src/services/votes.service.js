import api from '../utils/api';

export const votesService = {
  createVote: async (voteData) => {
    const response = await api.post('/votes', voteData);
    return response.data;
  },
  
  removeVote: async (id) => {
    const response = await api.delete(`/votes/${id}`);
    return response.data;
  },
  
  getUserVotes: async (userId, type) => {
    const response = await api.get(`/votes/user/${userId}`, { params: { type } });
    return response.data;
  },
};
