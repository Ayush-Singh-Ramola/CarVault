import env from '../config/env.js';
import AppError from '../utils/AppError.js';

function normalizeError(err) {
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'field';
    return AppError.conflict(`A record with this ${field} already exists`);
  }

  if (err.code === 'P2025') {
    return AppError.notFound('Record not found');
  }

  if (err.code === 'P2003') {
    return AppError.badRequest('Invalid reference to a related record');
  }

  if (err.name === 'JsonWebTokenError') {
    return AppError.unauthorized('Invalid authentication token');
  }
  if (err.name === 'TokenExpiredError') {
    return AppError.unauthorized('Your session has expired, please log in again');
  }

  if (err.name === 'ZodError') {
    const message = err.errors?.map((e) => e.message).join('; ') || 'Validation failed';
    return AppError.badRequest(message);
  }

  if (err.name === 'MulterError') {
    return AppError.badRequest(`File upload error: ${err.message}`);
  }

  return err;
}

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const normalized = normalizeError(err);

  const statusCode = normalized.statusCode || 500;
  const isOperational = normalized.isOperational || false;

  if (!isOperational || statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} -`, err);
  }

  const responseBody = {
    success: false,
    message: isOperational ? normalized.message : 'Internal server error',
  };

  if (env.NODE_ENV === 'development') {
    responseBody.stack = err.stack;
    responseBody.rawMessage = err.message;
  }

  res.status(statusCode).json(responseBody);
}