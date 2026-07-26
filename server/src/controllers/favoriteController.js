import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as favoriteService from '../services/favoriteService.js';

export const list = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const { cars, meta } = await favoriteService.listFavorites(req.user.id, { page, limit });
  sendSuccess(res, { message: 'Favorites fetched successfully', data: { cars }, meta });
});

export const add = asyncHandler(async (req, res) => {
  await favoriteService.addFavorite(req.user.id, req.params.carId);
  sendSuccess(res, { statusCode: 201, message: 'Car added to favorites' });
});

export const remove = asyncHandler(async (req, res) => {
  await favoriteService.removeFavorite(req.user.id, req.params.carId);
  sendSuccess(res, { message: 'Car removed from favorites' });
});