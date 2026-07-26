import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as brandService from '../services/brandService.js';

export const list = asyncHandler(async (req, res) => {
  const brands = await brandService.listBrands();
  sendSuccess(res, { message: 'Brands fetched successfully', data: { brands } });
});