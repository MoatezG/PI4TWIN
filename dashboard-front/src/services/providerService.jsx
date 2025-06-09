// src/services/providerService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

const providerService = {
  getAllProviders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.businessType) queryParams.append('businessType', filters.businessType);
      if (filters.rating) queryParams.append('rating', filters.rating);

      const response = await axios.get(`${API_URL}/providers?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw error;
    }
  },

  getProvidersByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/providers/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching providers for category ${category}:`, error);
      throw error;
    }
  },

  getProviderById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/providers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching provider with ID ${id}:`, error);
      throw error;
    }
  },

  getProvidersByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/providers/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting providers for user ${userId}:`, error);
      throw error;
    }
  },

  createProvider: async (providerData) => {
    try {
      const response = await axios.post(`${API_URL}/providers`, providerData);
      return response.data;
    } catch (error) {
      console.error('Error creating provider:', error);
      throw error;
    }
  },

  updateProvider: async (id, providerData) => {
    try {
      const response = await axios.put(`${API_URL}/providers/${id}`, providerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating provider with ID ${id}:`, error);
      throw error;
    }
  },

  deleteProvider: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/providers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting provider with ID ${id}:`, error);
      throw error;
    }
  },

  rateProvider: async (providerId, rating) => {
    try {
      const response = await axios.post(`${API_URL}/providers/${providerId}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error(`Error rating provider with ID ${providerId}:`, error);
      throw error;
    }
  }
};

export default providerService;
