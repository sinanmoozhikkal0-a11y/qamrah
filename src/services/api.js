import {
  defaultCategories,
  defaultPackDesigns,
  defaultProducts,
  defaultHomePage,
  defaultStoryPage,
  defaultWholesalePage,
  defaultContactPage,
  defaultFaqs,
  defaultSettings
} from '../data/defaultData.js';

// Local storage helper utilities
const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or disabled storage errors
  }
};

// WhatsApp Order Message Formatter
const formatOrderMessage = (order) => {
  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const productLines = (order.items || [])
    .map(
      (item) =>
        `- ${item.name} (${item.weight || 'Standard'}) x ${item.quantity}\n  Pack: ${item.packDesign || 'Classic QAMRAH Pack'}${
          item.packPriceAdjustment ? ` (+₹${item.packPriceAdjustment})` : ''
        }`
    )
    .join('\n');

  return `QAMRAH NEW ORDER

Order ID: ${order.orderId}
Customer Name: ${order.customer?.name || 'Customer'}
Phone: ${order.customer?.phone || 'N/A'}
Address: ${order.customer?.address || ''}, ${order.customer?.city || ''} - ${order.customer?.pincode || ''}

Products:
${productLines}

Subtotal: ₹${order.subtotal}
Shipping: ₹${order.shipping}
Total: ₹${order.total}

Order Date: ${formattedDate}
Payment Method: ${order.paymentMethod || 'Cash on Delivery'}`;
};

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://qamrah-backend-livid.vercel.app/api';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? rawApiUrl.replace(/\/+$/, '')
  : `${rawApiUrl.replace(/\/+$/, '')}/api`;

// Helper: Get JWT authorization headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('qamrah_admin_token') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper: Format and normalize product fields to guarantee bidirectional alias compatibility
const formatProduct = (p) => {
  if (!p) return p;
  const id = p._id || p.id || p.slug;
  const mainImage = p.mainImage || p.image || '/images/pouch_cashew.jpg';
  const image = p.image || p.mainImage || '/images/pouch_cashew.jpg';
  const mrp = p.mrp !== undefined ? p.mrp : (p.originalPrice !== undefined ? p.originalPrice : 0);
  const originalPrice = p.originalPrice !== undefined ? p.originalPrice : mrp;
  const packSize = p.packSize || p.weight || '250g';
  const weight = p.weight || p.packSize || '250g';
  const badge = p.badge || p.tag || '';
  const tag = p.tag || p.badge || '';
  const featured = p.featured !== undefined ? p.featured : !!p.isFeatured;
  const isFeatured = p.isFeatured !== undefined ? p.isFeatured : featured;
  const bestseller = p.bestseller !== undefined ? p.bestseller : !!p.isBestseller;
  const isBestseller = p.isBestseller !== undefined ? p.isBestseller : bestseller;
  const stock = p.stock !== undefined ? Number(p.stock) : 50;
  const inStock = p.inStock !== undefined ? p.inStock : stock > 0;

  return {
    ...p,
    id,
    _id: p._id || id,
    mainImage,
    image,
    mrp,
    originalPrice,
    packSize,
    weight,
    badge,
    tag,
    featured,
    isFeatured,
    bestseller,
    isBestseller,
    stock,
    inStock
  };
};

// Helper: Format and normalize order fields for seamless UI compatibility
const formatOrder = (order) => {
  if (!order) return order;
  const ship = order.shippingAddress || {};
  const rawStatus = order.orderStatus || order.status || 'pending';
  const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
  const paymentStatus = order.paymentStatus || 'pending';
  const total = order.totalAmount !== undefined ? order.totalAmount : (order.total !== undefined ? order.total : 0);
  const subtotal = order.itemsSubtotal !== undefined ? order.itemsSubtotal : (order.subtotal !== undefined ? order.subtotal : 0);
  const shipping = order.shippingFee !== undefined ? order.shippingFee : (order.shipping !== undefined ? order.shipping : 0);
  const discount = order.discountAmount !== undefined ? order.discountAmount : (order.discount !== undefined ? order.discount : 0);

  const customer = {
    name: ship.fullName || order.customer?.name || order.user?.name || '',
    fullName: ship.fullName || order.customer?.name || order.user?.name || '',
    phone: ship.phone || order.customer?.phone || order.user?.phone || '',
    email: ship.email || order.customer?.email || order.user?.email || '',
    address: ship.address || order.customer?.address || '',
    city: ship.city || order.customer?.city || '',
    state: ship.state || order.customer?.state || '',
    pincode: ship.postalCode || order.customer?.pincode || '',
    postalCode: ship.postalCode || order.customer?.pincode || '',
    notes: order.notes || order.customer?.notes || ''
  };

  const shippingAddress = {
    fullName: customer.name,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    postalCode: customer.pincode,
    country: ship.country || 'India'
  };

  const items = (order.items || []).map((it) => {
    const id = it.product?._id || it.product || it.id || it.productId;
    const name = it.name || it.product?.name || 'Product';
    const price = it.price !== undefined ? it.price : (it.product?.price || 0);
    const quantity = it.quantity || 1;
    const weight = it.weight || it.packSize || '250g';
    const packDesign = it.packDesign || 'Classic QAMRAH Pack';
    const packPriceAdjustment = it.packPriceAdjustment || 0;
    const itemTotal = it.itemTotal !== undefined ? it.itemTotal : ((price + packPriceAdjustment) * quantity);
    const image = it.image || it.product?.mainImage || it.product?.image || '/images/pouch_cashew.jpg';

    return {
      ...it,
      id,
      productId: id,
      product: id,
      name,
      price,
      quantity,
      weight,
      packSize: weight,
      packDesign,
      packPriceAdjustment,
      itemTotal,
      image,
      mainImage: image
    };
  });

  return {
    ...order,
    _id: order._id,
    id: order._id,
    status,
    orderStatus: rawStatus.toLowerCase(),
    paymentStatus,
    total,
    totalAmount: total,
    subtotal,
    itemsSubtotal: subtotal,
    shipping,
    shippingFee: shipping,
    discount,
    discountAmount: discount,
    customer,
    shippingAddress,
    items
  };
};

export const api = {
  // Authentication (Real JWT authentication with MongoDB backend)
  auth: {
    login: async (username, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username,
          username,
          password
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Invalid username or password.');
      }
      const token = json.data.token;
      const user = json.data.user;
      localStorage.setItem('qamrah_admin_token', token);
      localStorage.setItem('qamrah_admin_user', JSON.stringify(user));
      return {
        success: true,
        token,
        user,
        data: {
          token,
          user,
          admin: user
        }
      };
    },
    getMe: async () => {
      const token = localStorage.getItem('qamrah_admin_token');
      if (!token) throw new Error('Not authenticated.');
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        localStorage.removeItem('qamrah_admin_token');
        localStorage.removeItem('qamrah_admin_user');
        throw new Error(json.message || 'Session expired.');
      }
      const user = json.data.user;
      localStorage.setItem('qamrah_admin_user', JSON.stringify(user));
      return {
        success: true,
        data: {
          user,
          admin: user
        }
      };
    },
    logout: async () => {
      localStorage.removeItem('qamrah_admin_token');
      localStorage.removeItem('qamrah_admin_user');
      return { success: true };
    }
  },

  // Real MongoDB Products CRUD API
  products: {
    getAll: async (params = {}) => {
      try {
        const query = new URLSearchParams();
        if (params.category && params.category !== 'all') {
          query.set('category', params.category);
        }
        if (params.search && params.search.trim()) {
          query.set('search', params.search.trim());
        }
        if (params.featured === 'true' || params.featured === true) {
          query.set('featured', 'true');
        }
        if (params.bestseller === 'true' || params.bestseller === true) {
          query.set('bestseller', 'true');
        }
        if (params.status !== undefined) {
          query.set('status', params.status || 'all');
        }
        if (params.page) query.set('page', params.page);
        if (params.limit) query.set('limit', params.limit);
        if (params.sort) query.set('sort', params.sort);

        const queryString = query.toString();
        const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to fetch products');
        }

        const formatted = (json.data || []).map(formatProduct);
        return {
          success: true,
          data: formatted,
          count: json.count || formatted.length,
          pagination: json.pagination
        };
      } catch (err) {
        console.warn('⚠️ [api.products.getAll Network Warning]:', err.message);
        throw err;
      }
    },

    getByIdOrSlug: async (idOrSlug) => {
      try {
        if (!idOrSlug) throw new Error('Product identifier is required.');
        const url = `${API_BASE_URL}/products/${encodeURIComponent(idOrSlug)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok || !json.success) {
          // Fallback to explicit slug lookup
          const slugRes = await fetch(`${API_BASE_URL}/products/slug/${encodeURIComponent(idOrSlug)}`);
          const slugJson = await slugRes.json();
          if (slugRes.ok && slugJson.success) {
            return { success: true, data: formatProduct(slugJson.data) };
          }
          throw new Error(json.message || 'Product not found.');
        }

        return { success: true, data: formatProduct(json.data) };
      } catch (err) {
        console.warn(`⚠️ [api.products.getByIdOrSlug Error for "${idOrSlug}"]:`, err.message);
        throw err;
      }
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to create product');
      }
      return { success: true, data: formatProduct(json.data) };
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update product');
      }
      return { success: true, data: formatProduct(json.data) };
    },

    delete: async (id, hard = false) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}${hard ? '?hard=true' : ''}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to delete product');
      }
      return { success: true, message: json.message || 'Product removed successfully.' };
    },

    updateStatus: async (id, status) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update status');
      }
      return { success: true, data: formatProduct(json.data), message: json.message };
    },

    updateStock: async (id, stock) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stock: Number(stock) })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update stock');
      }
      return { success: true, data: formatProduct(json.data), message: json.message };
    }
  },

  // Categories
  categories: {
    getAll: async () => {
      const list = getStored('qamrah_categories', defaultCategories);
      return { success: true, data: list, count: list.length };
    },
    create: async (data) => {
      const list = getStored('qamrah_categories', defaultCategories);
      const newCat = { _id: 'cat_' + Date.now(), id: data.slug, ...data };
      const updated = [...list, newCat];
      setStored('qamrah_categories', updated);
      return { success: true, data: newCat };
    },
    update: async (id, data) => {
      const list = getStored('qamrah_categories', defaultCategories);
      const index = list.findIndex((c) => c._id === id || c.id === id || c.slug === id);
      if (index === -1) throw new Error('Category not found.');
      list[index] = { ...list[index], ...data };
      setStored('qamrah_categories', list);
      return { success: true, data: list[index] };
    },
    delete: async (id) => {
      const list = getStored('qamrah_categories', defaultCategories);
      const filtered = list.filter((c) => c._id !== id && c.id !== id && c.slug !== id);
      setStored('qamrah_categories', filtered);
      return { success: true, message: 'Category deleted.' };
    }
  },

  // Pack Designs
  packDesigns: {
    getAll: async () => {
      const list = getStored('qamrah_pack_designs', defaultPackDesigns);
      return { success: true, data: list, count: list.length };
    },
    create: async (data) => {
      const list = getStored('qamrah_pack_designs', defaultPackDesigns);
      const newPack = { _id: 'pack_' + Date.now(), ...data };
      const updated = [...list, newPack];
      setStored('qamrah_pack_designs', updated);
      return { success: true, data: newPack };
    },
    update: async (id, data) => {
      const list = getStored('qamrah_pack_designs', defaultPackDesigns);
      const index = list.findIndex((p) => p._id === id);
      if (index === -1) throw new Error('Pack design not found.');
      list[index] = { ...list[index], ...data };
      setStored('qamrah_pack_designs', list);
      return { success: true, data: list[index] };
    },
    delete: async (id) => {
      const list = getStored('qamrah_pack_designs', defaultPackDesigns);
      const filtered = list.filter((p) => p._id !== id);
      setStored('qamrah_pack_designs', filtered);
      return { success: true, message: 'Pack design deleted.' };
    }
  },

  // Real MongoDB Orders API
  orders: {
    create: async (orderPayload) => {
      // 1. Normalize items to send only verified references
      const normalizedItems = (orderPayload.items || []).map((item) => ({
        product: item.product || item.productId || item._id || item.id,
        quantity: item.quantity || 1,
        weight: item.weight || item.packSize || '250g',
        packDesign: item.packDesign || 'Classic QAMRAH Pack',
        packPriceAdjustment: Number(item.packPriceAdjustment) || 0
      }));

      // 2. Normalize shipping address
      const cust = orderPayload.customer || {};
      const ship = orderPayload.shippingAddress || {};
      const shippingAddress = {
        fullName: (ship.fullName || cust.name || '').trim(),
        phone: (ship.phone || cust.phone || '').trim(),
        address: (ship.address || cust.address || '').trim(),
        city: (ship.city || cust.city || 'Mumbai').trim(),
        state: (ship.state || cust.state || 'Maharashtra').trim(),
        postalCode: (ship.postalCode || cust.pincode || '400001').trim(),
        country: (ship.country || 'India').trim()
      };

      // Ensure customer auth token is used
      let token = typeof window !== 'undefined'
        ? localStorage.getItem('qamrah_customer_token') || localStorage.getItem('qamrah_token')
        : null;

      // If user is guest, automatically register/login using guest credentials
      if (!token && (cust.email || ship.email)) {
        const guestEmail = (cust.email || ship.email).trim().toLowerCase();
        try {
          const guestPass = 'GuestOrderPass123!';
          let authRes = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: guestEmail, password: guestPass })
          });
          let authData = await authRes.json();
          if (!authRes.ok || !authData.success) {
            const regRes = await fetch(`${API_BASE_URL}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: shippingAddress.fullName || 'Guest Client',
                email: guestEmail,
                password: guestPass,
                phone: shippingAddress.phone || ''
              })
            });
            authData = await regRes.json();
          }
          if (authData?.data?.token) {
            token = authData.data.token;
            localStorage.setItem('qamrah_customer_token', token);
            if (authData.data.user) {
              localStorage.setItem('qamrah_auth_user_v1', JSON.stringify(authData.data.user));
            }
          }
        } catch {
          // fallback
        }
      }

      // If still no token, fall back to admin token if available
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('qamrah_admin_token');
      }

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = {
        items: normalizedItems,
        shippingAddress,
        paymentMethod: orderPayload.paymentMethod || 'Cash on Delivery',
        notes: (orderPayload.notes || cust.notes || '').trim()
      };

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to place order.');
      }

      const newOrder = json.data;

      // Generate direct WhatsApp click-to-chat URL
      const adminWhatsApp = (getStored('qamrah_settings', defaultSettings).whatsappNumber || '916235820223').replace(/[^0-9]/g, '');
      const messageText = formatOrderMessage(newOrder);
      const whatsappFallbackUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(messageText)}`;

      return {
        success: true,
        data: {
          order: formatOrder(newOrder),
          orderId: newOrder.orderId,
          whatsappFallbackUrl
        }
      };
    },

    getMyOrders: async (params = {}) => {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('qamrah_customer_token') || localStorage.getItem('qamrah_token') || localStorage.getItem('qamrah_admin_token')
        : null;

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const query = new URLSearchParams();
      if (params.page) query.set('page', params.page);
      if (params.limit) query.set('limit', params.limit);

      const qs = query.toString();
      const res = await fetch(`${API_BASE_URL}/orders/my-orders${qs ? `?${qs}` : ''}`, {
        headers
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch your orders.');
      }

      return {
        success: true,
        data: (json.data || []).map(formatOrder),
        count: json.count || json.data?.length || 0,
        pagination: json.pagination
      };
    },

    getAll: async (params = {}) => {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('qamrah_admin_token')
        : null;

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const query = new URLSearchParams();
      if (params.status && params.status !== 'all') {
        query.set('status', params.status);
      }
      if (params.paymentStatus && params.paymentStatus !== 'all') {
        query.set('paymentStatus', params.paymentStatus);
      }
      if (params.search) {
        query.set('search', params.search);
      }
      if (params.page) query.set('page', params.page);
      if (params.limit) query.set('limit', params.limit);

      const qs = query.toString();
      const res = await fetch(`${API_BASE_URL}/orders${qs ? `?${qs}` : ''}`, {
        headers
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch orders.');
      }

      return {
        success: true,
        data: (json.data || []).map(formatOrder),
        count: json.count || json.data?.length || 0,
        pagination: json.pagination
      };
    },

    getById: async (id) => {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('qamrah_admin_token') || localStorage.getItem('qamrah_customer_token') || localStorage.getItem('qamrah_token')
        : null;

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Order not found.');
      }

      return {
        success: true,
        data: formatOrder(json.data)
      };
    },

    updateStatus: async (id, status, note = '') => {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('qamrah_admin_token')
        : null;

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status, note })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update order status.');
      }

      return {
        success: true,
        data: formatOrder(json.data),
        message: json.message
      };
    },

    updatePaymentStatus: async (id, paymentStatus) => {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('qamrah_admin_token')
        : null;

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/orders/${id}/payment-status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ paymentStatus })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update payment status.');
      }

      return {
        success: true,
        data: formatOrder(json.data),
        message: json.message
      };
    },

    cancel: async (id, reason = '') => {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('qamrah_customer_token') || localStorage.getItem('qamrah_token') || localStorage.getItem('qamrah_admin_token')
        : null;

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ reason })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to cancel order.');
      }

      return {
        success: true,
        data: formatOrder(json.data),
        message: json.message
      };
    },

    getStats: async () => {
      try {
        const res = await api.orders.getAll({ limit: 1000 });
        const orders = res.data || [];
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = orders.filter((o) => (o.orderStatus || o.status)?.toLowerCase() === 'pending').length;
        const confirmedOrders = orders.filter((o) => ['confirmed', 'processing', 'shipped'].includes((o.orderStatus || o.status)?.toLowerCase())).length;
        const deliveredOrders = orders.filter((o) => (o.orderStatus || o.status)?.toLowerCase() === 'delivered').length;
        return {
          success: true,
          data: {
            totalOrders: orders.length,
            totalRevenue,
            pendingOrders,
            pendingCount: pendingOrders,
            confirmedOrders,
            confirmedCount: confirmedOrders,
            deliveredOrders,
            deliveredCount: deliveredOrders,
            recentOrders: orders.slice(0, 5)
          }
        };
      } catch (e) {
        return {
          success: true,
          data: {
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            pendingCount: 0,
            confirmedOrders: 0,
            confirmedCount: 0,
            deliveredOrders: 0,
            deliveredCount: 0,
            recentOrders: []
          }
        };
      }
    }
  },

  // Home Page CMS
  home: {
    get: async () => {
      const data = getStored('qamrah_home', defaultHomePage);
      return { success: true, data };
    },
    update: async (data) => {
      setStored('qamrah_home', data);
      return { success: true, data, message: 'Home page CMS updated.' };
    }
  },

  // Story Page CMS
  story: {
    get: async () => {
      const data = getStored('qamrah_story', defaultStoryPage);
      return { success: true, data };
    },
    update: async (data) => {
      setStored('qamrah_story', data);
      return { success: true, data, message: 'Story page CMS updated.' };
    }
  },

  // Wholesale Page CMS & Enquiries
  wholesale: {
    get: async () => {
      const data = getStored('qamrah_wholesale', defaultWholesalePage);
      return { success: true, data };
    },
    update: async (data) => {
      setStored('qamrah_wholesale', data);
      return { success: true, data, message: 'Wholesale page CMS updated.' };
    },
    submitEnquiry: async (data) => {
      const enquiries = getStored('qamrah_wholesale_enquiries', []);
      const newEnquiry = {
        _id: 'enq_' + Date.now(),
        ...data,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      setStored('qamrah_wholesale_enquiries', [newEnquiry, ...enquiries]);
      return { success: true, data: newEnquiry, message: 'Enquiry submitted successfully.' };
    },
    getEnquiries: async (status = '') => {
      let enquiries = getStored('qamrah_wholesale_enquiries', []);
      if (status && status !== 'all') {
        enquiries = enquiries.filter((e) => e.status === status);
      }
      return { success: true, data: enquiries, count: enquiries.length };
    },
    updateEnquiryStatus: async (id, status, adminNotes = '') => {
      const enquiries = getStored('qamrah_wholesale_enquiries', []);
      const index = enquiries.findIndex((e) => e._id === id);
      if (index === -1) throw new Error('Enquiry not found.');
      enquiries[index] = { ...enquiries[index], status, adminNotes, updatedAt: new Date().toISOString() };
      setStored('qamrah_wholesale_enquiries', enquiries);
      return { success: true, data: enquiries[index] };
    },
    deleteEnquiry: async (id) => {
      const enquiries = getStored('qamrah_wholesale_enquiries', []);
      const filtered = enquiries.filter((e) => e._id !== id);
      setStored('qamrah_wholesale_enquiries', filtered);
      return { success: true, message: 'Enquiry deleted.' };
    }
  },

  // Contact Page CMS & Messages
  contact: {
    get: async () => {
      const data = getStored('qamrah_contact', defaultContactPage);
      return { success: true, data };
    },
    update: async (data) => {
      setStored('qamrah_contact', data);
      return { success: true, data, message: 'Contact page CMS updated.' };
    },
    sendMessage: async (data) => {
      const messages = getStored('qamrah_contact_messages', []);
      const newMsg = {
        _id: 'msg_' + Date.now(),
        ...data,
        status: 'New',
        createdAt: new Date().toISOString()
      };
      setStored('qamrah_contact_messages', [newMsg, ...messages]);
      return { success: true, data: newMsg, message: 'Message sent successfully.' };
    },
    getMessages: async (status = '') => {
      let messages = getStored('qamrah_contact_messages', []);
      if (status && status !== 'all') {
        messages = messages.filter((m) => m.status === status);
      }
      return { success: true, data: messages, count: messages.length };
    },
    updateMessageStatus: async (id, status) => {
      const messages = getStored('qamrah_contact_messages', []);
      const index = messages.findIndex((m) => m._id === id);
      if (index === -1) throw new Error('Message not found.');
      messages[index] = { ...messages[index], status, updatedAt: new Date().toISOString() };
      setStored('qamrah_contact_messages', messages);
      return { success: true, data: messages[index] };
    },
    deleteMessage: async (id) => {
      const messages = getStored('qamrah_contact_messages', []);
      const filtered = messages.filter((m) => m._id !== id);
      setStored('qamrah_contact_messages', filtered);
      return { success: true, message: 'Message deleted.' };
    }
  },

  // FAQs
  faqs: {
    getAll: async () => {
      const list = getStored('qamrah_faqs', defaultFaqs);
      return { success: true, data: list, count: list.length };
    },
    create: async (data) => {
      const list = getStored('qamrah_faqs', defaultFaqs);
      const newFaq = { _id: 'faq_' + Date.now(), ...data };
      const updated = [...list, newFaq];
      setStored('qamrah_faqs', updated);
      return { success: true, data: newFaq };
    },
    update: async (id, data) => {
      const list = getStored('qamrah_faqs', defaultFaqs);
      const index = list.findIndex((f) => f._id === id);
      if (index === -1) throw new Error('FAQ not found.');
      list[index] = { ...list[index], ...data };
      setStored('qamrah_faqs', list);
      return { success: true, data: list[index] };
    },
    delete: async (id) => {
      const list = getStored('qamrah_faqs', defaultFaqs);
      const filtered = list.filter((f) => f._id !== id);
      setStored('qamrah_faqs', filtered);
      return { success: true, message: 'FAQ deleted.' };
    }
  },

  // Media Library & Image Uploads (Cloudinary CDN backed with local cache fallback)
  media: {
    getAll: async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('qamrah_admin_token') : null;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/uploads`, { headers });
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data)) {
          return { success: true, data: json.data, count: json.data.length };
        }
      } catch {
        // Fallback to local storage on network issue
      }
      const media = getStored('qamrah_media', []);
      return { success: true, data: media, count: media.length };
    },
    upload: async (file, options) => {
      return api.uploads.uploadImage(file, options);
    },
    delete: async (id) => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('qamrah_admin_token') : null;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/uploads/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers
        });
        const json = await res.json();
        if (res.ok && json.success) {
          const media = getStored('qamrah_media', []);
          const filtered = media.filter((m) => m._id !== id && m.public_id !== id && m.url !== id);
          setStored('qamrah_media', filtered);
          return { success: true, message: json.message || 'Media item deleted.' };
        }
      } catch {
        // Fallback to local storage
      }
      const media = getStored('qamrah_media', []);
      const filtered = media.filter((m) => m._id !== id);
      setStored('qamrah_media', filtered);
      return { success: true, message: 'Media item deleted.' };
    }
  },

  uploads: {
    uploadImage: async (file, options = {}) => {
      const formData = new FormData();
      formData.append('image', file);
      if (options.folder) formData.append('folder', options.folder);
      if (options.section) formData.append('section', options.section);

      const token = typeof window !== 'undefined' ? localStorage.getItem('qamrah_admin_token') : null;
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: 'POST',
        headers,
        body: formData
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to upload image to Cloudinary');
      }

      return {
        success: true,
        data: json.data,
        message: json.message
      };
    },
    deleteImage: async (publicIdOrUrl) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('qamrah_admin_token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ publicId: publicIdOrUrl, url: publicIdOrUrl })
      });

      const json = await res.json();
      return json;
    }
  },

  images: {
    getAll: async () => {
      const media = getStored('qamrah_media', []);
      return { success: true, data: media };
    },
    getById: async (id) => {
      const media = getStored('qamrah_media', []);
      const item = media.find((m) => m._id === id);
      return { success: true, data: item || null };
    },
    update: async (id, data) => {
      const media = getStored('qamrah_media', []);
      const index = media.findIndex((m) => m._id === id);
      if (index !== -1) {
        media[index] = { ...media[index], ...data };
        setStored('qamrah_media', media);
      }
      return { success: true, data: media[index] };
    },
    replace: async (id, file) => {
      return api.media.upload(file);
    },
    delete: async (id) => {
      return api.media.delete(id);
    }
  },

  // Settings
  settings: {
    get: async () => {
      const data = getStored('qamrah_settings', defaultSettings);
      return { success: true, data };
    },
    update: async (data) => {
      setStored('qamrah_settings', data);
      return { success: true, data, message: 'Settings saved successfully.' };
    }
  }
};
