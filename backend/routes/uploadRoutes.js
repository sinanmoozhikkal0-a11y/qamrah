import { Router } from 'express';
import { uploadImage, deleteImage, getMediaList } from '../controllers/uploadController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Retrieve all media assets (Protected for Admins)
router.get('/', protect, requireAdmin, getMediaList);

// Upload image to Cloudinary (Protected for Admins)
router.post('/image', protect, requireAdmin, upload.single('image'), uploadImage);
router.post('/', protect, requireAdmin, upload.single('image'), uploadImage);

// Delete image from Cloudinary (Protected for Admins)
router.delete('/image/*', protect, requireAdmin, deleteImage);
router.delete('/:id', protect, requireAdmin, deleteImage);
router.delete('/', protect, requireAdmin, deleteImage);

export default router;
