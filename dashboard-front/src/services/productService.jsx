import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
    console.log('Starting Request:', request.url, request.method, request.data);
    return request;
});

// Add response interceptor for debugging
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

const productService = {
    // Create product with image (multipart/form-data)
    createProductWithImage: async (formData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/products`, formData, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
                // DO NOT set 'Content-Type' here; browser will handle it for FormData
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product with image:', error);
            throw error;
        }
    },
    // Update product with image (multipart/form-data)
    updateProductWithImage: async (id, formData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/products/${id}`, formData, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
                // DO NOT set 'Content-Type' here; browser will handle it for FormData
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product with image:', error);
            throw error;
        }
    },
    getAllProducts: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            if (filters.category) queryParams.append('category', filters.category);
            if (filters.brand) queryParams.append('brand', filters.brand);
            if (filters.supplier_id) queryParams.append('supplier_id', filters.supplier_id);

            console.log('Fetching products with filters:', filters);
            const token = localStorage.getItem('token');
const response = await axios.get(`${API_URL}/products?${queryParams.toString()}`,
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    getProductsByCategory: async (category) => {
        try {
            if (!category) {
                throw new Error('Category is required');
            }
            console.log('Fetching products for category:', category);
            const token = localStorage.getItem('token');
const response = await axios.get(`${API_URL}/products/category/${category}`,
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
);
            return response.data;
        } catch (error) {
            console.error(`Error fetching products for category ${category}:`, {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    getProductsExpiringAfter: async (days) => {
        try {
            if (!days || isNaN(days)) {
                throw new Error('Days must be a valid number');
            }
            console.log('Fetching products expiring after:', days, 'days');
            const token = localStorage.getItem('token');
const response = await axios.get(`${API_URL}/products/expires/${days}`,
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
);
            return response.data;
        } catch (error) {
            console.error(`Error fetching products expiring after ${days} days:`, {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            if (!id) {
                throw new Error('Product ID is required');
            }
            console.log('Fetching product with ID:', id);
            const token = localStorage.getItem('token');
const response = await axios.get(`${API_URL}/products/${id}`,
  token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    createProduct: async (productData, imageFile) => {
        try {
            const token = localStorage.getItem('token');
            let payload, headers;
            if (imageFile) {
                payload = new FormData();
                Object.entries(productData).forEach(([key, value]) => {
                    payload.append(key, value);
                });
                payload.append('image', imageFile);
                headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                };
            } else {
                payload = productData;
                headers = {
                    Authorization: `Bearer ${token}`,
                };
            }
            const response = await axios.post(`${API_URL}/products`, payload, {
                headers,
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            console.log("=== Update Product Request ===");
            console.log("Product ID:", id);
            console.log("Product Data:", JSON.stringify(productData, null, 2));
            console.log("Request URL:", `${API_URL}/products/${id}`);

            const token = localStorage.getItem('token');
const response = await axios.put(`${API_URL}/products/${id}`, productData, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
            console.log("Update response:", response.data);
            return response.data;
        } catch (error) {
            console.error("=== Update Product Error ===");
            console.error("Error details:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            if (error.response) {
                throw new Error(error.response.data.error || "Failed to update product");
            }
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            if (!id) {
                throw new Error('Product ID is required for deletion');
            }
            console.log('Deleting product with ID:', id);
            const token = localStorage.getItem('token');
const response = await axios.delete(`${API_URL}/products/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
            return response.data;
        } catch (error) {
            console.error(`Error deleting product with ID ${id}:`, {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    // --- Analytics & Popularity ---
    incrementViewCount: async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/products/${id}/view`);
            return response.data;
        } catch (error) {
            console.error(`Error incrementing view count for product ${id}:`, error);
            throw error;
        }
    },
    incrementReservationCount: async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/products/${id}/reserve`);
            return response.data;
        } catch (error) {
            console.error(`Error incrementing reservation count for product ${id}:`, error);
            throw error;
        }
    },
    incrementPickupCount: async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/products/${id}/pickup`);
            return response.data;
        } catch (error) {
            console.error(`Error incrementing pickup count for product ${id}:`, error);
            throw error;
        }
    },
    incrementWastedCount: async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/products/${id}/waste`);
            return response.data;
        } catch (error) {
            console.error(`Error incrementing wasted count for product ${id}:`, error);
            throw error;
        }
    },
    getPopularProducts: async () => {
        try {
            const response = await axios.get(`${API_URL}/products/popular`);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular products:', error);
            throw error;
        }
    },
};

export default productService; 
