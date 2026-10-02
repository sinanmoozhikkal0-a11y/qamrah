import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Private authenticated endpoints
router.get('/me', protect, getMe);

// Admin-only protected test route (for authorization verification)
router.get('/admin-check', protect, requireAdmin, (req, res) => {
  return sendSuccess(res, 'Admin access granted.', {
    admin: true,
    user: req.user.email
  });
});

export default router;
