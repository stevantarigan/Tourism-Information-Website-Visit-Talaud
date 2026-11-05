// services/userService.js
import api from '../api/axios';

const userService = {
    async getAll() {
        try {
            const response = await api.get('/users');
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('User service error:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('User service error:', error);
            throw error;
        }
    },

    async create(data) {
        try {
            console.log('📤 CREATE data:', data);
            const response = await api.post('/users', data);
            console.log('✅ CREATE response:', response.data);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('❌ CREATE error:', error.response?.data || error.message);
            throw error;
        }
    },

    async update(id, data) {
        try {
            console.log(`📤 UPDATE ID ${id} data:`, data);
            const response = await api.put(`/users/${id}`, data);
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
            const response = await api.delete(`/users/${id}`);
            console.log(`✅ DELETE response:`, response.data);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error(`❌ DELETE error:`, error.response?.data || error.message);
            throw error;
        }
    }
};

export default userService;