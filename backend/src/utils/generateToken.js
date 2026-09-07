import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dairyfresh_jwt_default_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
