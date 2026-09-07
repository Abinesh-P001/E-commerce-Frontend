import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  upload360Images,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadFields, uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, adminOnly, uploadFields, createProduct);
router.put('/:id', protect, adminOnly, uploadFields, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/stock', protect, adminOnly, updateStock);
router.post('/:id/360-images', protect, adminOnly, uploadMultiple, upload360Images);

export default router;
