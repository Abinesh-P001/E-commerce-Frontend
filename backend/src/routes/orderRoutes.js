import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order endpoints require login

// Customer order routes
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin order routes
router.get('/admin/all', adminOnly, getAllOrdersAdmin);
router.put('/:id/status', adminOnly, updateOrderStatusAdmin);

export default router;
