import express from 'express';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../controllers/faqController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getFAQs);
router.post('/', protectAdmin, createFAQ);
router.put('/:id', protectAdmin, updateFAQ);
router.delete('/:id', protectAdmin, deleteFAQ);

export default router;
