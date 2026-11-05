// services/destinationService.js
import api from '../api/axios';

const destinationService = {
    async getAll() {
        try {
            const response = await api.get('/destinations');
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Destination service error:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/destinations/${id}`);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Destination service error:', error);
            throw error;
        }
    },

    async create(data) {
        try {
            const isFormData = data instanceof FormData;
            console.log('📤 CREATE data:', isFormData ? 'FormData' : data);

            const config = isFormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            } : {};

            const response = await api.post('/destinations', data, config);
            console.log('✅ CREATE response:', response.data);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('❌ CREATE error:', error.response?.data || error.message);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const isFormData = data instanceof FormData;
            console.log(`📤 UPDATE ID ${id}:`, isFormData ? 'FormData' : data);

            const config = isFormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            } : {};

            const response = await api.post(`/destinations/${id}`, data, config);
            console.log(`✅ UPDATE response:`, response.data);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error(`❌ UPDATE error:`, error.response?.data || error.message);
            throw error;
        }
    },

    async delete(id) {
        try {
            console.log(`🗑️ DELETE ID: ${id}`);
            const response = await api.delete(`/destinations/${id}`);
            console.log(`✅ DELETE response:`, response.data);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error(`❌ DELETE error:`, error.response?.data || error.message);
            throw error;
        }
    }
};

export default destinationService;