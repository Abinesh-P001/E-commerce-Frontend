import express from 'express';
import {
  getDashboardAnalytics,
  getAllUsersAdmin,
  getAllAdministratorsAdmin,
  createAdminUser,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/analytics', getDashboardAnalytics);
router.get('/users', getAllUsersAdmin);
router.get('/administrators', getAllAdministratorsAdmin);
router.post('/create-admin', createAdminUser);

export default router;
