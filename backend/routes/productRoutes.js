import express from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductByIdOrSlug);
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
