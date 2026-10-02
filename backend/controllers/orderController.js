import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * Helper: Find order by MongoDB ObjectId or human-readable orderId string
 */
const findOrderByIdOrCode = async (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    return Order.findById(idOrCode);
  }
  return Order.findOne({ orderId: idOrCode.trim().toUpperCase() });
};

/**
 * @route   POST /api/orders
 * @desc    Create a new order from verified database inventory and server pricing
 * @access  Private (Authenticated customer or admin)
 */
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, customer, paymentMethod, notes } = req.body;

    // 1. Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 'Order must contain at least one item.', 400);
    }

    // 2. Normalize and validate shipping address
    const shipping = shippingAddress || {};
    const cust = customer || {};

    const fullName = (shipping.fullName || cust.name || '').trim();
    const phone = (shipping.phone || cust.phone || '').trim();
    const address = (shipping.address || cust.address || '').trim();
    const city = (shipping.city || cust.city || '').trim();
    const state = (shipping.state || cust.state || '').trim();
    const postalCode = (shipping.postalCode || cust.pincode || '').trim();
    const country = (shipping.country || 'India').trim();

    if (!fullName || !phone || !address || !city || !postalCode) {
      return sendError(
        res,
        'Please provide all required shipping details (name, phone, address, city, pincode).',
        400
      );
    }

    // 3. Validate every product in MongoDB & recalculate pricing on server
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const productId = item.product || item.productId || item.id || item._id;

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return sendError(res, `Invalid product identifier: "${productId}".`, 400);
      }

      const product = await Product.findById(productId);

      if (!product) {
        return sendError(res, `Product with ID "${productId}" not found.`, 404);
      }

      if (product.status !== 'active') {
        return sendError(
          res,
          `Product "${product.name}" is inactive or no longer available for purchase.`,
          400
        );
      }

      const quantity = parseInt(item.quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        return sendError(res, `Invalid quantity for "${product.name}". Must be at least 1.`, 400);
      }

      // Check current available stock
      if (product.stock < quantity) {
        return sendError(
          res,
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${quantity}.`,
          400
        );
      }

      // Server is the sole source of truth for pricing
      let unitPrice = product.price;

      // If item specifies a weight variant, verify against product.availableWeights
      if (item.weight && Array.isArray(product.availableWeights) && product.availableWeights.length > 0) {
        const matchedVariant = product.availableWeights.find(
          (w) => w.label?.toLowerCase() === item.weight.toString().toLowerCase()
        );
        if (matchedVariant && matchedVariant.price > 0) {
          unitPrice = matchedVariant.price;
        }
      }

      // Optional pack design price adjustment
      const packPriceAdjustment = Math.max(0, Number(item.packPriceAdjustment) || 0);
      const effectivePrice = unitPrice + packPriceAdjustment;

      calculatedSubtotal += effectivePrice * quantity;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.mainImage || product.image || '',
        price: effectivePrice,
        quantity,
        weight: item.weight || product.packSize || '250g',
        packDesign: item.packDesign || 'Classic QAMRAH Pack',
        packPriceAdjustment
      });
    }

    // 4. Calculate shipping fee and final total on server
    // Free shipping threshold: ₹999; standard fee: ₹49
    const freeShippingThreshold = 999;
    const shippingFee = calculatedSubtotal >= freeShippingThreshold ? 0 : 49;
    const discount = 0; // Discounts must be verified via coupon engine in future steps
    const calculatedTotal = calculatedSubtotal + shippingFee - discount;

    // 5. Generate human-readable order ID
    const orderId = `QMR-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

    // 6. Execute stock reduction and order creation atomically
    let createdOrder = null;
    let session = null;

    try {
      session = await mongoose.startSession();
      await session.withTransaction(async () => {
        // Decrease stock for each verified product
        for (const item of verifiedItems) {
          const updated = await Product.findOneAndUpdate(
            { _id: item.product, stock: { $gte: item.quantity } },
            [
              {
                $set: {
                  stock: { $subtract: ['$stock', item.quantity] },
                  inStock: { $gt: [{ $subtract: ['$stock', item.quantity] }, 0] }
                }
              }
            ],
            { session, new: true }
          );

          if (!updated) {
            throw new Error(`Insufficient stock or concurrent inventory update for "${item.name}".`);
          }
        }

        // Create the Order document
        const [orderDoc] = await Order.create(
          [
            {
              orderId,
              user: req.user._id,
              items: verifiedItems,
              shippingAddress: {
                fullName,
                phone,
                address,
                city,
                state,
                postalCode,
                country
              },
              subtotal: calculatedSubtotal,
              shippingFee,
              shipping: shippingFee,
              discount,
              total: calculatedTotal,
              paymentStatus: 'pending',
              paymentMethod: paymentMethod || 'Cash on Delivery',
              orderStatus: 'pending',
              status: 'pending',
              notes: notes || cust.notes || ''
            }
          ],
          { session }
        );

        createdOrder = orderDoc;
      });
    } catch (sessionErr) {
      // If transactions are not supported or replica set session failed, execute safe sequential fallback
      if (session) session.endSession();
      session = null;

      // Sequential atomic inventory check and fallback
      const decrementedItems = [];
      try {
        for (const item of verifiedItems) {
          const updated = await Product.findOneAndUpdate(
            { _id: item.product, stock: { $gte: item.quantity } },
            [
              {
                $set: {
                  stock: { $subtract: ['$stock', item.quantity] },
                  inStock: { $gt: [{ $subtract: ['$stock', item.quantity] }, 0] }
                }
              }
            ],
            { new: true }
          );

          if (!updated) {
            throw new Error(`Insufficient inventory on "${item.name}".`);
          }
          decrementedItems.push(item);
        }

        createdOrder = await Order.create({
          orderId,
          user: req.user._id,
          items: verifiedItems,
          shippingAddress: {
            fullName,
            phone,
            address,
            city,
            state,
            postalCode,
            country
          },
          subtotal: calculatedSubtotal,
          shippingFee,
          shipping: shippingFee,
          discount,
          total: calculatedTotal,
          paymentStatus: 'pending',
          paymentMethod: paymentMethod || 'Cash on Delivery',
          orderStatus: 'pending',
          status: 'pending',
          notes: notes || cust.notes || ''
        });
      } catch (fallbackErr) {
        // Rollback any successfully decremented inventory
        for (const rollbackItem of decrementedItems) {
          await Product.findByIdAndUpdate(rollbackItem.product, {
            $inc: { stock: rollbackItem.quantity },
            inStock: true
          });
        }
        throw fallbackErr;
      }
    } finally {
      if (session) session.endSession();
    }

    return sendSuccess(res, 'Order placed successfully.', createdOrder, 201);
  } catch (error) {
    console.error('❌ [createOrder Error]:', error.message);
    return sendError(res, error.message || 'Failed to place order.', 400);
  }
};

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get all orders belonging to currently authenticated customer
 * @access  Private (Authenticated customer)
 */
export const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const filter = { user: req.user._id };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully.',
      data: orders,
      count: orders.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    console.error('❌ [getMyOrders Error]:', error.message);
    return sendError(res, 'Failed to fetch customer orders: ' + error.message, 500);
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by MongoDB ObjectId or orderId string
 * @access  Private (Customer can only view own order; Admin can view any)
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await findOrderByIdOrCode(id);

    if (!order) {
      return sendError(res, 'Order not found.', 404);
    }

    // Customer can only view their own order
    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 'Forbidden: You do not have permission to view this order.', 403);
    }

    return sendSuccess(res, 'Order retrieved successfully.', order);
  } catch (error) {
    console.error('❌ [getOrderById Error]:', error.message);
    return sendError(res, 'Failed to retrieve order: ' + error.message, 500);
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get all orders with filtering, search, and pagination
 * @access  Private (Admin only)
 */
export const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      search,
      page = 1,
      limit = 50,
      sort = '-createdAt'
    } = req.query;

    const filter = {};

    if (status && status !== 'all') {
      filter.orderStatus = status.toLowerCase().trim();
    }

    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus.toLowerCase().trim();
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { orderId: { $regex: q, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: q, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: q, $options: 'i' } },
        { 'shippingAddress.city': { $regex: q, $options: 'i' } },
        { 'customer.name': { $regex: q, $options: 'i' } },
        { 'customer.phone': { $regex: q, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully.',
      data: orders,
      count: orders.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    console.error('❌ [getAllOrders Error]:', error.message);
    return sendError(res, 'Failed to retrieve orders: ' + error.message, 500);
  }
};

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order fulfillment status & handle inventory cancellation
 * @access  Private (Admin only)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status.toLowerCase().trim())) {
      return sendError(
        res,
        'Invalid status. Allowed values: pending, confirmed, processing, shipped, delivered, cancelled.',
        400
      );
    }

    const targetStatus = status.toLowerCase().trim();
    const order = await findOrderByIdOrCode(id);

    if (!order) {
      return sendError(res, 'Order not found.', 404);
    }

    const previousStatus = order.orderStatus;

    // If order is being cancelled now and was not cancelled before, restore stock
    if (targetStatus === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
          inStock: true
        });
      }
      order.cancelledAt = new Date();
      order.cancelReason = note || 'Cancelled by administrator.';
    }

    order.orderStatus = targetStatus;
    order.status = targetStatus;

    order.timeline.push({
      status: targetStatus,
      note: note || `Order status updated to ${targetStatus} by administrator.`,
      timestamp: new Date()
    });

    await order.save();

    return sendSuccess(res, `Order status updated to "${targetStatus}".`, order);
  } catch (error) {
    console.error('❌ [updateOrderStatus Error]:', error.message);
    return sendError(res, 'Failed to update order status: ' + error.message, 500);
  }
};

/**
 * @route   PATCH /api/orders/:id/payment-status
 * @desc    Update payment status
 * @access  Private (Admin only)
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!paymentStatus || !validStatuses.includes(paymentStatus.toLowerCase().trim())) {
      return sendError(
        res,
        'Invalid payment status. Allowed values: pending, paid, failed, refunded.',
        400
      );
    }

    const targetPaymentStatus = paymentStatus.toLowerCase().trim();
    const order = await findOrderByIdOrCode(id);

    if (!order) {
      return sendError(res, 'Order not found.', 404);
    }

    order.paymentStatus = targetPaymentStatus;

    order.timeline.push({
      status: order.orderStatus,
      note: `Payment status updated to "${targetPaymentStatus}".`,
      timestamp: new Date()
    });

    await order.save();

    return sendSuccess(res, `Payment status updated to "${targetPaymentStatus}".`, order);
  } catch (error) {
    console.error('❌ [updatePaymentStatus Error]:', error.message);
    return sendError(res, 'Failed to update payment status: ' + error.message, 500);
  }
};

/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Allow customer to cancel their own eligible pending/confirmed order and restore stock
 * @access  Private (Authenticated customer)
 */
export const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await findOrderByIdOrCode(id);

    if (!order) {
      return sendError(res, 'Order not found.', 404);
    }

    // Verify ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return sendError(res, 'Forbidden: You cannot cancel an order belonging to another customer.', 403);
    }

    // Only pending or confirmed orders can be cancelled by the customer
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return sendError(
        res,
        `Cannot cancel order with status "${order.orderStatus}". Orders that are processing, shipped, or delivered cannot be cancelled.`,
        400
      );
    }

    // Restore stock for all items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
        inStock: true
      });
    }

    order.orderStatus = 'cancelled';
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason || 'Cancelled by customer.';

    order.timeline.push({
      status: 'cancelled',
      note: `Order cancelled by customer. Reason: ${order.cancelReason}`,
      timestamp: new Date()
    });

    await order.save();

    return sendSuccess(res, 'Order cancelled successfully and inventory restored.', order);
  } catch (error) {
    console.error('❌ [cancelMyOrder Error]:', error.message);
    return sendError(res, 'Failed to cancel order: ' + error.message, 500);
  }
};
