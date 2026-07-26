import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { verifyToken } from '../lib/jwt.js';
import prisma from '../lib/prisma.js';

const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  phone: true,
  createdAt: true,
};

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(AppError.unauthorized('You are not logged in. Please log in to continue.'));
  }

  const decoded = verifyToken(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: SAFE_USER_SELECT,
  });

  if (!user) {
    return next(AppError.unauthorized('The user belonging to this token no longer exists.'));
  }

  req.user = user;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(AppError.forbidden('You do not have permission to perform this action.'));
    }
    next();
  };

export const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies?.token) token = req.cookies.token;
  else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: SAFE_USER_SELECT,
    });
    if (user) req.user = user;
  } catch {
    // Invalid/expired token on an optional-auth route — just proceed as a guest
  }

  next();
});