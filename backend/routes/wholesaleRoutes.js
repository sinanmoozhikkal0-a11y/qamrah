import express from 'express';
import {
  getWholesalePageData,
  updateWholesalePageData,
  createWholesaleEnquiry,
  getWholesaleEnquiries,
  updateWholesaleEnquiryStatus,
  deleteWholesaleEnquiry
} from '../controllers/wholesaleController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getWholesalePageData);
router.put('/', protectAdmin, updateWholesalePageData);
router.post('/enquiries', createWholesaleEnquiry);
router.get('/enquiries', protectAdmin, getWholesaleEnquiries);
router.put('/enquiries/:id', protectAdmin, updateWholesaleEnquiryStatus);
router.delete('/enquiries/:id', protectAdmin, deleteWholesaleEnquiry);

export default router;
