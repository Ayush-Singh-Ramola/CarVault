import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import env from '../config/env.js';
import * as authService from '../services/authService.js';

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  };
}

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  res.cookie('token', token, getCookieOptions());
  sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { user, token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  res.cookie('token', token, getCookieOptions());
  sendSuccess(res, { message: 'Logged in successfully', data: { user, token } });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', getCookieOptions());
  sendSuccess(res, { message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  sendSuccess(res, { message: 'Profile fetched successfully', data: { user } });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateUserProfile(req.user.id, req.body);
  sendSuccess(res, { message: 'Profile updated successfully', data: { user } });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changeUserPassword(req.user.id, req.body);
  sendSuccess(res, { message: 'Password changed successfully' });
});