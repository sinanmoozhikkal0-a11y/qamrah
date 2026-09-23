import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Media from '../models/Media.js';
import { sendResponse } from '../utils/sendResponse.js';
import {
  cloudinary,
  isCloudinaryConfigured,
  uploadImageToCloudinary,
  deleteImageFromCloudinary
} from '../config/cloudinary.js';

/**
 * Upload single image to Cloudinary and persist metadata in MongoDB
 */
export const uploadMedia = async (req, res) => {
  const filePath = req.file ? req.file.path : null;

  try {
    if (!req.file) {
      return sendResponse(res, 400, false, 'No image file provided for upload.');
    }

    const customFolder = req.body.folder ? `qamrah/${req.body.folder.replace(/^qamrah\/?/, '')}` : 'qamrah/media';
    const altText = req.body.altText || req.body.alt || '';
    const section = req.body.section || 'general';

    let fileUrl = '';
    let publicId = '';
    let storageType = 'local';
    let format = path.extname(req.file.originalname).replace('.', '').toLowerCase();
    let width = 0;
    let height = 0;

    if (isCloudinaryConfigured) {
      try {
        const cleanName = path.basename(req.file.originalname, path.extname(req.file.originalname))
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .slice(0, 50);
        const uniquePublicId = `${cleanName}_${Date.now()}`;

        const result = await uploadImageToCloudinary(req.file.path, {
          folder: customFolder,
          public_id: uniquePublicId
        });

        fileUrl = result.secure_url;
        publicId = result.public_id;
        storageType = 'cloudinary';
        format = result.format || format;
        width = result.width || 0;
        height = result.height || 0;
      } catch (cloudErr) {
        console.warn('[Cloudinary] Direct upload failed, falling back to local storage:', cloudErr.message);
        fileUrl = `/uploads/${req.file.filename}`;
      }
    } else {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const media = await Media.create({
      url: fileUrl,
      secure_url: fileUrl,
      public_id: publicId,
      publicId: publicId,
      filename: req.file.filename || req.file.originalname,
      originalFilename: req.file.originalname,
      altText,
      folder: customFolder,
      section,
      format,
      size: req.file.size,
      width,
      height,
      storageType
    });

    return sendResponse(res, 201, true, 'Image uploaded successfully.', media);
  } catch (err) {
    console.error('[Upload] Error in uploadMedia:', err.message);
    return sendResponse(res, 500, false, 'Image upload failed: ' + err.message);
  } finally {
    // Safely remove temporary file from local disk if uploaded to Cloudinary
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.warn('[Upload] Failed to clean up temp file:', unlinkErr.message);
      }
    }
  }
};

/**
 * Retrieve list of all uploaded images with optional filtering
 */
export const getMediaList = async (req, res) => {
  try {
    const { folder, section, search, limit = 100, page = 1 } = req.query;
    const filter = {};

    if (folder) {
      filter.folder = new RegExp(folder, 'i');
    }
    if (section) {
      filter.section = section;
    }
    if (search) {
      filter.$or = [
        { filename: new RegExp(search, 'i') },
        { originalFilename: new RegExp(search, 'i') },
        { altText: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [media, total] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Media.countDocuments(filter)
    ]);

    return sendResponse(res, 200, true, 'Media library retrieved.', {
      items: media,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to fetch media library: ' + err.message);
  }
};

/**
 * Retrieve single image details by ID or Public ID
 */
export const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    let media = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      media = await Media.findById(id);
    }

    if (!media) {
      media = await Media.findOne({
        $or: [{ public_id: id }, { publicId: id }]
      });
    }

    if (!media) {
      return sendResponse(res, 404, false, 'Media item not found.');
    }

    return sendResponse(res, 200, true, 'Media item retrieved.', media);
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to retrieve media item: ' + err.message);
  }
};

/**
 * Update media metadata (alt text, section, folder)
 */
export const updateMediaMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const { altText, section, folder, filename } = req.body;

    let media = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      media = await Media.findById(id);
    }
    if (!media) {
      media = await Media.findOne({ $or: [{ public_id: id }, { publicId: id }] });
    }

    if (!media) {
      return sendResponse(res, 404, false, 'Media item not found.');
    }

    if (altText !== undefined) media.altText = altText;
    if (section !== undefined) media.section = section;
    if (folder !== undefined) media.folder = folder;
    if (filename !== undefined) media.filename = filename;

    await media.save();
    return sendResponse(res, 200, true, 'Media metadata updated successfully.', media);
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to update media: ' + err.message);
  }
};

/**
 * Replace existing image with a new uploaded file.
 * Safely removes the old Cloudinary asset only AFTER new upload succeeds.
 */
export const replaceMedia = async (req, res) => {
  const filePath = req.file ? req.file.path : null;

  try {
    const { id } = req.params;
    if (!req.file) {
      return sendResponse(res, 400, false, 'No new image file provided for replacement.');
    }

    let media = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      media = await Media.findById(id);
    }
    if (!media) {
      media = await Media.findOne({ $or: [{ public_id: id }, { publicId: id }] });
    }

    if (!media) {
      return sendResponse(res, 404, false, 'Media record not found.');
    }

    const oldPublicId = media.public_id || media.publicId;
    const oldStorageType = media.storageType;
    const oldUrl = media.url;

    let newUrl = '';
    let newPublicId = '';
    let storageType = 'local';
    let format = path.extname(req.file.originalname).replace('.', '').toLowerCase();
    let width = 0;
    let height = 0;

    if (isCloudinaryConfigured) {
      const cleanName = path.basename(req.file.originalname, path.extname(req.file.originalname))
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 50);
      const uniquePublicId = `${cleanName}_${Date.now()}`;

      const result = await uploadImageToCloudinary(req.file.path, {
        folder: media.folder || 'qamrah/media',
        public_id: uniquePublicId
      });

      newUrl = result.secure_url;
      newPublicId = result.public_id;
      storageType = 'cloudinary';
      format = result.format || format;
      width = result.width || 0;
      height = result.height || 0;
    } else {
      newUrl = `/uploads/${req.file.filename}`;
    }

    // Update MongoDB record
    media.url = newUrl;
    media.secure_url = newUrl;
    media.public_id = newPublicId;
    media.publicId = newPublicId;
    media.filename = req.file.filename || req.file.originalname;
    media.originalFilename = req.file.originalname;
    media.format = format;
    media.size = req.file.size;
    media.width = width;
    media.height = height;
    media.storageType = storageType;

    await media.save();

    // Now delete old asset safely if it existed on Cloudinary
    if (oldStorageType === 'cloudinary' && oldPublicId) {
      try {
        await deleteImageFromCloudinary(oldPublicId);
      } catch (delErr) {
        console.warn(`[Cloudinary] Old asset deletion notice for ${oldPublicId}:`, delErr.message);
      }
    } else if (oldStorageType === 'local' && oldUrl) {
      const oldLocalPath = path.join(process.cwd(), 'uploads', path.basename(oldUrl));
      if (fs.existsSync(oldLocalPath)) {
        try { fs.unlinkSync(oldLocalPath); } catch (_) {}
      }
    }

    return sendResponse(res, 200, true, 'Image replaced successfully.', media);
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to replace image: ' + err.message);
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }
  }
};

/**
 * Delete media by MongoDB ID or Cloudinary Public ID
 */
export const deleteMedia = async (req, res) => {
  try {
    // Read id from params (supports id or publicId)
    const rawId = req.params.publicId || req.params.id;
    if (!rawId) {
      return sendResponse(res, 400, false, 'Image ID or Public ID is required.');
    }

    const decodedId = decodeURIComponent(rawId);
    let media = null;

    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      media = await Media.findById(decodedId);
    }

    if (!media) {
      media = await Media.findOne({
        $or: [{ public_id: decodedId }, { publicId: decodedId }]
      });
    }

    // If media record exists in DB
    if (media) {
      const targetPublicId = media.public_id || media.publicId;

      if (media.storageType === 'cloudinary' && targetPublicId && isCloudinaryConfigured) {
        try {
          await deleteImageFromCloudinary(targetPublicId);
        } catch (cloudErr) {
          console.warn('[Cloudinary] Notice on destroy:', cloudErr.message);
        }
      } else if (media.storageType === 'local') {
        const localPath = path.join(process.cwd(), 'uploads', path.basename(media.url));
        if (fs.existsSync(localPath)) {
          try { fs.unlinkSync(localPath); } catch (_) {}
        }
      }

      await Media.findByIdAndDelete(media._id);
      return sendResponse(res, 200, true, 'Image deleted successfully from storage and database.');
    }

    // If media record not found in DB, but a publicId was passed directly, try destroying from Cloudinary
    if (decodedId.includes('/') || isCloudinaryConfigured) {
      const cloudRes = await deleteImageFromCloudinary(decodedId);
      return sendResponse(res, 200, true, 'Asset deleted from Cloudinary.', cloudRes);
    }

    return sendResponse(res, 404, false, 'Media asset not found.');
  } catch (err) {
    console.error('[Delete] Error in deleteMedia:', err.message);
    return sendResponse(res, 500, false, 'Failed to delete media: ' + err.message);
  }
};
