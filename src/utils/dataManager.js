// Data Manager - Handles CRUD operations with Backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Categories
export const getCategories = async () => {
  try {
    return await apiCall('/categories');
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const saveCategories = async (categories) => {
  try {
    const result = await apiCall('/categories', 'PUT', categories);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('dataUpdated', { 
      detail: { key: 'categories', data: categories } 
    }));
    return result.success;
  } catch (error) {
    console.error('Error saving categories:', error);
    return false;
  }
};

// Products
export const getProducts = async () => {
  try {
    return await apiCall('/products');
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const saveProducts = async (products) => {
  try {
    const result = await apiCall('/products', 'PUT', products);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('dataUpdated', { 
      detail: { key: 'products', data: products } 
    }));
    return result.success;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Get full products data (categories + products)
export const getProductsData = async () => {
  try {
    return await apiCall('/products/full');
  } catch (error) {
    console.error('Error fetching products data:', error);
    return { categories: [], products: [] };
  }
};

// Banners
export const getBanners = async () => {
  try {
    return await apiCall('/banners');
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
};

export const saveBanners = async (banners) => {
  try {
    const result = await apiCall('/banners', 'PUT', banners);
    window.dispatchEvent(new CustomEvent('dataUpdated', { 
      detail: { key: 'banners', data: banners } 
    }));
    return result.success;
  } catch (error) {
    console.error('Error saving banners:', error);
    return false;
  }
};

// Distributors
export const getDistributors = async () => {
  try {
    return await apiCall('/distributors');
  } catch (error) {
    console.error('Error fetching distributors:', error);
    return [];
  }
};

export const saveDistributors = async (distributors) => {
  try {
    const result = await apiCall('/distributors', 'PUT', distributors);
    window.dispatchEvent(new CustomEvent('dataUpdated', { 
      detail: { key: 'distributors', data: distributors } 
    }));
    return result.success;
  } catch (error) {
    console.error('Error saving distributors:', error);
    return false;
  }
};

