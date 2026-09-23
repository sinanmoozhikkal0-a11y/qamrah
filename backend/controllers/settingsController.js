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
    return sendResponse(res, 500, false, err.message);
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
