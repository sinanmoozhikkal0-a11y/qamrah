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

export const api = {
  // Authentication (Client-side mock with superadmin support)
  auth: {
    login: async (username, password) => {
      // Support default QAMRAH admin or any custom credentials
      if (
        (username.trim().toUpperCase() === 'QAMRAH' && password.trim() === 'AJMAL SAHIR') ||
        (username.trim() && password.trim())
      ) {
        const user = { username: username.trim(), role: 'superadmin' };
        const token = 'qamrah_client_session_' + Date.now();
        localStorage.setItem('qamrah_admin_token', token);
        localStorage.setItem('qamrah_admin_user', JSON.stringify(user));
        return { success: true, token, user };
      }
      throw new Error('Invalid username or password.');
    },
    getMe: async () => {
      const user = getStored('qamrah_admin_user', null);
      if (!user) throw new Error('Not authenticated.');
      return { success: true, data: user };
    },
    logout: async () => {
      localStorage.removeItem('qamrah_admin_token');
      localStorage.removeItem('qamrah_admin_user');
      return { success: true };
    }
  },

  // Products
  products: {
    getAll: async (params = {}) => {
      let list = getStored('qamrah_products', defaultProducts);
      if (params.category && params.category !== 'all') {
        list = list.filter((p) => p.category === params.category || p.categoryName?.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
      }
      if (params.featured === 'true' || params.featured === true) {
        list = list.filter((p) => p.featured || p.isFeatured);
      }
      if (params.bestseller === 'true' || params.bestseller === true) {
        list = list.filter((p) => p.bestseller || p.isBestseller);
      }
      return { success: true, data: list, count: list.length };
    },
    getByIdOrSlug: async (idOrSlug) => {
      const list = getStored('qamrah_products', defaultProducts);
      const product = list.find((p) => p.slug === idOrSlug || p.id === idOrSlug || p._id === idOrSlug);
      if (!product) {
        throw new Error('Product not found.');
      }
      return { success: true, data: product };
    },
    create: async (data) => {
      const list = getStored('qamrah_products', defaultProducts);
      const newProduct = {
        _id: 'prod_' + Date.now(),
        id: data.slug || 'prod_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString()
      };
      const updated = [newProduct, ...list];
      setStored('qamrah_products', updated);
      return { success: true, data: newProduct };
    },
    update: async (id, data) => {
      const list = getStored('qamrah_products', defaultProducts);
      const index = list.findIndex((p) => p._id === id || p.id === id || p.slug === id);
      if (index === -1) throw new Error('Product not found to update.');
      const updatedItem = { ...list[index], ...data, updatedAt: new Date().toISOString() };
      list[index] = updatedItem;
      setStored('qamrah_products', list);
      return { success: true, data: updatedItem };
    },
    delete: async (id) => {
      const list = getStored('qamrah_products', defaultProducts);
      const filtered = list.filter((p) => p._id !== id && p.id !== id && p.slug !== id);
      setStored('qamrah_products', filtered);
      return { success: true, message: 'Product deleted successfully.' };
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

  // Orders
  orders: {
    create: async (orderData) => {
      const { customer, items, subtotal, shipping, discount, total, paymentMethod } = orderData;
      if (!customer || !customer.name || !customer.phone) {
        throw new Error('Please fill in required customer details.');
      }
      if (!items || !items.length) {
        throw new Error('Cart is empty.');
      }

      const orderId = `QMR-${Date.now().toString().slice(-6)}`;
      const newOrder = {
        _id: 'order_' + Date.now(),
        orderId,
        customer,
        items,
        subtotal: Number(subtotal),
        shipping: Number(shipping) || 0,
        discount: Number(discount) || 0,
        total: Number(total),
        paymentMethod: paymentMethod || 'Cash on Delivery',
        status: 'Pending',
        createdAt: new Date().toISOString(),
        timeline: [
          {
            status: 'Pending',
            note: 'Order successfully placed via website.',
            timestamp: new Date().toISOString()
          }
        ]
      };

      // Store in orders list
      const existingOrders = getStored('qamrah_orders', []);
      setStored('qamrah_orders', [newOrder, ...existingOrders]);

      // Generate direct WhatsApp click-to-chat URL
      const adminWhatsApp = (getStored('qamrah_settings', defaultSettings).whatsappNumber || '916235820223').replace(/[^0-9]/g, '');
      const messageText = formatOrderMessage(newOrder);
      const whatsappFallbackUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(messageText)}`;

      return {
        success: true,
        data: {
          order: newOrder,
          orderId: newOrder.orderId,
          whatsappFallbackUrl
        }
      };
    },
    getAll: async (params = {}) => {
      let orders = getStored('qamrah_orders', []);
      if (params.status && params.status !== 'all') {
        orders = orders.filter((o) => o.status === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        orders = orders.filter((o) => o.orderId?.toLowerCase().includes(q) || o.customer?.name?.toLowerCase().includes(q) || o.customer?.phone?.includes(q));
      }
      return { success: true, data: orders, count: orders.length };
    },
    getById: async (id) => {
      const orders = getStored('qamrah_orders', []);
      const order = orders.find((o) => o._id === id || o.orderId === id);
      if (!order) throw new Error('Order not found.');
      return { success: true, data: order };
    },
    updateStatus: async (id, status, note = '') => {
      const orders = getStored('qamrah_orders', []);
      const index = orders.findIndex((o) => o._id === id || o.orderId === id);
      if (index === -1) throw new Error('Order not found.');
      orders[index].status = status;
      if (!orders[index].timeline) orders[index].timeline = [];
      orders[index].timeline.push({
        status,
        note: note || `Status updated to ${status}`,
        timestamp: new Date().toISOString()
      });
      setStored('qamrah_orders', orders);
      return { success: true, data: orders[index] };
    },
    getStats: async () => {
      const orders = getStored('qamrah_orders', []);
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pendingCount = orders.filter((o) => o.status === 'Pending').length;
      const confirmedCount = orders.filter((o) => o.status === 'Confirmed').length;
      const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
      return {
        success: true,
        data: {
          totalOrders: orders.length,
          totalRevenue,
          pendingCount,
          confirmedCount,
          deliveredCount
        }
      };
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

  // Media Library & Image Uploads (Client-Side FileReader / Object URL storage)
  media: {
    getAll: async () => {
      const media = getStored('qamrah_media', []);
      return { success: true, data: media, count: media.length };
    },
    upload: async (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          const newMedia = {
            _id: 'media_' + Date.now(),
            url: dataUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            createdAt: new Date().toISOString()
          };
          const existing = getStored('qamrah_media', []);
          setStored('qamrah_media', [newMedia, ...existing]);
          resolve({ success: true, data: newMedia });
        };
        reader.readAsDataURL(file);
      });
    },
    delete: async (id) => {
      const media = getStored('qamrah_media', []);
      const filtered = media.filter((m) => m._id !== id);
      setStored('qamrah_media', filtered);
      return { success: true, message: 'Media item deleted.' };
    }
  },

  uploads: {
    uploadImage: async (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          resolve({
            success: true,
            data: {
              url: dataUrl,
              secure_url: dataUrl,
              public_id: 'local_' + Date.now()
            }
          });
        };
        reader.readAsDataURL(file);
      });
    },
    deleteImage: async () => {
      return { success: true, message: 'Image reference removed.' };
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
