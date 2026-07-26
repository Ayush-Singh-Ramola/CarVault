import api from './api';

export const favoriteService = {
  getFavorites: (params) => api.get('/favorites', { params }),
  addFavorite: (carId) => api.post(`/favorites/${carId}`),
  removeFavorite: (carId) => api.delete(`/favorites/${carId}`),
};