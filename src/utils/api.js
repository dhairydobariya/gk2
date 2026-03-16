/**
 * API Service for GelKrupa Electronics Backend
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Generic API request handler with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if available
  const token = sessionStorage.getItem('admin_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Backend returns { status: 1, message: "...", data: {...} }
    if (data.status === 1) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Request failed' };
    }
  } catch (error) {
    console.error('API Request Error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error occurred' 
    };
  }
}

/**
 * API request for multipart/form-data (file uploads)
 */
async function apiRequestFormData(endpoint, formData) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {};
  
  // Add authorization token if available
  const token = sessionStorage.getItem('admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (data.status === 1) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Upload failed' };
    }
  } catch (error) {
    console.error('API Upload Error:', error);
    return { 
      success: false, 
      error: error.message || 'Upload error occurred' 
    };
  }
}

// ==================== AUTH API ====================

export const authAPI = {
  /**
   * Login admin user
   * @param {string} username 
   * @param {string} password 
   */
  login: async (username, password) => {
    return apiRequest('/Auth/Login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Verify JWT token
   * @param {string} token 
   */
  verify: async (token) => {
    return apiRequest('/Auth/Verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// ==================== CATEGORY API ====================

export const categoryAPI = {
  /**
   * Get all categories
   */
  getAll: async () => {
    return apiRequest('/Category/GetAll', {
      method: 'GET',
    });
  },

  /**
   * Get category by ID
   * @param {string} id 
   */
  getById: async (id) => {
    return apiRequest(`/Category/GetById/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create new category
   * @param {Object} categoryData - { name, description }
   */
  create: async (categoryData) => {
    return apiRequest('/Category/Create', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  /**
   * Update category
   * @param {string} id 
   * @param {Object} categoryData - { name, description }
   */
  update: async (id, categoryData) => {
    return apiRequest(`/Category/Update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  /**
   * Delete category
   * @param {string} id 
   */
  delete: async (id) => {
    return apiRequest(`/Category/Delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PRODUCT API ====================

export const productAPI = {
  /**
   * Get all products
   */
  getAll: async () => {
    return apiRequest('/Product/GetAll', {
      method: 'GET',
    });
  },

  /**
   * Get product by ID
   * @param {string} id 
   */
  getById: async (id) => {
    return apiRequest(`/Product/GetById/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Get products by category
   * @param {string} categoryId 
   */
  getByCategory: async (categoryId) => {
    return apiRequest(`/Product/GetByCategory/${categoryId}`, {
      method: 'GET',
    });
  },

  /**
   * Create new product
   * @param {FormData} formData - Form data with product fields and image
   */
  create: async (formData) => {
    return apiRequestFormData('/Product/Create', formData);
  },

  /**
   * Update product
   * @param {string} id 
   * @param {FormData} formData - Form data with product fields and optional image
   */
  update: async (id, formData) => {
    return apiRequestFormData(`/Product/Update/${id}`, formData);
  },

  /**
   * Delete product
   * @param {string} id 
   */
  delete: async (id) => {
    return apiRequest(`/Product/Delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== BANNER API ====================

export const bannerAPI = {
  /**
   * Get all banners
   */
  getAll: async () => {
    return apiRequest('/Banner/GetAll', {
      method: 'GET',
    });
  },

  /**
   * Get banner by ID
   * @param {string} id 
   */
  getById: async (id) => {
    return apiRequest(`/Banner/GetById/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Get banners by page
   * @param {string} page - 'home', 'products', 'about', 'contact', 'distributors'
   */
  getByPage: async (page) => {
    return apiRequest(`/Banner/GetByPage/${page}`, {
      method: 'GET',
    });
  },

  /**
   * Create new banner
   * @param {FormData} formData - Form data with banner fields and image
   */
  create: async (formData) => {
    return apiRequestFormData('/Banner/Create', formData);
  },

  /**
   * Update banner
   * @param {string} id 
   * @param {FormData} formData - Form data with banner fields and optional image
   */
  update: async (id, formData) => {
    return apiRequestFormData(`/Banner/Update/${id}`, formData);
  },

  /**
   * Delete banner
   * @param {string} id 
   */
  delete: async (id) => {
    return apiRequest(`/Banner/Delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== DISTRIBUTOR API ====================

export const distributorAPI = {
  /**
   * Get all distributors
   */
  getAll: async () => {
    return apiRequest('/Distributor/GetAll', {
      method: 'GET',
    });
  },

  /**
   * Get distributor by ID
   * @param {string} id 
   */
  getById: async (id) => {
    return apiRequest(`/Distributor/GetById/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Get distributors by city
   * @param {string} city 
   */
  getByCity: async (city) => {
    return apiRequest(`/Distributor/GetByCity/${city}`, {
      method: 'GET',
    });
  },

  /**
   * Create new distributor
   * @param {FormData} formData - Form data with distributor fields and optional image
   */
  create: async (formData) => {
    return apiRequestFormData('/Distributor/Create', formData);
  },

  /**
   * Update distributor
   * @param {string} id 
   * @param {FormData} formData - Form data with distributor fields and optional image
   */
  update: async (id, formData) => {
    return apiRequestFormData(`/Distributor/Update/${id}`, formData);
  },

  /**
   * Delete distributor
   * @param {string} id 
   */
  delete: async (id) => {
    return apiRequest(`/Distributor/Delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== UPLOAD API ====================

export const uploadAPI = {
  /**
   * Upload file
   * @param {FormData} formData - Form data with file
   */
  upload: async (formData) => {
    return apiRequestFormData('/Upload/Add', formData);
  },

  /**
   * Remove file
   * @param {string} filename 
   */
  remove: async (filename) => {
    return apiRequest('/Upload/Remove', {
      method: 'DELETE',
      body: JSON.stringify({ filename }),
    });
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get full image URL from backend
 * @param {string} imagePath - Relative path from backend (e.g., 'products/image.jpg')
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Use VITE_BACKEND_URL for images (without /api/v1)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  return `${baseUrl}/${imagePath}`;
}

/**
 * Store authentication token
 * @param {string} token 
 */
export function setAuthToken(token) {
  sessionStorage.setItem('admin_token', token);
}

/**
 * Get authentication token
 */
export function getAuthToken() {
  return sessionStorage.getItem('admin_token');
}

/**
 * Remove authentication token
 */
export function clearAuthToken() {
  sessionStorage.removeItem('admin_token');
  sessionStorage.removeItem('admin_authenticated');
}

/**
 * Check if user is authenticated
 */
export async function checkAuth() {
  const token = getAuthToken();
  if (!token) return false;

  const result = await authAPI.verify(token);
  return result.success;
}
