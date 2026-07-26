import api from './api';

export const brandService = {
  getBrands: () => api.get('/brands'),
};
