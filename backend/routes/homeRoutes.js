import { Router } from 'express';
import { getHomePage, updateHomePage } from '../controllers/homeController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getHomePage);
router.put('/', protect, requireAdmin, updateHomePage);

export default router;
