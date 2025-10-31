const API_BASE = 'http://127.0.0.1:8000';

const api = {
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Request failed');
    }
    return response.json();
  },

  // Auth
  login: (email, password) => api.request('/users/users/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  logout: () => api.request('/users/users/logout/', { method: 'POST' }),
  
  register: (email, name, password) => api.request('/users/users/', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
  }),
  
  getCurrentUser: () => api.request('/users/users/me/'),

  // Items
  getItems: () => api.request('/items/items/'),
  getItem: (id) => api.request(`/items/items/${id}/`),
  createItem: (data) => api.request('/items/items/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateItem: (id, data) => api.request(`/items/items/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteItem: (id) => api.request(`/items/items/${id}/`, { method: 'DELETE' }),

  // Transactions
  getSales: () => api.request('/transaction/sales/'),
  createSale: (data) => api.request('/transaction/sales/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getPurchases: () => api.request('/transaction/purchases/'),
  createPurchase: (data) => api.request('/transaction/purchases/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getIncomes: () => api.request('/transaction/incomes/'),
  createIncome: (data) => api.request('/transaction/incomes/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getExpenses: () => api.request('/transaction/expenses/'),
  createExpense: (data) => api.request('/transaction/expenses/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Creditors & Vendors
  getCreditors: () => api.request('/transaction/creditors/'),
  createCreditor: (data) => api.request('/transaction/creditors/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getVendors: () => api.request('/transaction/vendors/'),
  createVendor: (data) => api.request('/transaction/vendors/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getCashAccount: () => api.request('/transaction/cash/'),
};

export default api;