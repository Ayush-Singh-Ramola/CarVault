import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as reviewService from '../services/reviewService.js';

export const listForCar = asyncHandler(async (req, res) => {
  const { reviews, meta } = await reviewService.listReviewsForCar(req.params.carId, req.query);
  sendSuccess(res, { message: 'Reviews fetched successfully', data: { reviews }, meta });
});

export const upsert = asyncHandler(async (req, res) => {
  const review = await reviewService.upsertReview(req.user.id, req.params.carId, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Review submitted successfully', data: { review } });
});

export const remove = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.user.id, req.params.id, req.user.role === 'ADMIN');
  sendSuccess(res, { message: 'Review deleted successfully' });
});