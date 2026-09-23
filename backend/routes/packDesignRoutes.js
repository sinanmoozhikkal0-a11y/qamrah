import express from 'express';
import {
  getPackDesigns,
  createPackDesign,
  updatePackDesign,
  deletePackDesign
} from '../controllers/packDesignController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPackDesigns);
router.post('/', protectAdmin, createPackDesign);
router.put('/:id', protectAdmin, updatePackDesign);
router.delete('/:id', protectAdmin, deletePackDesign);

export default router;
