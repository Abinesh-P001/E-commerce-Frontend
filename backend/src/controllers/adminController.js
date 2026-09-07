import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      ordersWithTotals,
      categories,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: 'PENDING' } }),
      prisma.product.count({ where: { stock: { lte: 10 } } }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          payment: true,
        },
      }),
      prisma.order.findMany({
        where: {
          orderStatus: { not: 'CANCELLED' },
        },
        select: {
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
      }),
    ]);

    const totalRevenue = ordersWithTotals.reduce(
      (acc, order) => acc + Number(order.totalAmount),
      0
    );

    // Group sales by month for chart
    const monthlySalesMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Default current year months
    const currentMonth = new Date().getMonth();
    for (let i = Math.max(0, currentMonth - 5); i <= currentMonth; i++) {
      monthlySalesMap[months[i]] = 0;
    }

    ordersWithTotals.forEach((order) => {
      const d = new Date(order.createdAt);
      const mName = months[d.getMonth()];
      if (monthlySalesMap[mName] !== undefined) {
        monthlySalesMap[mName] += Number(order.totalAmount);
      } else {
        monthlySalesMap[mName] = Number(order.totalAmount);
      }
    });

    const salesTrend = Object.keys(monthlySalesMap).map((month) => ({
      month,
      revenue: Math.round(monthlySalesMap[month]),
    }));

    return sendSuccess(res, 'Dashboard analytics fetched successfully.', {
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingOrders,
        lowStockProducts,
      },
      salesTrend,
      categoryDistribution: categories.map((c) => ({
        name: c.name,
        productCount: c._count.products,
      })),
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersAdmin = async (req, res, next) => {
  try {
    // Strictly return only CUSTOMER accounts - Admins are never mixed into customer lists
    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, 'Customers fetched successfully.', { users });
  } catch (error) {
    next(error);
  }
};

export const getAllAdministratorsAdmin = async (req, res, next) => {
  try {
    const administrators = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, 'Administrators fetched successfully.', { administrators });
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Full name, email address, and password are required to create an administrator.', 'VALIDATION_ERROR', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 'EMAIL_EXISTS', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        role: 'ADMIN',
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

    return sendSuccess(res, 'New administrator account created successfully.', { administrator: newAdmin }, 201);
  } catch (error) {
    next(error);
  }
};
