import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                discountPrice: true,
                stock: true,
                weight: true,
                unit: true,
                mainImage: true,
                active: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: { include: { product: true } } },
      });
    }

    // Calculate totals securely on the backend
    let subtotal = 0;
    const formattedItems = cart.items.map((item) => {
      const activePrice = item.product.discountPrice ? Number(item.product.discountPrice) : Number(item.product.price);
      const itemTotal = activePrice * item.quantity;
      subtotal += itemTotal;

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: activePrice,
        originalPrice: Number(item.product.price),
        itemTotal,
        product: {
          ...item.product,
          price: Number(item.product.price),
          discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
        },
      };
    });

    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 40; // Free shipping over ₹500
    const total = subtotal + shipping;

    return sendSuccess(res, 'Cart fetched successfully.', {
      cartId: cart.id,
      items: formattedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      shippingAmount: shipping,
      total: Math.round(total * 100) / 100,
      itemCount: formattedItems.reduce((acc, item) => acc + item.quantity, 0),
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return sendError(res, 'Valid product ID and positive quantity are required.', 'VALIDATION_ERROR', 400);
    }

    const pId = parseInt(productId, 10);
    const qty = parseInt(quantity, 10);

    const product = await prisma.product.findUnique({
      where: { id: pId },
    });

    if (!product || !product.active) {
      return sendError(res, 'Product not found or currently unavailable.', 'PRODUCT_UNAVAILABLE', 404);
    }

    if (product.stock < qty) {
      return sendError(res, `Only ${product.stock} units available in stock.`, 'INSUFFICIENT_STOCK', 400);
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: pId,
      },
    });

    const activePrice = product.discountPrice ? product.discountPrice : product.price;

    if (existingItem) {
      const newQty = existingItem.quantity + qty;
      if (product.stock < newQty) {
        return sendError(res, `Cannot add more. Only ${product.stock} available.`, 'INSUFFICIENT_STOCK', 400);
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQty,
          price: activePrice,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: pId,
          quantity: qty,
          price: activePrice,
        },
      });
    }

    return sendSuccess(res, 'Product added to cart.');
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cartItemId = parseInt(id, 10);
    const qty = parseInt(quantity, 10);

    if (qty <= 0) {
      return sendError(res, 'Quantity must be greater than 0.', 'VALIDATION_ERROR', 400);
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return sendError(res, 'Cart item not found.', 'NOT_FOUND', 404);
    }

    if (cartItem.product.stock < qty) {
      return sendError(res, `Only ${cartItem.product.stock} items available in stock.`, 'INSUFFICIENT_STOCK', 400);
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: qty },
    });

    return sendSuccess(res, 'Cart item updated.', { cartItem: updated });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartItemId = parseInt(id, 10);

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return sendError(res, 'Cart item not found.', 'NOT_FOUND', 404);
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return sendSuccess(res, 'Item removed from cart.');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return sendSuccess(res, 'Cart cleared successfully.');
  } catch (error) {
    next(error);
  }
};
