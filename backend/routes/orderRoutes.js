import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelMyOrder
} from '../controllers/orderController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// ==========================================
// CUSTOMER PROTECTED ROUTES (JWT Required)
// ==========================================

// Create new order (decrements inventory, calculates totals on server)
router.post('/', protect, createOrder);

// Get current customer's orders (must precede /:id)
router.get('/my-orders', protect, getMyOrders);

// Customer cancels their own eligible pending/confirmed order (restores inventory)
router.patch('/:id/cancel', protect, cancelMyOrder);

// ==========================================
// ADMIN ONLY ROUTES (JWT + Admin Role)
// ==========================================

// List all orders with filters & pagination
router.get('/', protect, requireAdmin, getAllOrders);

// Admin updates order fulfillment status
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);

// Admin updates payment status
router.patch('/:id/payment-status', protect, requireAdmin, updatePaymentStatus);

// ==========================================
// SHARED PROTECTED ROUTE
// ==========================================

// Get single order by MongoDB ID or orderId string (Customer gets own, Admin gets any)
router.get('/:id', protect, getOrderById);

export default router;
