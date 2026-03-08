/**
 * Storage utility functions for managing product data in localStorage
 * Key: 'gelkrupa_products'
 * Falls back to in-memory storage if localStorage is unavailable
 */

const STORAGE_KEY = 'gelkrupa_products';

// In-memory fallback storage
let inMemoryStorage = null;
let isLocalStorageAvailable = true;

// Check localStorage availability
function checkLocalStorageAvailability() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage is not available. Falling back to in-memory storage.');
    console.warn('Data will not persist between browser sessions.');
    return false;
  }
}

// Initialize storage availability check
isLocalStorageAvailable = checkLocalStorageAvailability();

/**
 * Initial sample data for demonstration
 * GelKrupa Electronics - Electrical Switchgear Products
 */
const SAMPLE_DATA = {
  products: [
    {
      id: "1",
      name: "SINGLE & DOUBLE POLE MCB 'C' SERIES 10KA",
      description: "Miniature Circuit Breakers for single and double pole applications with 10KA breaking capacity. Ideal for residential and commercial electrical installations.",
      imageUrl: "",
      variants: [
        {
          id: "v1",
          name: "06A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "6A",
            "Poles": "Single & Double",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Residential & Commercial"
          }
        },
        {
          id: "v2",
          name: "10A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "10A",
            "Poles": "Single & Double",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Residential & Commercial"
          }
        },
        {
          id: "v3",
          name: "16A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "16A",
            "Poles": "Single & Double",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Residential & Commercial"
          }
        },
        {
          id: "v4",
          name: "20A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "20A",
            "Poles": "Single & Double",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Residential & Commercial"
          }
        },
        {
          id: "v5",
          name: "25A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "25A",
            "Poles": "Single & Double",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Residential & Commercial"
          }
        },
        {
          id: "v6",
          name: "32A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "32A",
            "Poles": "Single & Double",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Residential & Commercial"
          }
        },
        {
          id: "v7",
          name: "40A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "40A",
            "Poles": "Single & Double",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Residential & Commercial"
          }
        },
        {
          id: "v8",
          name: "63A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "63A",
            "Poles": "Single & Double",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Residential & Commercial"
          }
        }
      ]
    },
    {
      id: "2",
      name: "TRIPLE & FOUR POLE MCB 'C' SERIES 10KA",
      description: "Miniature Circuit Breakers for triple and four pole applications with 10KA breaking capacity. Designed for three-phase industrial and commercial installations.",
      imageUrl: "",
      variants: [
        {
          id: "v1",
          name: "06A Triple & Four Pole MCB",
          specifications: {
            "Current Rating": "6A",
            "Poles": "Triple & Four Pole",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Three-Phase Systems"
          }
        },
        {
          id: "v2",
          name: "10A Triple & Four Pole MCB",
          specifications: {
            "Current Rating": "10A",
            "Poles": "Triple & Four Pole",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Three-Phase Systems"
          }
        },
        {
          id: "v3",
          name: "16A Triple & Four Pole MCB",
          specifications: {
            "Current Rating": "16A",
            "Poles": "Triple & Four Pole",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Three-Phase Systems"
          }
        },
        {
          id: "v4",
          name: "20A Triple & Four Pole MCB",
          specifications: {
            "Current Rating": "20A",
            "Poles": "Triple & Four Pole",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Three-Phase Systems"
          }
        },
        {
          id: "v5",
          name: "25A Triple & Four Pole MCB",
          specifications: {
            "Current Rating": "25A",
            "Poles": "Triple & Four Pole",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Three-Phase Systems"
          }
        },
        {
          id: "v6",
          name: "32A Triple & Four Pole MCB",
          specifications: {
            "Current Rating": "32A",
            "Poles": "Triple & Four Pole",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Three-Phase Systems"
          }
        },
        {
          id: "v7",
          name: "40A Triple & Four Pole MCB",
          specifications: {
            "Current Rating": "40A",
            "Poles": "Triple & Four Pole",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Three-Phase Systems"
          }
        },
        {
          id: "v8",
          name: "63A Triple & Four Pole MCB",
          specifications: {
            "Current Rating": "63A",
            "Poles": "Triple & Four Pole",
            "Breaking Capacity": "10KA",
            "Series": "C Series",
            "Application": "Three-Phase Systems"
          }
        }
      ]
    },
    {
      id: "3",
      name: "MODULAR SINGLE & DOUBLE POLE MCB",
      description: "Compact modular design MCBs for single and double pole applications. Space-saving solution for modern electrical panels.",
      imageUrl: "",
      variants: [
        {
          id: "v1",
          name: "06A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "6A",
            "Poles": "Single & Double",
            "Type": "Modular",
            "Application": "Compact Installations"
          }
        },
        {
          id: "v2",
          name: "10A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "10A",
            "Poles": "Single & Double",
            "Type": "Modular",
            "Application": "Compact Installations"
          }
        },
        {
          id: "v3",
          name: "16A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "16A",
            "Poles": "Single & Double",
            "Type": "Modular",
            "Application": "Compact Installations"
          }
        },
        {
          id: "v4",
          name: "20A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "20A",
            "Poles": "Single & Double",
            "Type": "Modular",
            "Application": "Compact Installations"
          }
        },
        {
          id: "v5",
          name: "25A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "25A",
            "Poles": "Single & Double",
            "Type": "Modular",
            "Application": "Compact Installations"
          }
        },
        {
          id: "v6",
          name: "32A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "32A",
            "Poles": "Single & Double",
            "Type": "Modular",
            "Application": "Compact Installations"
          }
        }
      ]
    },
    {
      id: "4",
      name: "TINY SINGLE & DOUBLE POLE MCB",
      description: "Ultra-compact MCBs for single and double pole applications. Perfect for space-constrained installations.",
      imageUrl: "",
      variants: [
        {
          id: "v1",
          name: "06A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "6A",
            "Poles": "Single & Double",
            "Type": "Tiny/Compact",
            "Application": "Space-Constrained Areas"
          }
        },
        {
          id: "v2",
          name: "10A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "10A",
            "Poles": "Single & Double",
            "Type": "Tiny/Compact",
            "Application": "Space-Constrained Areas"
          }
        },
        {
          id: "v3",
          name: "16A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "16A",
            "Poles": "Single & Double",
            "Type": "Tiny/Compact",
            "Application": "Space-Constrained Areas"
          }
        },
        {
          id: "v4",
          name: "20A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "20A",
            "Poles": "Single & Double",
            "Type": "Tiny/Compact",
            "Application": "Space-Constrained Areas"
          }
        },
        {
          id: "v5",
          name: "25A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "25A",
            "Poles": "Single & Double",
            "Type": "Tiny/Compact",
            "Application": "Space-Constrained Areas"
          }
        },
        {
          id: "v6",
          name: "32A Single & Double Pole MCB",
          specifications: {
            "Current Rating": "32A",
            "Poles": "Single & Double",
            "Type": "Tiny/Compact",
            "Application": "Space-Constrained Areas"
          }
        }
      ]
    }
  ]
};

/**
 * Get storage error message for user display
 */
function getStorageErrorMessage(error) {
  if (error.name === 'QuotaExceededError') {
    return 'Storage quota exceeded. Your changes may not be saved. Please free up some space or contact support.';
  }
  if (!isLocalStorageAvailable) {
    return 'Storage is not available in your browser. Changes will only persist during this session.';
  }
  return 'An error occurred while saving data. Your changes may not be saved.';
}

/**
 * Retrieve products from localStorage or in-memory storage
 * @returns {Array} Array of products, or empty array if none exist or on error
 */
export function getProducts() {
  try {
    // Use in-memory storage if localStorage is unavailable
    if (!isLocalStorageAvailable) {
      if (inMemoryStorage === null) {
        return [];
      }
      return inMemoryStorage.products || [];
    }

    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
      return [];
    }
    
    const parsed = JSON.parse(data);
    
    // Validate data structure
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.products)) {
      console.error('Invalid data structure in localStorage, clearing corrupted data');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (clearError) {
        console.error('Error clearing corrupted data:', clearError);
      }
      return [];
    }
    
    return parsed.products;
  } catch (error) {
    console.error('Error retrieving products from storage:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message
    });
    
    // If data is corrupted, try to clear it
    if (isLocalStorageAvailable) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (clearError) {
        console.error('Error clearing corrupted data:', clearError);
      }
    }
    
    // Return in-memory storage if available
    if (inMemoryStorage !== null) {
      return inMemoryStorage.products || [];
    }
    
    return [];
  }
}

/**
 * Save products to localStorage or in-memory storage
 * @param {Array} products - Array of product objects to save
 * @returns {Object} Result object with success status and optional error message
 */
export function saveProducts(products) {
  const data = {
    products: products
  };

  try {
    if (!isLocalStorageAvailable) {
      // Use in-memory storage
      inMemoryStorage = data;
      console.warn('Data saved to in-memory storage. Changes will not persist after closing the browser.');
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products } 
      }));
      
      return {
        success: true,
        warning: 'Changes saved to session only. Data will not persist after closing the browser.'
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Dispatch custom event to notify other components of data change
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { products } 
    }));
    
    return { success: true };
  } catch (error) {
    console.error('Error saving products to storage:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      dataSize: JSON.stringify(data).length
    });
    
    // Fall back to in-memory storage
    inMemoryStorage = data;
    
    // Dispatch event even on error so UI updates
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { products } 
    }));
    
    const errorMessage = getStorageErrorMessage(error);
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Initialize storage with sample data if no data exists
 * @returns {Array} The initialized products array
 */
export function initializeStorage() {
  try {
    const existingProducts = getProducts();
    
    // Only initialize if no products exist
    if (existingProducts.length === 0) {
      const result = saveProducts(SAMPLE_DATA.products);
      if (!result.success) {
        console.warn('Failed to save initial sample data:', result.error);
      }
      return SAMPLE_DATA.products;
    }
    
    return existingProducts;
  } catch (error) {
    console.error('Error initializing storage:', error);
    // Return sample data even if initialization fails
    return SAMPLE_DATA.products;
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export function isStorageAvailable() {
  return isLocalStorageAvailable;
}
