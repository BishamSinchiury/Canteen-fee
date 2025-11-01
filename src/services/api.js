const API_BASE = "http://127.0.0.1:8000";

// low-level fetch wrapper used by fallback logic
const doFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    credentials: "include",
    headers: {
      ...(options.isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  };

  if (options.body && !options.isFormData && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  } else if (options.body && options.isFormData) {
    config.body = options.body;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {}
    const message =
      errorData.detail || errorData.message || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) return null;
  return response.json();
};

const tryPaths = async (paths = [], options = {}) => {
  let lastError = null;
  for (const p of paths) {
    try {
      return await doFetch(p, options);
    } catch (err) {
      // try next on 404
      if (err && err.status === 404) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error("All endpoints failed");
};

const api = {
  async request(endpoint, options = {}) {
    return doFetch(endpoint, options);
  },

  // ==================== AUTH ====================
  login: (email, password) =>
    api.request("/users/users/login/", {
      method: "POST",
      body: { email, password },
    }),

  logout: () => api.request("/users/users/logout/", { method: "POST" }),

  register: (email, name, password) =>
    api.request("/users/users/", {
      method: "POST",
      body: { email, name, password },
    }),

  getCurrentUser: () => api.request("/users/users/me/"),

  // ==================== ITEMS ====================
  getItems: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
    ).toString();
    const paths = [
      `/items/items/${query ? `?${query}` : ""}`,
      `/items/${query ? `?${query}` : ""}`,
    ];
    return tryPaths(paths, {});
  },

  getItem: (id) => tryPaths([`/items/items/${id}/`, `/items/${id}/`], {}),

  createItem: (data, isFormData = false) => {
    const paths = ["/items/items/", "/items/"];
    return tryPaths(paths, { method: "POST", body: data, isFormData });
  },

  updateItem: (id, data, isFormData = false) => {
    const paths = [`/items/items/${id}/`, `/items/${id}/`];
    return tryPaths(paths, { method: "PUT", body: data, isFormData });
  },

  deleteItem: (id) =>
    tryPaths([`/items/items/${id}/`, `/items/${id}/`], { method: "DELETE" }),

  // ==================== TRANSACTIONS ====================
  getSales: () => api.request("/transaction/sales/"),
  createSale: (data) =>
    api.request("/transaction/sales/", {
      method: "POST",
      body: data,
    }),

  getPurchases: () => api.request("/transaction/purchases/"),
  createPurchase: (data) =>
    api.request("/transaction/purchases/", {
      method: "POST",
      body: data,
    }),

  getIncomes: () => api.request("/transaction/incomes/"),
  createIncome: (data) =>
    api.request("/transaction/incomes/", {
      method: "POST",
      body: data,
    }),

  getExpenses: () => api.request("/transaction/expenses/"),
  createExpense: (data) =>
    api.request("/transaction/expenses/", {
      method: "POST",
      body: data,
    }),

  getCreditors: () => api.request("/transaction/creditors/"),
  createCreditor: (data) =>
    api.request("/transaction/creditors/", {
      method: "POST",
      body: data,
    }),

  getVendors: () => api.request("/transaction/vendors/"),
  createVendor: (data) =>
    api.request("/transaction/vendors/", {
      method: "POST",
      body: data,
    }),

  // NonFood endpoints (try multiple likely paths to avoid 404 if router prefix differs)
  // NonFood endpoints - try paths that match Django URL patterns.
  // The backend exposes an `items/` top-level route (see Django URLconf).
  // Try `items/nonfoods/` first, then other likely candidates as a fallback.
  getNonFoods: () =>
    tryPaths(
      [
        "/items/nonfood/",
        "/items/nonfoods/",
        "/nonfood/",
        "/nonfoods/",
        "/transaction/nonfoods/",
      ],
      {}
    ),
  getNonFood: (id) =>
    tryPaths(
      [
        `/items/nonfood/${id}/`,
        `/items/nonfoods/${id}/`,
        `/nonfood/${id}/`,
        `/nonfoods/${id}/`,
        `/transaction/nonfoods/${id}/`,
      ],
      {}
    ),
  createNonFood: (data, isMultipart = false) => {
    const paths = [
      "/items/nonfood/",
      "/items/nonfoods/",
      "/nonfood/",
      "/nonfoods/",
      "/transaction/nonfoods/",
    ];
    return tryPaths(paths, {
      method: "POST",
      body: data,
      isFormData: isMultipart,
    });
  },
  updateNonFood: (id, data, isMultipart = false) => {
    const paths = [
      `/items/nonfood/${id}/`,
      `/items/nonfoods/${id}/`,
      `/nonfood/${id}/`,
      `/nonfoods/${id}/`,
      `/transaction/nonfoods/${id}/`,
    ];
    return tryPaths(paths, {
      method: "PUT",
      body: data,
      isFormData: isMultipart,
    });
  },
  deleteNonFood: (id) =>
    tryPaths(
      [`/items/nonfood/${id}/`, `/items/nonfoods/${id}/`, `/nonfoods/${id}/`],
      {
        method: "DELETE",
      }
    ),

  getCashAccount: () => api.request("/transaction/cash/"),
};

export default api;
