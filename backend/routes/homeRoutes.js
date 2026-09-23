import express from 'express';
import { getHomePageData, updateHomePageData } from '../controllers/homeController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHomePageData);
router.put('/', protectAdmin, updateHomePageData);

export default router;
