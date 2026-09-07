import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId, 10) },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, 'Reviews fetched successfully.', { reviews });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const pId = parseInt(productId, 10);
    const score = parseInt(rating, 10);

    if (!score || score < 1 || score > 5) {
      return sendError(res, 'Rating must be between 1 and 5 stars.', 'VALIDATION_ERROR', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: pId },
    });

    if (!product) {
      return sendError(res, 'Product not found.', 'NOT_FOUND', 404);
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId: pId,
        rating: score,
        comment: comment || null,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return sendSuccess(res, 'Review submitted successfully.', { review }, 201);
  } catch (error) {
    next(error);
  }
};
