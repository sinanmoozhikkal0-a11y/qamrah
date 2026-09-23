import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/dashboard/stats', protectAdmin, getDashboardStats);
router.get('/', protectAdmin, getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', protectAdmin, updateOrderStatus);

export default router;
