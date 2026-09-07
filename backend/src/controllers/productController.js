import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const {
      keyword,
      categoryId,
      minPrice,
      maxPrice,
      sort,
      inStock,
      featured,
    } = req.query;

    const where = {
      active: true,
    };

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
        { ingredients: { contains: keyword } },
      ];
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId, 10);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            where: { imageType: { in: ['MAIN', 'GALLERY'] } },
            take: 4,
          },
          _count: {
            select: { reviews: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
    ]);

    const formattedProducts = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
          : 5.0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        stock: p.stock,
        weight: p.weight,
        unit: p.unit,
        mainImage: p.mainImage,
        category: p.category,
        rating: avgRating,
        reviewCount: p._count.reviews,
        active: p.active,
        createdAt: p.createdAt,
      };
    });

    return sendSuccess(res, 'Products fetched successfully.', {
      products: formattedProducts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: {
          orderBy: { imageIndex: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return sendError(res, 'Product not found.', 'PRODUCT_NOT_FOUND', 404);
    }

    // Separate images by type
    const galleryImages = product.images
      .filter((img) => img.imageType === 'GALLERY')
      .map((img) => img.imageUrl);

    const view360Images = product.images
      .filter((img) => img.imageType === 'VIEW_360')
      .sort((a, b) => a.imageIndex - b.imageIndex)
      .map((img) => ({
        id: img.id,
        index: img.imageIndex,
        url: img.imageUrl,
      }));

    const avgRating =
      product.reviews.length > 0
        ? Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1))
        : 5.0;

    // Fetch up to 4 related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        active: true,
      },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        discountPrice: true,
        mainImage: true,
        weight: true,
        unit: true,
        stock: true,
      },
    });

    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
      stock: product.stock,
      weight: product.weight,
      unit: product.unit,
      ingredients: product.ingredients,
      nutrition: product.nutrition,
      storageInstructions: product.storageInstructions,
      deliveryInformation: product.deliveryInformation,
      mainImage: product.mainImage,
      galleryImages,
      view360Images,
      category: product.category,
      reviews: product.reviews,
      rating: avgRating,
      reviewCount: product.reviews.length,
      relatedProducts: relatedProducts.map((rp) => ({
        ...rp,
        price: Number(rp.price),
        discountPrice: rp.discountPrice ? Number(rp.discountPrice) : null,
      })),
      active: product.active,
      createdAt: product.createdAt,
    };

    return sendSuccess(res, 'Product details fetched successfully.', {
      product: formattedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      weight,
      unit,
      ingredients,
      nutrition,
      storageInstructions,
      deliveryInformation,
      categoryId,
      mainImage,
    } = req.body;

    if (!name || !description || !price || !weight || !categoryId) {
      return sendError(
        res,
        'Name, description, price, weight, and categoryId are required.',
        'VALIDATION_ERROR',
        400
      );
    }

    const slug = `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now().toString().slice(-4)}`;

    let finalMainImage = mainImage || '/images/default-dairy.jpg';
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      finalMainImage = `/uploads/${req.files.mainImage[0].filename}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock || 0, 10),
        weight,
        unit: unit || 'ml',
        ingredients: ingredients || null,
        nutrition: nutrition || null,
        storageInstructions: storageInstructions || null,
        deliveryInformation: deliveryInformation || null,
        mainImage: finalMainImage,
        categoryId: parseInt(categoryId, 10),
      },
    });

    // If gallery images were attached
    if (req.files && req.files.galleryImages) {
      const galleryData = req.files.galleryImages.map((file, idx) => ({
        productId: product.id,
        imageUrl: `/uploads/${file.filename}`,
        imageIndex: idx,
        imageType: 'GALLERY',
      }));

      await prisma.productImage.createMany({ data: galleryData });
    }

    return sendSuccess(res, 'Product created successfully.', { product }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      weight,
      unit,
      ingredients,
      nutrition,
      storageInstructions,
      deliveryInformation,
      categoryId,
      active,
      mainImage,
    } = req.body;

    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (discountPrice !== undefined) data.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    if (stock !== undefined) data.stock = parseInt(stock, 10);
    if (weight) data.weight = weight;
    if (unit) data.unit = unit;
    if (ingredients !== undefined) data.ingredients = ingredients;
    if (nutrition !== undefined) data.nutrition = nutrition;
    if (storageInstructions !== undefined) data.storageInstructions = storageInstructions;
    if (deliveryInformation !== undefined) data.deliveryInformation = deliveryInformation;
    if (categoryId) data.categoryId = parseInt(categoryId, 10);
    if (active !== undefined) data.active = Boolean(active);

    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      data.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
    } else if (mainImage) {
      data.mainImage = mainImage;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return sendSuccess(res, 'Product updated successfully.', { product });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return sendError(res, 'Valid stock quantity is required.', 'VALIDATION_ERROR', 400);
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: { stock: parseInt(stock, 10) },
    });

    return sendSuccess(res, 'Stock updated successfully.', { product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id, 10) },
    });

    return sendSuccess(res, 'Product deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const upload360Images = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return sendError(res, 'Product not found.', 'PRODUCT_NOT_FOUND', 404);
    }

    if (!req.files || req.files.length === 0) {
      return sendError(res, 'Please provide image files for the 360 sequence.', 'VALIDATION_ERROR', 400);
    }

    // Sort files alphabetically or by numerical sequence in originalname
    const sortedFiles = [...req.files].sort((a, b) =>
      a.originalname.localeCompare(b.originalname, undefined, { numeric: true, sensitivity: 'base' })
    );

    // Remove existing 360 images for this product if replacing
    if (req.body.replace === 'true') {
      await prisma.productImage.deleteMany({
        where: { productId, imageType: 'VIEW_360' },
      });
    }

    const imageRecords = sortedFiles.map((file, index) => ({
      productId,
      imageUrl: `/uploads/${file.filename}`,
      imageIndex: index + 1,
      imageType: 'VIEW_360',
    }));

    await prisma.productImage.createMany({
      data: imageRecords,
    });

    const updated360 = await prisma.productImage.findMany({
      where: { productId, imageType: 'VIEW_360' },
      orderBy: { imageIndex: 'asc' },
    });

    return sendSuccess(res, '360° product images uploaded successfully.', {
      images: updated360,
    });
  } catch (error) {
    next(error);
  }
};
