import Settings from '../models/Settings.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getSettings = async (_req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return sendResponse(res, 200, true, 'Store settings loaded.', settings);
  } catch (err) {
    console.error('[Settings Controller Warning]:', err.message);
    // Graceful fallback to default store settings so the frontend is never blocked
    return sendResponse(res, 200, true, 'Store settings (defaults).', {
      storeName: 'QAMRAH',
      storeTagline: 'Royal Dry Fruits & Nuts',
      currency: 'INR',
      currencySymbol: '₹',
      shippingCharge: 49,
      freeShippingThreshold: 999,
      whatsappNumber: '+916235820223',
      email: 'concierge@qamrahnuts.com',
      phone: '+91 (022) 8940-2200',
      whatsappNotificationEnabled: true,
      socialLinks: {
        instagram: 'https://instagram.com/qamrahnuts',
        facebook: 'https://facebook.com/qamrahnuts',
        youtube: 'https://youtube.com/@qamrahnuts'
      }
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true
      });
    }
    return sendResponse(res, 200, true, 'Settings updated successfully.', settings);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to update settings: ' + err.message);
  }
};
