import express from 'express';
import {
  uploadMedia,
  getMediaList,
  getMediaById,
  updateMediaMetadata,
  deleteMedia,
  replaceMedia
} from '../controllers/mediaController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protectAdmin, upload.single('image'), uploadMedia);
router.get('/', protectAdmin, getMediaList);
router.get('/:id', protectAdmin, getMediaById);
router.put('/:id', protectAdmin, updateMediaMetadata);
router.patch('/:id', protectAdmin, updateMediaMetadata);
router.post('/:id/replace', protectAdmin, upload.single('image'), replaceMedia);
router.delete('/:id', protectAdmin, deleteMedia);

export default router;
