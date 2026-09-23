import express from 'express';
import {
  getContactPageData,
  updateContactPageData,
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage
} from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getContactPageData);
router.put('/', protectAdmin, updateContactPageData);
router.post('/messages', createContactMessage);
router.get('/messages', protectAdmin, getContactMessages);
router.put('/messages/:id', protectAdmin, updateContactMessageStatus);
router.delete('/messages/:id', protectAdmin, deleteContactMessage);

export default router;
