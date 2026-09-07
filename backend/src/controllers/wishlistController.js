import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: req.user.id },
        include: { items: { include: { product: true } } },
      });
    }

    const items = wishlist.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      product: {
        ...item.product,
        price: Number(item.product.price),
        discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
      },
      createdAt: item.createdAt,
    }));

    return sendSuccess(res, 'Wishlist fetched successfully.', { items });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const pId = parseInt(productId, 10);

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: req.user.id },
      });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: pId,
        },
      },
    });

    if (!existing) {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: pId,
        },
      });
    }

    return sendSuccess(res, 'Product added to wishlist.');
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const pId = parseInt(productId, 10);

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user.id },
    });

    if (wishlist) {
      await prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          productId: pId,
        },
      });
    }

    return sendSuccess(res, 'Product removed from wishlist.');
  } catch (error) {
    next(error);
  }
};
