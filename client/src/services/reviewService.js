import api from './api';

export const reviewService = {
  getReviewsForCar: (carId, params) => api.get(`/reviews/car/${carId}`, { params }),
  submitReview: (carId, payload) => api.post(`/reviews/car/${carId}`, payload),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};