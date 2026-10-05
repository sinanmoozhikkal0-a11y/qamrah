import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { deleteImageFromCloudinary, extractPublicIdFromUrl } from '../config/cloudinary.js';

// Helper: Slugify text if slug is not provided
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Helper: Normalize incoming field aliases for consistency
const normalizeProductPayload = (payload) => {
  const data = { ...payload };

  // Image aliases
  if (data.image && !data.mainImage) data.mainImage = data.image;
  if (data.mainImage && !data.image) data.image = data.mainImage;

  // Price & MRP aliases
  if (data.mrp !== undefined && data.originalPrice === undefined) data.originalPrice = data.mrp;
  if (data.originalPrice !== undefined && data.mrp === undefined) data.mrp = data.originalPrice;

  // Weight & PackSize aliases
  if (data.weight && !data.packSize) data.packSize = data.weight;
  if (data.packSize && !data.weight) data.weight = data.packSize;

  // Badge & Tag aliases
  if (data.badge && !data.tag) data.tag = data.badge;
  if (data.tag && !data.badge) data.badge = data.tag;

  // Featured & Bestseller aliases
  if (data.isFeatured !== undefined && data.featured === undefined) data.featured = data.isFeatured;
  if (data.featured !== undefined && data.isFeatured === undefined) data.isFeatured = data.featured;
  if (data.isBestseller !== undefined && data.bestseller === undefined) data.bestseller = data.isBestseller;
  if (data.bestseller !== undefined && data.isBestseller === undefined) data.isBestseller = data.bestseller;

  // Ensure numeric fields
  if (data.price !== undefined) data.price = Number(data.price);
  if (data.mrp !== undefined) data.mrp = Number(data.mrp);
  if (data.originalPrice !== undefined) data.originalPrice = Number(data.originalPrice);
  if (data.stock !== undefined) {
    data.stock = Number(data.stock);
    data.inStock = data.stock > 0;
  }

  return data;
};

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, search, and pagination
 * @access  Public (returns active products by default; admins can view all)
 */
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      bestseller,
      search,
      status,
      page = 1,
      limit = 50,
      sort = '-createdAt'
    } = req.query;

    const andConditions = [];

    // 1. Status Filter: Default to active for storefront unless specified
    if (status && status !== 'all') {
      andConditions.push({ status });
    } else if (!status) {
      andConditions.push({ status: 'active' });
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      andConditions.push({ category: category.toLowerCase().trim() });
    }

    // 3. Featured / Bestseller Filters
    if (featured === 'true' || featured === true) {
      andConditions.push({
        $or: [{ featured: true }, { isFeatured: true }]
      });
    }
    if (bestseller === 'true' || bestseller === true) {
      andConditions.push({
        $or: [{ bestseller: true }, { isBestseller: true }]
      });
    }

    // 4. Search Filter
    if (search && search.trim()) {
      const q = search.trim();
      andConditions.push({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { slug: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
          { sku: { $regex: q, $options: 'i' } }
        ]
      });
    }

    const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: products,
      count: products.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    console.error('❌ [getProducts Error]:', error.message);
    return sendError(res, 'Failed to fetch products: ' + error.message, 500);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by MongoDB ID (or fallback slug)
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      // Fallback: Support slug query via :id parameter for storefront convenience
      product = await Product.findOne({ slug: id.toLowerCase().trim() });
    }

    if (!product) {
      return sendError(res, 'Product not found.', 404);
    }

    return sendSuccess(res, 'Product retrieved successfully.', product);
  } catch (error) {
    console.error('❌ [getProductById Error]:', error.message);
    return sendError(res, 'Failed to fetch product: ' + error.message, 500);
  }
};

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Get single product by unique slug
 * @access  Public
 */
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return sendError(res, 'Slug parameter is required.', 400);
    }

    const product = await Product.findOne({ slug: slug.toLowerCase().trim() });

    if (!product) {
      return sendError(res, `Product with slug "${slug}" not found.`, 404);
    }

    return sendSuccess(res, 'Product retrieved successfully.', product);
  } catch (error) {
    console.error('❌ [getProductBySlug Error]:', error.message);
    return sendError(res, 'Failed to fetch product by slug: ' + error.message, 500);
  }
};

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
export const createProduct = async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body);

    // 1. Validate required fields
    if (!payload.name || !payload.name.trim()) {
      return sendError(res, 'Product name is required.', 400);
    }

    if (!payload.category || !payload.category.trim()) {
      return sendError(res, 'Product category is required.', 400);
    }

    if (payload.price === undefined || isNaN(payload.price) || payload.price < 0) {
      return sendError(res, 'A valid non-negative product price is required.', 400);
    }

    if (payload.stock !== undefined && (isNaN(payload.stock) || payload.stock < 0)) {
      return sendError(res, 'Stock count cannot be negative.', 400);
    }

    if (!payload.mainImage || !payload.mainImage.trim()) {
      return sendError(res, 'Main product image URL is required.', 400);
    }

    // 2. Compute and validate slug
    let slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
    if (!slug) {
      slug = 'product-' + Date.now();
    }

    // Check duplicate slug
    const existing = await Product.findOne({ slug });
    if (existing) {
      return sendError(res, `A product with slug "${slug}" already exists.`, 400);
    }

    payload.slug = slug;

    // 3. Create Product document
    const newProduct = await Product.create(payload);

    return sendSuccess(res, 'Product created successfully.', newProduct, 201);
  } catch (error) {
    console.error('❌ [createProduct Error]:', error.message);
    if (error.code === 11000) {
      return sendError(res, 'A product with this unique field (slug or SKU) already exists.', 400);
    }
    return sendError(res, 'Failed to create product: ' + error.message, 500);
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product
 * @access  Private (Admin only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found.', 404);
    }

    const payload = normalizeProductPayload(req.body);

    // Validate price & stock if provided
    if (payload.price !== undefined && (isNaN(payload.price) || payload.price < 0)) {
      return sendError(res, 'Price cannot be negative.', 400);
    }
    if (payload.stock !== undefined && (isNaN(payload.stock) || payload.stock < 0)) {
      return sendError(res, 'Stock cannot be negative.', 400);
    }

    // Check slug uniqueness if slug is being updated
    if (payload.slug) {
      const cleanSlug = slugify(payload.slug);
      const duplicate = await Product.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (duplicate) {
        return sendError(res, `A product with slug "${cleanSlug}" already exists.`, 400);
      }
      payload.slug = cleanSlug;
    }

    const oldMainImage = product.mainImage;
    const isImageUpdated = payload.mainImage && payload.mainImage !== oldMainImage;

    // Apply updates
    Object.assign(product, payload);
    await product.save();

    // If product image was replaced with a new one and old was Cloudinary, clean up old asset
    if (isImageUpdated && oldMainImage && (oldMainImage.includes('cloudinary.com') || oldMainImage.includes('res.cloudinary'))) {
      const oldPublicId = extractPublicIdFromUrl(oldMainImage);
      if (oldPublicId) {
        deleteImageFromCloudinary(oldPublicId).catch((delErr) => {
          console.warn('[Cloudinary] Notice cleaning up replaced product image:', delErr.message);
        });
      }
    }

    return sendSuccess(res, 'Product updated successfully.', product);
  } catch (error) {
    console.error('❌ [updateProduct Error]:', error.message);
    if (error.code === 11000) {
      return sendError(res, 'Duplicate key error: slug or SKU already exists.', 400);
    }
    return sendError(res, 'Failed to update product: ' + error.message, 500);
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Soft-delete (archive) product to maintain order history integrity
 * @access  Private (Admin only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found.', 404);
    }

    // Check if hard delete was specifically requested via query ?hard=true
    if (req.query.hard === 'true') {
      if (product.mainImage && (product.mainImage.includes('cloudinary.com') || product.mainImage.includes('res.cloudinary'))) {
        const publicId = extractPublicIdFromUrl(product.mainImage);
        if (publicId) {
          deleteImageFromCloudinary(publicId).catch((delErr) => {
            console.warn('[Cloudinary] Notice cleaning up deleted product image:', delErr.message);
          });
        }
      }
      await Product.findByIdAndDelete(id);
      return sendSuccess(res, 'Product permanently removed from database.');
    }

    // Default: Soft-delete / archive
    product.status = 'archived';
    await product.save();

    return sendSuccess(res, 'Product archived successfully.', product);
  } catch (error) {
    console.error('❌ [deleteProduct Error]:', error.message);
    return sendError(res, 'Failed to archive product: ' + error.message, 500);
  }
};

/**
 * @route   PATCH /api/products/:id/status
 * @desc    Toggle product status (active, inactive, archived)
 * @access  Private (Admin only)
 */
export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', 400);
    }

    const validStatuses = ['active', 'inactive', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return sendError(res, 'Status must be active, inactive, or archived.', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found.', 404);
    }

    product.status = status;
    await product.save();

    return sendSuccess(res, `Product status updated to ${status}.`, product);
  } catch (error) {
    console.error('❌ [updateProductStatus Error]:', error.message);
    return sendError(res, 'Failed to update status: ' + error.message, 500);
  }
};

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Update product stock quantity safely
 * @access  Private (Admin only)
 */
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid product ID format.', 400);
    }

    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      return sendError(res, 'Stock must be a valid non-negative number.', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 'Product not found.', 404);
    }

    product.stock = numStock;
    product.inStock = numStock > 0;
    await product.save();

    return sendSuccess(res, 'Product stock updated successfully.', product);
  } catch (error) {
    console.error('❌ [updateProductStock Error]:', error.message);
    return sendError(res, 'Failed to update stock: ' + error.message, 500);
  }
};
