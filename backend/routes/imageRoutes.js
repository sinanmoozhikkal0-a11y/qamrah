import express from 'express';
import {
  getMediaList,
  getMediaById,
  updateMediaMetadata,
  replaceMedia,
  deleteMedia
} from '../controllers/mediaController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/images
 * @desc    Get all images (supports search, folder filter, pagination)
 * @access  Protected (Admin) or Public for CMS storefront
 */
router.get('/', getMediaList);

/**
 * @route   GET /api/images/:id
 * @desc    Get single image by ID or publicId
 * @access  Protected (Admin)
 */
router.get('/:id', getMediaById);

/**
 * @route   PATCH /api/images/:id
 * @desc    Update image metadata (altText, title, section, folder)
 * @access  Protected (Admin)
 */
router.patch('/:id', protectAdmin, updateMediaMetadata);

/**
 * @route   POST /api/images/replace/:id
 * @desc    Upload replacement image for an existing ID
 * @access  Protected (Admin)
 */
router.post('/replace/:id', protectAdmin, upload.single('image'), replaceMedia);

/**
 * @route   DELETE /api/images/:id
 * @desc    Delete image by ID
 * @access  Protected (Admin)
 */
router.delete('/:id', protectAdmin, deleteMedia);

export default router;
