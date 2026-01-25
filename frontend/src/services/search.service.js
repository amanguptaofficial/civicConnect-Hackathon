import api from '../utils/api';

export const searchService = {
  globalSearch: async (query, params = {}) => {
    const response = await api.get('/search', { params: { q: query, ...params } });
    return response.data;
  },
};
