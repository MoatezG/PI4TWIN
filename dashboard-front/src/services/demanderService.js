// src/services/demanderService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add interceptors like providerService
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

const demanderService = {
  getAllDemanders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.businessType) queryParams.append('businessType', filters.businessType);
      if (filters.rating) queryParams.append('rating', filters.rating);

      const response = await axios.get(`${API_URL}/demanders?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching demanders:', error);
      throw error;
    }
  },

  getDemandersByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/demanders/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching demanders for category ${category}:`, error);
      throw error;
    }
  },

  getDemanderById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/demanders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching demander with ID ${id}:`, error);
      throw error;
    }
  },

  getDemandersByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/demanders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting demanders for user ${userId}:`, error);
      throw error;
    }
  },

  createDemander: async (demanderData) => {
    try {
      const response = await axios.post(`${API_URL}/demanders`, demanderData);
      return response.data;
    } catch (error) {
      console.error('Error creating demander:', error);
      throw error;
    }
  },

  updateDemander: async (id, demanderData) => {
    try {
      const response = await axios.put(`${API_URL}/demanders/${id}`, demanderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating demander with ID ${id}:`, error);
      throw error;
    }
  },

  deleteDemander: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/demanders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting demander with ID ${id}:`, error);
      throw error;
    }
  },

  rateDemander: async (demanderId, rating) => {
    try {
      const response = await axios.post(`${API_URL}/demanders/${demanderId}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error(`Error rating demander with ID ${demanderId}:`, error);
      throw error;
    }
  }
};

export default demanderService;