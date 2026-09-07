import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return sendSuccess(res, 'Categories fetched successfully.', { categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        products: {
          where: { active: true },
          include: {
            images: {
              where: { imageType: 'MAIN' },
            },
          },
        },
      },
    });

    if (!category) {
      return sendError(res, 'Category not found.', 'CATEGORY_NOT_FOUND', 404);
    }

    return sendSuccess(res, 'Category fetched successfully.', { category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return sendError(res, 'Category name is required.', 'VALIDATION_ERROR', 400);
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: req.file ? `/uploads/${req.file.filename}` : (image || null),
      },
    });

    return sendSuccess(res, 'Category created successfully.', { category }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const data = {};
    if (name) {
      data.name = name;
      data.slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) data.description = description;
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    } else if (image !== undefined) {
      data.image = image;
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id, 10) },
      data,
    });

    return sendSuccess(res, 'Category updated successfully.', { category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id, 10) },
    });

    return sendSuccess(res, 'Category deleted successfully.');
  } catch (error) {
    next(error);
  }
};
