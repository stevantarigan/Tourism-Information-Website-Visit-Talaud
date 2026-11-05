import api from '../api/axios';

const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/login', { email, password });
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Auth service error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            const response = await api.post('/logout');
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Auth service error:', error);
            throw error;
        }
    },

    async getMe() {
        try {
            const response = await api.get('/me');
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Auth service error:', error);
            throw error;
        }
    }
};

export default authService;