const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('qamrah_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (username, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
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
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    getByIdOrSlug: async (id) => {
      const res = await fetch(`${API_BASE}/products/${id}`);
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Categories
  categories: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Pack Designs
  packDesigns: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/pack-designs`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE}/pack-designs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/pack-designs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/pack-designs/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Orders
  orders: {
    create: async (orderData) => {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return handleResponse(res);
    },
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/orders${query ? `?${query}` : ''}`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    updateStatus: async (id, status, note = '') => {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status, note })
      });
      return handleResponse(res);
    },
    getStats: async () => {
      const res = await fetch(`${API_BASE}/orders/dashboard/stats`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Home Page CMS
  home: {
    get: async () => {
      const res = await fetch(`${API_BASE}/home`);
      return handleResponse(res);
    },
    update: async (data) => {
      const res = await fetch(`${API_BASE}/home`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // Story Page CMS
  story: {
    get: async () => {
      const res = await fetch(`${API_BASE}/story`);
      return handleResponse(res);
    },
    update: async (data) => {
      const res = await fetch(`${API_BASE}/story`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // Wholesale Page CMS & Enquiries
  wholesale: {
    get: async () => {
      const res = await fetch(`${API_BASE}/wholesale`);
      return handleResponse(res);
    },
    update: async (data) => {
      const res = await fetch(`${API_BASE}/wholesale`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    submitEnquiry: async (data) => {
      const res = await fetch(`${API_BASE}/wholesale/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    getEnquiries: async (status = '') => {
      const query = status ? `?status=${status}` : '';
      const res = await fetch(`${API_BASE}/wholesale/enquiries${query}`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    updateEnquiryStatus: async (id, status, adminNotes = '') => {
      const res = await fetch(`${API_BASE}/wholesale/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status, adminNotes })
      });
      return handleResponse(res);
    },
    deleteEnquiry: async (id) => {
      const res = await fetch(`${API_BASE}/wholesale/enquiries/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Contact Page CMS & Messages
  contact: {
    get: async () => {
      const res = await fetch(`${API_BASE}/contact`);
      return handleResponse(res);
    },
    update: async (data) => {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    sendMessage: async (data) => {
      const res = await fetch(`${API_BASE}/contact/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    getMessages: async (status = '') => {
      const query = status ? `?status=${status}` : '';
      const res = await fetch(`${API_BASE}/contact/messages${query}`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    updateMessageStatus: async (id, status) => {
      const res = await fetch(`${API_BASE}/contact/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    },
    deleteMessage: async (id) => {
      const res = await fetch(`${API_BASE}/contact/messages/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // FAQs
  faqs: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/faqs`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/faqs/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Media Library
  media: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/media${query ? `?${query}` : ''}`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    upload: async (file, options = {}) => {
      const formData = new FormData();
      formData.append('image', file);
      if (options.folder) formData.append('folder', options.folder);
      if (options.altText) formData.append('altText', options.altText);
      if (options.section) formData.append('section', options.section);

      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: formData
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/media/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Uploads Service
  uploads: {
    uploadImage: async (file, options = {}) => {
      const formData = new FormData();
      formData.append('image', file);
      if (options.folder) formData.append('folder', options.folder);
      if (options.altText) formData.append('altText', options.altText);
      if (options.section) formData.append('section', options.section);

      const res = await fetch(`${API_BASE}/uploads/image`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: formData
      });
      return handleResponse(res);
    },
    deleteImage: async (publicId) => {
      const encodedId = encodeURIComponent(publicId);
      const res = await fetch(`${API_BASE}/uploads/image/${encodedId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Images Service
  images: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/images${query ? `?${query}` : ''}`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/images/${id}`, {
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/images/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    replace: async (id, file) => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/images/replace/${id}`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: formData
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/images/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      return handleResponse(res);
    }
  },

  // Settings
  settings: {
    get: async () => {
      const res = await fetch(`${API_BASE}/settings`);
      return handleResponse(res);
    },
    update: async (data) => {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  }
};
