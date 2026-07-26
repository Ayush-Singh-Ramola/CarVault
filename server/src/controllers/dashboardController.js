import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as dashboardService from '../services/dashboardService.js';

export const getOverview = asyncHandler(async (req, res) => {
  const overview = await dashboardService.getDashboardOverview();
  sendSuccess(res, { message: 'Dashboard data fetched successfully', data: overview });
});