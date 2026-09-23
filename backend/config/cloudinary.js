import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded even if imported before server.js initializes dotenv
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return true;
  }

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
    return true;
  }

  return false;
};

// Initial config attempt
let isConfigured = configureCloudinary();

const ensureConfigured = () => {
  if (!isConfigured) {
    isConfigured = configureCloudinary();
  }
  return isConfigured;
};

/**
 * Uploads an image to Cloudinary with automatic optimization.
 * @param {string|Buffer} source - Local file path or Buffer.
 * @param {Object} options - Upload options (folder, public_id, tags, etc.)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadImageToCloudinary = async (source, options = {}) => {
  if (!ensureConfigured()) {
    throw new Error('Cloudinary credentials are not configured on this server. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.');
  }

  const defaultOptions = {
    folder: 'qamrah/media',
    resource_type: 'image',
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    ...options
  };

  if (typeof source === 'string') {
    return await cloudinary.uploader.upload(source, defaultOptions);
  }

  // Upload from buffer via stream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(defaultOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    uploadStream.end(source);
  });
};

/**
 * Deletes an image from Cloudinary safely.
 * @param {string} publicId - Cloudinary asset public_id
 * @returns {Promise<Object>} Deletion result
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!ensureConfigured()) {
    console.warn('[Cloudinary] Skipping deletion: Cloudinary is not configured.');
    return { result: 'skipped' };
  }

  if (!publicId || publicId.trim() === '') {
    return { result: 'not_found' };
  }

  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete asset ${publicId}:`, error.message);
    throw error;
  }
};

/**
 * Generates an optimized Cloudinary delivery URL with responsive transformations.
 * @param {string} publicId
 * @param {Object} customTransformations
 * @returns {string}
 */
export const getOptimizedImageUrl = (publicId, customTransformations = {}) => {
  if (!publicId) return '';
  ensureConfigured();
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    ...customTransformations
  });
};

export { cloudinary, isConfigured as isCloudinaryConfigured, ensureConfigured };
