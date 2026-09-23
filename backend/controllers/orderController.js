import Order from '../models/Order.js';
import Product from '../models/Product.js';
import WholesaleEnquiry from '../models/WholesaleEnquiry.js';
import ContactMessage from '../models/ContactMessage.js';
import { generateOrderId } from '../utils/generateOrderId.js';
import { sendResponse } from '../utils/sendResponse.js';
import { sendOrderWhatsAppNotification } from '../services/whatsappService.js';

// CREATE new order (Customer checkout)
export const createOrder = async (req, res) => {
  try {
    const { customer, items, subtotal, shipping, discount, total, paymentMethod } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
      return sendResponse(res, 400, false, 'Please fill in all required customer details (name, phone, address, city, pincode).');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendResponse(res, 400, false, 'Cart is empty. Please add items before placing an order.');
    }

    // Validate that items in order are available and in stock
    for (const item of items) {
      const prodId = item.productId || item.id;
      if (prodId) {
        let prod = null;
        if (typeof prodId === 'string' && prodId.match(/^[0-9a-fA-F]{24}$/)) {
          prod = await Product.findById(prodId);
        } else {
          prod = await Product.findOne({ slug: item.slug || prodId });
        }

        if (prod && (prod.inStock === false || (prod.stock !== undefined && prod.stock <= 0))) {
          return sendResponse(
            res,
            400,
            false,
            `"${prod.name}" is currently out of stock. Please remove it from your cart to proceed.`
          );
        }
      }
    }

    const orderId = generateOrderId();

    const newOrder = await Order.create({
      orderId,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: (customer.email || '').trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        state: customer.state || 'Maharashtra',
        pincode: customer.pincode.trim(),
        notes: customer.notes || ''
      },
      items: items.map((item) => ({
        productId: item.id || item.productId,
        name: item.name,
        slug: item.slug || '',
        image: item.image || '',
        weight: item.weight || '250g',
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        packDesign: item.packDesign || 'Classic QAMRAH Pack',
        packPriceAdjustment: Number(item.packPriceAdjustment) || 0,
        itemTotal: (Number(item.price) + (Number(item.packPriceAdjustment) || 0)) * (Number(item.quantity) || 1)
      })),
      subtotal: Number(subtotal),
      shipping: Number(shipping) || 0,
      discount: Number(discount) || 0,
      total: Number(total),
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          note: 'Order successfully placed via website.',
          timestamp: new Date()
        }
      ]
    });

    // Deduct stock for each purchased item
    for (const item of items) {
      const prodId = item.productId || item.id;
      if (prodId) {
        try {
          let prod = null;
          if (typeof prodId === 'string' && prodId.match(/^[0-9a-fA-F]{24}$/)) {
            prod = await Product.findById(prodId);
          } else {
            prod = await Product.findOne({ slug: item.slug || prodId });
          }

          if (prod && prod.stock !== undefined) {
            const purchasedQty = Number(item.quantity) || 1;
            prod.stock = Math.max(0, prod.stock - purchasedQty);
            prod.inStock = prod.stock > 0;
            await prod.save();
          }
        } catch (stockErr) {
          console.warn('[Order Stock Update Warning]:', stockErr.message);
        }
      }
    }

    // Send WhatsApp notification asynchronously (never blocks or breaks order placement)
    let whatsappResult = null;
    try {
      whatsappResult = await sendOrderWhatsAppNotification(newOrder);
      newOrder.whatsappSent = whatsappResult.success;
      newOrder.whatsappMessage = whatsappResult.messageText;
      await newOrder.save();
    } catch (waErr) {
      console.warn('[Order WhatsApp] Non-fatal WhatsApp delivery warning:', waErr.message);
    }

    return sendResponse(res, 201, true, 'Order placed successfully!', {
      order: newOrder,
      orderId: newOrder.orderId,
      whatsappFallbackUrl: whatsappResult?.fallbackUrl || `https://wa.me/916235820223`
    });
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to place order: ' + err.message);
  }
};

// GET all orders (Admin)
export const getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { 'customer.city': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Orders retrieved.', orders);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// GET single order by ID or orderId
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return sendResponse(res, 404, false, 'Order not found.');
    }

    return sendResponse(res, 200, true, 'Order details retrieved.', order);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

// UPDATE order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return sendResponse(res, 400, false, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(id);
    if (!order) {
      return sendResponse(res, 404, false, 'Order not found.');
    }

    order.status = status;
    order.timeline.push({
      status,
      note: note || `Order status updated to ${status}.`,
      timestamp: new Date()
    });

    await order.save();

    return sendResponse(res, 200, true, `Order status updated to ${status}.`, order);
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to update order status: ' + err.message);
  }
};

// GET dashboard statistics (Admin)
export const getDashboardStats = async (_req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      totalProducts,
      lowStockProducts,
      wholesaleEnquiries,
      contactMessages,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: { $in: ['Confirmed', 'Processing', 'Packed', 'Shipped'] } }),
      Order.countDocuments({ status: 'Delivered' }),
      Product.countDocuments(),
      Product.countDocuments({ stock: { $lte: 10 } }),
      WholesaleEnquiry.countDocuments({ status: 'New' }),
      ContactMessage.countDocuments({ status: 'New' }),
      Order.find().sort({ createdAt: -1 }).limit(8)
    ]);

    return sendResponse(res, 200, true, 'Dashboard statistics retrieved.', {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      totalProducts,
      lowStockProducts,
      wholesaleEnquiries,
      contactMessages,
      recentOrders
    });
  } catch (err) {
    console.error('[Dashboard Stats Error]:', err.message);
    return sendResponse(res, 200, true, 'Dashboard statistics (defaults).', {
      totalOrders: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      deliveredOrders: 0,
      totalProducts: 5,
      lowStockProducts: 0,
      wholesaleEnquiries: 0,
      contactMessages: 0,
      recentOrders: []
    });
  }
};
