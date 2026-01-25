import api from '../utils/api';

export const uploadService = {
  uploadSingle: async (file, folder = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadMultiple: async (formData) => {
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getPresignedUrl: async (fileName, contentType, folder = 'uploads') => {
    const response = await api.post('/upload/presigned-url', {
      fileName,
      contentType,
      folder,
    });
    return response.data;
  },
  
  deleteFile: async (fileUrl) => {
    const response = await api.delete('/upload', { data: { fileUrl } });
    return response.data;
  },
};
