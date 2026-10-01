import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { sendResponse } from '../utils/sendResponse.js';
import { defaultProducts } from '../data/defaultData.js';

const filterFallbackProducts = (query = {}) => {
  let list = [...defaultProducts];
  if (query.category && query.category !== 'all') {
    list = list.filter((p) => p.category === query.category);
  }
  if (query.featured === 'true') {
    list = list.filter((p) => p.featured);
  }
  if (query.bestseller === 'true') {
    list = list.filter((p) => p.bestseller);
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
    );
  }
  return list;
};

// GET all products (public & admin)
export const getProducts = async (req, res) => {
  try {
    const { category, featured, bestseller, search, status } = req.query;
    const query = {};

    // If not requested by admin, only show active products
    if (status) {
      query.status = status;
    } else if (!req.admin) {
      query.status = 'active';
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (bestseller === 'true') {
      query.bestseller = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    let products = [];
    if (mongoose.connection.readyState === 1) {
      products = await Product.find(query).sort({ createdAt: -1 });
    }

    if (!products || products.length === 0) {
      products = filterFallbackProducts(query);
    }

    return sendResponse(res, 200, true, 'Products retrieved successfully.', products);
  } catch (err) {
    console.warn('[Products Controller Warning]:', err.message);
    const fallback = filterFallbackProducts(req.query || {});
    return sendResponse(res, 200, true, 'Products retrieved successfully.', fallback);
  }
};

// GET single product by ID or Slug
export const getProductByIdOrSlug = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.connection.readyState === 1) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }
      if (!product) {
        product = await Product.findOne({ slug: id });
      }
    }

    if (!product) {
      product = defaultProducts.find((p) => p.slug === id || p._id === id || p.id === id);
    }

    if (!product) {
      return sendResponse(res, 404, false, 'Product not found.');
    }

    return sendResponse(res, 200, true, 'Product details retrieved.', product);
  } catch (err) {
    console.warn('[Product By ID/Slug Warning]:', err.message);
    const product = defaultProducts.find((p) => p.slug === req.params.id || p._id === req.params.id || p.id === req.params.id);
    if (product) {
      return sendResponse(res, 200, true, 'Product details retrieved.', product);
    }
    return sendResponse(res, 404, false, 'Product not found.');
  }
};

// CREATE new product (Admin)
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Auto-generate slug if not provided
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Auto calculate inStock
    if (productData.stock !== undefined) {
      productData.inStock = Number(productData.stock) > 0;
    }

    // Auto calculate discount percentage if mrp and price are provided
    if (productData.mrp && productData.price && productData.mrp > productData.price) {
      productData.discount = Math.round(((productData.mrp - productData.price) / productData.mrp) * 100);
    }

    const newProduct = await Product.create(productData);
    return sendResponse(res, 201, true, 'Product added successfully.', newProduct);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to create product: ' + err.message);
  }
};

// UPDATE product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.stock !== undefined) {
      updateData.inStock = Number(updateData.stock) > 0;
    }

    if (updateData.mrp && updateData.price && updateData.mrp > updateData.price) {
      updateData.discount = Math.round(((updateData.mrp - updateData.price) / updateData.mrp) * 100);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return sendResponse(res, 404, false, 'Product not found.');
    }

    return sendResponse(res, 200, true, 'Product updated successfully.', updated);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to update product: ' + err.message);
  }
};

// DELETE product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return sendResponse(res, 404, false, 'Product not found.');
    }

    return sendResponse(res, 200, true, 'Product deleted successfully.');
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to delete product: ' + err.message);
  }
};
