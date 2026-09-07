import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { sendError } from '../utils/responseFormatter.js';

export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please log in.', 'UNAUTHORIZED', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dairyfresh_jwt_default_secret');

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    if (!user) {
      return sendError(res, 'User associated with this token no longer exists.', 'USER_NOT_FOUND', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token.', 'INVALID_TOKEN', 401);
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }
  return sendError(res, 'Access denied. Administrator privileges required.', 'FORBIDDEN', 403);
};
