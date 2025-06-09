// src/services/stockService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Request interceptor
axios.interceptors.request.use(request => {
  console.log('Starting Stock Request:', request.url, request.method, request.data);
  return request;
});

// Response interceptor
axios.interceptors.response.use(
  response => {
    console.log('Stock Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Stock API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

const stockService = {
  // Provider Stock Operations
  getProviderStock: async (providerId) => {
    try {
      const response = await axios.get(`${API_URL}/stocks/provider/${providerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting provider stock for ID ${providerId}:`, error);
      throw error;
    }
  },

  fillStockFromProductList: async (providerId, products) => {
    try {
      // Validate products array before sending
      if (!Array.isArray(products) || products.some(p => !p.product_id || typeof p.quantity !== 'number' || p.quantity <= 0)) {
        throw new Error('Invalid products array: each product must have a valid product_id and quantity.');
      }

      const response = await axios.post(`${API_URL}/stocks/fill-stock/provider`, {
        provider_id: providerId,
        products
      });
      return response.data;
    } catch (error) {
      console.error('Error filling provider stock:', error);
      throw error;
    }
  },

  // Demander Stock Operations
  getDemanderStock: async (demanderId) => {
    try {
      const response = await axios.get(`${API_URL}/stocks/demander/${demanderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting demander stock for ID ${demanderId}:`, error);
      throw error;
    }
  },

  fillStockFromProvider: async (demanderId, providerId, products) => {
    try {
      // Validate products array before sending
      if (!Array.isArray(products) || products.some(p => !p.product_id || typeof p.quantity !== 'number' || p.quantity <= 0)) {
        throw new Error('Invalid products array: each product must have a valid product_id and quantity.');
      }

      const response = await axios.post(`${API_URL}/stocks/fill-stock/demander`, {
        demander_id: demanderId,
        provider_id: providerId,
        products
      });
      return response.data;
    } catch (error) {
      console.error('Error transferring stock:', error);
      throw error;
    }
  },

  // Stock Initialization
  checkStockExists: async (userId, role) => {
    try {
      const response = await axios.get(`${API_URL}/stocks/check-stock/${userId}?role=${role}`);
      return response.data;
    } catch (error) {
      console.error(`Error checking stock existence for ${role} ${userId}:`, error);
      throw error;
    }
  },

  initializeProviderStock: async (providerId) => {
    try {
      const response = await axios.post(`${API_URL}/stocks/get-or-create/provider`, {
        provider_id: providerId
      });
      return response.data;
    } catch (error) {
      console.error(`Error ensuring single stock for provider ${providerId}:`, error);
      throw error;
    }
  },

  initializeDemanderStock: async (demanderId) => {
    try {
      const response = await axios.post(`${API_URL}/stocks/get-or-create/demander`, {
        demander_id: demanderId
      });
      return response.data;
    } catch (error) {
      console.error(`Error ensuring single stock for demander ${demanderId}:`, error);
      throw error;
    }
  },

  // Provider Management
  getProvidersByUserId: async (userId) => {
    try {
      // Corrected endpoint from '/stocks/providers' to '/providers'
      const response = await axios.get(`${API_URL}/providers/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting providers for user ${userId}:`, error);
      throw error;
    }
  },

  // Stock Status Updates
  updateStockStatus: async (stockId, status) => {
    try {
      const response = await axios.patch(`${API_URL}/stocks/${stockId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating stock status for ${stockId}
        :`, error);
      throw error;
    }
  },

  // Stock Expiration Management
  getExpiringStock: async (days) => {
    try {
      const response = await axios.get(`${API_URL}/stocks/expiring/${days}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting expiring stock within ${days} days:`, error);
      throw error;
    }
  }
};

export default stockService;