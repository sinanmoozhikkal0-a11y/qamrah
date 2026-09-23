import express from 'express';
import { uploadMedia, deleteMedia } from '../controllers/mediaController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/uploads/image
 * @desc    Upload an image to Cloudinary and save to MongoDB
 * @access  Protected (Admin)
 */
router.post('/image', protectAdmin, upload.single('image'), uploadMedia);

/**
 * @route   DELETE /api/uploads/image/*
 * @desc    Delete an image by Cloudinary publicId or MongoDB ID
 * @access  Protected (Admin)
 */
router.delete('/image/*', protectAdmin, (req, res, next) => {
  // Capture full path following /image/ including slashes (e.g. qamrah/media/filename)
  const fullPublicId = req.params[0];
  req.params.publicId = fullPublicId;
  return deleteMedia(req, res, next);
});

export default router;
