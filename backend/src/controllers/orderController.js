import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const createOrder = async (req, res, next) => {
  try {
    const { addressId, paymentMethod = 'COD' } = req.body;

    if (!addressId) {
      return sendError(res, 'Delivery address is required.', 'VALIDATION_ERROR', 400);
    }

    // Run order placement atomically inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify address
      const address = await tx.address.findFirst({
        where: { id: parseInt(addressId, 10), userId: req.user.id },
      });

      if (!address) {
        throw new Error('Selected delivery address was not found.');
      }

      // 2. Fetch cart with items
      const cart = await tx.cart.findUnique({
        where: { userId: req.user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error('Your cart is empty.');
      }

      // 3. Validate stock & calculate totals from DB prices
      let subtotal = 0;
      for (const item of cart.items) {
        if (!item.product.active) {
          throw new Error(`Product "${item.product.name}" is no longer active.`);
        }
        if (item.product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${item.product.name}". Only ${item.product.stock} available.`
          );
        }

        const price = item.product.discountPrice ? Number(item.product.discountPrice) : Number(item.product.price);
        subtotal += price * item.quantity;
      }

      const shipping = subtotal > 500 ? 0 : 40;
      const discount = 0;
      const totalAmount = subtotal + shipping - discount;

      // 4. Create Order
      const initialStatus = paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING';
      const initialPaymentStatus = paymentMethod === 'COD' ? 'PENDING' : 'PENDING';

      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          addressId: address.id,
          totalAmount,
          shippingAmount: shipping,
          discountAmount: discount,
          orderStatus: initialStatus,
          paymentStatus: initialPaymentStatus,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.discountPrice ? item.product.discountPrice : item.product.price,
            })),
          },
          payment: {
            create: {
              amount: totalAmount,
              paymentMethod,
              paymentStatus: initialPaymentStatus,
            },
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, mainImage: true },
              },
            },
          },
          address: true,
          payment: true,
        },
      });

      // 5. Decrement stock for all ordered products
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 6. Clear user cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    return sendSuccess(res, 'Order placed successfully!', { order: result }, 201);
  } catch (error) {
    return sendError(res, error.message, 'ORDER_CREATION_FAILED', 400);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                mainImage: true,
                weight: true,
                unit: true,
              },
            },
          },
        },
        address: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, 'Orders fetched successfully.', { orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderId = parseInt(id, 10);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      return sendError(res, 'Order not found.', 'ORDER_NOT_FOUND', 404);
    }

    // Only owner or admin can view
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return sendError(res, 'Unauthorized to view this order.', 'FORBIDDEN', 403);
    }

    return sendSuccess(res, 'Order details fetched successfully.', { order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, suggestion } = req.body;
    const orderId = parseInt(id, 10);

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new Error('Order not found.');
      }

      if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
        throw new Error('Unauthorized to cancel this order.');
      }

      if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.orderStatus)) {
        throw new Error(`Order cannot be cancelled in "${order.orderStatus}" status.`);
      }

      // Restore inventory
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: 'CANCELLED',
          cancelReason: reason || 'Customer requested cancellation',
          cancelSuggestion: suggestion || null,
        },
      });

      return updated;
    });

    return sendSuccess(res, 'Order cancelled successfully.', { order: result });
  } catch (error) {
    return sendError(res, error.message, 'ORDER_CANCEL_FAILED', 400);
  }
};

// Admin Endpoints
export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const where = {};
    if (status) {
      where.orderStatus = status;
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          address: true,
          items: {
            include: {
              product: {
                select: { id: true, name: true, mainImage: true },
              },
            },
          },
          payment: true,
        },
      }),
    ]);

    return sendSuccess(res, 'Admin orders fetched successfully.', {
      orders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const orderId = parseInt(id, 10);

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 'VALIDATION_ERROR', 400);
    }

    const data = {};
    if (status) data.orderStatus = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
        payment: true,
      },
    });

    if (paymentStatus && updated.payment) {
      await prisma.payment.update({
        where: { orderId },
        data: { paymentStatus },
      });
    }

    return sendSuccess(res, 'Order status updated successfully.', { order: updated });
  } catch (error) {
    next(error);
  }
};
