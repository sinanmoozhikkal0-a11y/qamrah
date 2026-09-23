import Category from '../models/Category.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getCategories = async (req, res) => {
  try {
    const query = {};
    if (!req.admin) {
      query.status = 'active';
    }
    const categories = await Category.find(query).sort({ order: 1 });
    return sendResponse(res, 200, true, 'Categories retrieved successfully.', categories);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const createCategory = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const newCategory = await Category.create(data);
    return sendResponse(res, 201, true, 'Category added successfully.', newCategory);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to add category: ' + err.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return sendResponse(res, 404, false, 'Category not found.');
    }
    return sendResponse(res, 200, true, 'Category updated successfully.', updated);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to update category: ' + err.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return sendResponse(res, 404, false, 'Category not found.');
    }
    return sendResponse(res, 200, true, 'Category deleted successfully.');
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to delete category: ' + err.message);
  }
};
