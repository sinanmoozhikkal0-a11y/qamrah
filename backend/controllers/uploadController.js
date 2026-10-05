import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl
} from '../config/cloudinary.js';
import Media from '../models/Media.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @route   GET /api/uploads
 * @desc    Get all uploaded media assets from database
 * @access  Private (Admin only)
 */
export const getMediaList = async (_req, res) => {
  try {
    const items = await Media.find({}).sort({ createdAt: -1 }).limit(100);
    return sendSuccess(res, 'Media list retrieved successfully.', items);
  } catch (error) {
    console.error('❌ [getMediaList Error]:', error.message);
    return sendError(res, 'Failed to fetch media assets: ' + error.message, 500);
  }
};

/**
 * @route   POST /api/uploads/image or POST /api/uploads
 * @desc    Upload an image file to Cloudinary and store metadata in MongoDB
 * @access  Private (Admin only)
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'No image file provided for upload.', 400);
    }

    const rawFolder = req.body.folder || 'products';
    const folder = rawFolder.startsWith('qamrah')
      ? rawFolder
      : `qamrah/${rawFolder.replace(/^\/+/, '')}`;

    const source = req.file.buffer || req.file.path;
    const result = await uploadImageToCloudinary(source, {
      folder
    });

    let mediaDoc = null;
    try {
      mediaDoc = await Media.create({
        url: result.secure_url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        publicId: result.public_id,
        filename: req.file.originalname,
        originalFilename: req.file.originalname,
        folder,
        section: req.body.section || 'product',
        format: result.format || '',
        size: req.file.size || 0,
        width: result.width || 0,
        height: result.height || 0,
        storageType: 'cloudinary'
      });
    } catch (mediaErr) {
      console.warn('[Upload] Notice logging media document to MongoDB:', mediaErr.message);
    }

    return sendSuccess(res, 'Image uploaded successfully to Cloudinary.', {
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      mediaId: mediaDoc?._id
    }, 201);
  } catch (error) {
    console.error('❌ [uploadImage Error]:', error.message);
    return sendError(res, 'Failed to upload image to Cloudinary: ' + error.message, 500);
  }
};

/**
 * @route   DELETE /api/uploads/image/* or DELETE /api/uploads/:id or DELETE /api/uploads
 * @desc    Delete an image from Cloudinary by public_id or image URL or MongoDB ID
 * @access  Private (Admin only)
 */
export const deleteImage = async (req, res) => {
  try {
    const rawTarget =
      req.params[0] ||
      req.params.publicId ||
      req.params.id ||
      req.body.publicId ||
      req.body.public_id ||
      req.body.url;

    if (!rawTarget) {
      return sendError(res, 'Public ID or image URL is required for deletion.', 400);
    }

    let publicId = extractPublicIdFromUrl(rawTarget) || rawTarget;

    // Check if rawTarget is a MongoDB ObjectId
    const mediaDoc = await Media.findOne({
      $or: [
        { _id: rawTarget.match(/^[0-9a-fA-F]{24}$/) ? rawTarget : null },
        { public_id: publicId },
        { publicId: publicId },
        { url: rawTarget },
        { secure_url: rawTarget }
      ].filter(Boolean)
    });

    if (mediaDoc) {
      publicId = mediaDoc.public_id || mediaDoc.publicId || publicId;
      await Media.findByIdAndDelete(mediaDoc._id);
    }

    const cloudRes = await deleteImageFromCloudinary(publicId);

    return sendSuccess(res, 'Image deleted successfully from Cloudinary and database.', cloudRes);
  } catch (error) {
    console.error('❌ [deleteImage Error]:', error.message);
    return sendError(res, 'Failed to delete image from Cloudinary: ' + error.message, 500);
  }
};
