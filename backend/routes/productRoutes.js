import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  updateProductStock
} from '../controllers/productController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// ==========================================
// PUBLIC STOREFRONT ROUTES
// ==========================================

// GET all products with filtering, search, pagination
router.get('/', getProducts);

// GET single product by unique slug (must precede /:id)
router.get('/slug/:slug', getProductBySlug);

// GET single product by MongoDB ID (with slug fallback)
router.get('/:id', getProductById);

// ==========================================
// ADMIN ONLY PROTECTED ROUTES (JWT Required)
// ==========================================

// Create new product
router.post('/', protect, requireAdmin, createProduct);

// Update existing product
router.put('/:id', protect, requireAdmin, updateProduct);

// Soft-delete (archive) or hard delete product
router.delete('/:id', protect, requireAdmin, deleteProduct);

// Toggle product status (active, inactive, archived)
router.patch('/:id/status', protect, requireAdmin, updateProductStatus);

// Update product stock safely
router.patch('/:id/stock', protect, requireAdmin, updateProductStock);

export default router;
