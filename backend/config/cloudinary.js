import './env.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ? String(process.env.CLOUDINARY_CLOUD_NAME).trim() : '';
  const apiKey = process.env.CLOUDINARY_API_KEY ? String(process.env.CLOUDINARY_API_KEY).trim() : '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET ? String(process.env.CLOUDINARY_API_SECRET).trim() : '';

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return true;
  }

  const cloudinaryUrl = process.env.CLOUDINARY_URL ? String(process.env.CLOUDINARY_URL).trim() : '';
  if (cloudinaryUrl) {
    cloudinary.config({ secure: true });
    return true;
  }

  return false;
};

// Initial config attempt
let isConfigured = configureCloudinary();

export const ensureConfigured = () => {
  if (!isConfigured) {
    // Attempt dynamic reload in case environment was populated after initial load
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
    isConfigured = configureCloudinary();
  }
  return isConfigured;
};

export const isCloudinaryConfigured = () => ensureConfigured();

/**
 * Uploads an image to Cloudinary with automatic optimization.
 * @param {string|Buffer} source - Local file path, Buffer, or data URI.
 * @param {Object} options - Upload options (folder, public_id, tags, etc.)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadImageToCloudinary = async (source, options = {}) => {
  if (!ensureConfigured()) {
    throw new Error(
      'Cloudinary credentials are not configured on this server. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.'
    );
  }

  const defaultOptions = {
    folder: options.folder || 'qamrah/products',
    resource_type: 'image',
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    ...options
  };

  // String can be file path or base64 data URI
  if (typeof source === 'string') {
    return await cloudinary.uploader.upload(source, defaultOptions);
  }

  // Upload from Buffer via stream (ideal for memoryStorage & Vercel serverless)
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

  if (!publicId || typeof publicId !== 'string' || publicId.trim() === '') {
    return { result: 'not_found' };
  }

  try {
    return await cloudinary.uploader.destroy(publicId.trim());
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete asset ${publicId}:`, error.message);
    throw error;
  }
};

/**
 * Utility to extract public_id from a Cloudinary secure_url or standard URL
 * e.g. https://res.cloudinary.com/yqcls5bk/image/upload/v1791192817/qamrah/products/cashew.png
 * -> qamrah/products/cashew
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary')) return null;

  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

export { cloudinary };
