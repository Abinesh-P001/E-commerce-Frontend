import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin operations
router.post('/', protect, adminOnly, uploadSingle, createCategory);
router.put('/:id', protect, adminOnly, uploadSingle, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
