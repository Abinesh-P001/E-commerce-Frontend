import { sendError } from '../utils/responseFormatter.js';

export const notFoundHandler = (req, res, next) => {
  return sendError(res, `Route not found - ${req.originalUrl}`, 'NOT_FOUND', 404);
};

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target})` : '';
    return sendError(res, `A record with this field already exists${target}.`, 'DUPLICATE_ENTRY', 409);
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return sendError(res, 'Requested record was not found.', 'RECORD_NOT_FOUND', 404);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token.', 'INVALID_TOKEN', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired. Please log in again.', 'TOKEN_EXPIRED', 401);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 'File size exceeds allowed limit (10MB max).', 'FILE_TOO_LARGE', 400);
  }

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || 'An internal server error occurred.';
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

  return sendError(res, message, errorCode, statusCode);
};
