import PackDesign from '../models/PackDesign.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getPackDesigns = async (req, res) => {
  try {
    const query = {};
    if (!req.admin) {
      query.status = 'active';
    }
    const packDesigns = await PackDesign.find(query).sort({ order: 1 });
    return sendResponse(res, 200, true, 'Pack designs retrieved successfully.', packDesigns);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const createPackDesign = async (req, res) => {
  try {
    const newPack = await PackDesign.create(req.body);
    return sendResponse(res, 201, true, 'Pack design created successfully.', newPack);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to create pack design: ' + err.message);
  }
};

export const updatePackDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PackDesign.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return sendResponse(res, 404, false, 'Pack design not found.');
    }
    return sendResponse(res, 200, true, 'Pack design updated successfully.', updated);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to update pack design: ' + err.message);
  }
};

export const deletePackDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PackDesign.findByIdAndDelete(id);
    if (!deleted) {
      return sendResponse(res, 404, false, 'Pack design not found.');
    }
    return sendResponse(res, 200, true, 'Pack design deleted successfully.');
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to delete pack design: ' + err.message);
  }
};
