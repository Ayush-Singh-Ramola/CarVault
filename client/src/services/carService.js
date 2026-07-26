import api from './api';

export const carService = {
  getCars: (params) => api.get('/cars', { params }),
  getCarBySlug: (slug) => api.get(`/cars/${slug}`),
  createCar: (formData) =>
    api.post('/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCar: (id, formData) =>
    api.patch(`/cars/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCar: (id) => api.delete(`/cars/${id}`),
  deleteCarImage: (carId, imageId) => api.delete(`/cars/${carId}/images/${imageId}`),
};