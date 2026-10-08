import HomePage from '../models/HomePage.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @route   GET /api/home
 * @desc    Get homepage CMS configuration including heroSection
 * @access  Public
 */
export const getHomePage = async (_req, res) => {
  try {
    const doc = await HomePage.findOne({}).lean();
    if (!doc) {
      return sendSuccess(res, 'Default homepage data', {});
    }
    return sendSuccess(res, 'Homepage CMS retrieved successfully', doc);
  } catch (error) {
    console.error('❌ [getHomePage Error]:', error.message);
    return sendError(res, 'Failed to retrieve homepage CMS: ' + error.message, 500);
  }
};

/**
 * @route   PUT /api/home
 * @desc    Update homepage CMS configuration (Admin only)
 * @access  Private (Admin only)
 */
export const updateHomePage = async (req, res) => {
  try {
    const payload = { ...(req.body || {}) };
    delete payload._id;
    delete payload.__v;

    // Validate that no base64 images are submitted to heroSection
    if (payload.heroSection) {
      if (typeof payload.heroSection.backgroundImage === 'string' && payload.heroSection.backgroundImage.startsWith('data:image')) {
        return sendError(res, 'Base64 images are not permitted in hero background. Please upload to Cloudinary.', 400);
      }
      if (Array.isArray(payload.heroSection.products)) {
        for (const prod of payload.heroSection.products) {
          if (typeof prod.image === 'string' && prod.image.startsWith('data:image')) {
            return sendError(res, `Base64 image detected for "${prod.name || 'Product'}". Please upload to Cloudinary.`, 400);
          }
        }
      }
    }

    const updated = await HomePage.findOneAndUpdate(
      {},
      {
        $set: {
          ...payload,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return sendSuccess(res, 'Homepage CMS updated successfully.', updated);
  } catch (error) {
    console.error('❌ [updateHomePage Error]:', error.message);
    return sendError(res, 'Failed to update homepage CMS: ' + error.message, 500);
  }
};
