import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken } from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required.', 'VALIDATION_ERROR', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return sendError(res, 'A user with this email address already exists.', 'EMAIL_EXISTS', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If first user in database, grant ADMIN role
    const totalUsers = await prisma.user.count();
    const assignedRole = totalUsers === 0 ? 'ADMIN' : 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        role: assignedRole,
        cart: {
          create: {},
        },
        wishlist: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    const token = generateToken({ id: user.id, role: user.role });

    return sendSuccess(
      res,
      'Registration successful. Welcome to DairyFresh!',
      {
        user,
        token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide both email and password.', 'VALIDATION_ERROR', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return sendError(res, 'Invalid email or password.', 'INVALID_CREDENTIALS', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 'INVALID_CREDENTIALS', 401);
    }

    const token = generateToken({ id: user.id, role: user.role });

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, 'Login successful.', {
      user: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide both administrator email and password.', 'VALIDATION_ERROR', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return sendError(res, 'Invalid administrator credentials.', 'INVALID_CREDENTIALS', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid administrator credentials.', 'INVALID_CREDENTIALS', 401);
    }

    if (user.role !== 'ADMIN') {
      return sendError(res, 'Access denied. You do not have administrator privileges.', 'FORBIDDEN', 403);
    }

    const token = generateToken({ id: user.id, role: user.role });

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, 'Administrator authenticated successfully.', {
      user: userResponse,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  return sendSuccess(res, 'Logged out successfully.');
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        addresses: true,
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return sendError(res, 'User not found.', 'USER_NOT_FOUND', 404);
    }

    return sendSuccess(res, 'User profile fetched successfully.', { user });
  } catch (error) {
    next(error);
  }
};
