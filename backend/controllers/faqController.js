import FAQ from '../models/FAQ.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getFAQs = async (req, res) => {
  try {
    const query = {};
    if (!req.admin) {
      query.status = 'active';
    }
    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: 1 });
    return sendResponse(res, 200, true, 'FAQs retrieved.', faqs);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const createFAQ = async (req, res) => {
  try {
    const newFaq = await FAQ.create(req.body);
    return sendResponse(res, 201, true, 'FAQ added successfully.', newFaq);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to add FAQ: ' + err.message);
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await FAQ.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return sendResponse(res, 404, false, 'FAQ not found.');
    }
    return sendResponse(res, 200, true, 'FAQ updated successfully.', updated);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to update FAQ: ' + err.message);
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FAQ.findByIdAndDelete(id);
    if (!deleted) {
      return sendResponse(res, 404, false, 'FAQ not found.');
    }
    return sendResponse(res, 200, true, 'FAQ deleted successfully.');
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to delete FAQ: ' + err.message);
  }
};
