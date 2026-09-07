import crypto from 'crypto';
import Razorpay from 'razorpay';
import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const oId = parseInt(orderId, 10);

    const order = await prisma.order.findUnique({
      where: { id: oId },
      include: { payment: true },
    });

    if (!order) {
      return sendError(res, 'Order not found.', 'NOT_FOUND', 404);
    }

    if (order.userId !== req.user.id) {
      return sendError(res, 'Unauthorized.', 'FORBIDDEN', 403);
    }

    const amountInPaise = Math.round(Number(order.totalAmount) * 100);

    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_order_${order.id}`,
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);

      await prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          razorpayOrderId: razorpayOrder.id,
          amount: order.totalAmount,
        },
        create: {
          orderId: order.id,
          razorpayOrderId: razorpayOrder.id,
          amount: order.totalAmount,
          paymentMethod: 'RAZORPAY',
          paymentStatus: 'PENDING',
        },
      });

      return sendSuccess(res, 'Razorpay order created.', {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
      });
    } else {
      // Mock / Dev fallback
      const mockRazorpayOrderId = `order_mock_${Date.now()}`;

      await prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          razorpayOrderId: mockRazorpayOrderId,
          amount: order.totalAmount,
          paymentMethod: 'ONLINE_MOCK',
        },
        create: {
          orderId: order.id,
          razorpayOrderId: mockRazorpayOrderId,
          amount: order.totalAmount,
          paymentMethod: 'ONLINE_MOCK',
          paymentStatus: 'PENDING',
        },
      });

      return sendSuccess(res, 'Mock payment order initialized (Dev Mode).', {
        razorpayOrderId: mockRazorpayOrderId,
        amount: amountInPaise,
        currency: 'INR',
        key: 'rzp_test_mock_key',
        orderId: order.id,
        isMock: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const oId = parseInt(orderId, 10);

    const order = await prisma.order.findUnique({
      where: { id: oId },
    });

    if (!order) {
      return sendError(res, 'Order not found.', 'NOT_FOUND', 404);
    }

    if (razorpayInstance && process.env.RAZORPAY_KEY_SECRET) {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        await prisma.order.update({
          where: { id: oId },
          data: { paymentStatus: 'FAILED' },
        });
        await prisma.payment.update({
          where: { orderId: oId },
          data: { paymentStatus: 'FAILED' },
        });
        return sendError(res, 'Payment signature verification failed.', 'PAYMENT_VERIFICATION_FAILED', 400);
      }
    }

    // Payment success
    await prisma.$transaction([
      prisma.order.update({
        where: { id: oId },
        data: {
          orderStatus: 'CONFIRMED',
          paymentStatus: 'COMPLETED',
        },
      }),
      prisma.payment.update({
        where: { orderId: oId },
        data: {
          razorpayPaymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
          paymentStatus: 'COMPLETED',
        },
      }),
    ]);

    return sendSuccess(res, 'Payment verified successfully. Order confirmed!');
  } catch (error) {
    next(error);
  }
};
