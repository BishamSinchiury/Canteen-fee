const API_BASE = 'http://127.0.0.1:8000';

const api = {
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      credentials: 'include',
      headers: {
        // Only set Content-Type if NOT FormData
        ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    };

    // Set body correctly
    if (options.body && !options.isFormData && typeof options.body !== 'string') {
      config.body = JSON.stringify(options.body);
    } else if (options.body && options.isFormData) {
      config.body = options.body; // FormData
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        // Ignore if response is not JSON
      }
      const message = errorData.detail || errorData.message || `HTTP ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Handle empty response (e.g. DELETE)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    return response.json();
  },

  // ==================== AUTH ====================
  login: (email, password) =>
    api.request('/users/users/login/', {
      method: 'POST',
      body: { email, password },
    }),

  logout: () => api.request('/users/users/logout/', { method: 'POST' }),

  register: (email, name, password) =>
    api.request('/users/users/', {
      method: 'POST',
      body: { email, name, password },
    }),

  getCurrentUser: () => api.request('/users/users/me/'),

  // ==================== ITEMS ====================
  getItems: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null)
    ).toString();
    return api.request(`/items/items/${query ? `?${query}` : ''}`);
  },

  getItem: (id) => api.request(`/items/items/${id}/`),

  createItem: (data, isFormData = false) =>
    api.request('/items/items/', {
      method: 'POST',
      body: data,
      isFormData,
    }),

  updateItem: (id, data, isFormData = false) =>
    api.request(`/items/items/${id}/`, {
      method: 'PUT',
      body: data,
      isFormData,
    }),

  deleteItem: (id) =>
    api.request(`/items/items/${id}/`, { method: 'DELETE' }),

  // ==================== TRANSACTIONS ====================
  getSales: () => api.request('/transaction/sales/'),
  createSale: (data) =>
    api.request('/transaction/sales/', {
      method: 'POST',
      body: data,
    }),

  getPurchases: () => api.request('/transaction/purchases/'),
  createPurchase: (data) =>
    api.request('/transaction/purchases/', {
      method: 'POST',
      body: data,
    }),

  getIncomes: () => api.request('/transaction/incomes/'),
  createIncome: (data) =>
    api.request('/transaction/incomes/', {
      method: 'POST',
      body: data,
    }),

  getExpenses: () => api.request('/transaction/expenses/'),
  createExpense: (data) =>
    api.request('/transaction/expenses/', {
      method: 'POST',
      body: data,
    }),

  getCreditors: () => api.request('/transaction/creditors/'),
  createCreditor: (data) =>
    api.request('/transaction/creditors/', {
      method: 'POST',
      body: data,
    }),

  getVendors: () => api.request('/transaction/vendors/'),
  createVendor: (data) =>
    api.request('/transaction/vendors/', {
      method: 'POST',
      body: data,
    }),

  getCashAccount: () => api.request('/transaction/cash/'),
};

export default api;