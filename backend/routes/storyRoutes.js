import express from 'express';
import { getStoryPageData, updateStoryPageData } from '../controllers/storyController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getStoryPageData);
router.put('/', protectAdmin, updateStoryPageData);

export default router;
