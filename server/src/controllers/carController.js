import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as carService from '../services/carService.js';
import { processUploadedFiles } from '../services/uploadService.js';

export const list = asyncHandler(async (req, res) => {
  const { cars, meta } = await carService.listCars(req.query, req.user?.id);
  sendSuccess(res, { message: 'Cars fetched successfully', data: { cars }, meta });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const car = await carService.getCarBySlugOrId(req.params.slug, req.user?.id);
  sendSuccess(res, { message: 'Car fetched successfully', data: { car } });
});

export const create = asyncHandler(async (req, res) => {
  const uploadedImages = await processUploadedFiles(req.files);
  const car = await carService.createCar(req.body, uploadedImages);
  sendSuccess(res, { statusCode: 201, message: 'Car created successfully', data: { car } });
});

export const update = asyncHandler(async (req, res) => {
  const uploadedImages = await processUploadedFiles(req.files);
  const car = await carService.updateCar(req.params.id, req.body, uploadedImages);
  sendSuccess(res, { message: 'Car updated successfully', data: { car } });
});

export const remove = asyncHandler(async (req, res) => {
  await carService.deleteCar(req.params.id);
  sendSuccess(res, { message: 'Car deleted successfully' });
});

export const deleteImage = asyncHandler(async (req, res) => {
  await carService.deleteCarImage(req.params.id, req.params.imageId);
  sendSuccess(res, { message: 'Image deleted successfully' });
});