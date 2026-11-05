import api from '../api/axios';

const destinationImageService = {
    async getAll() {
        try {
            const response = await api.get('/destination-images');
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Destination image service error:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/destination-images/${id}`);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Destination image service error:', error);
            throw error;
        }
    },

    async getByDestinationId(destinationId) {
        try {
            const response = await api.get(`/destination-images/destination/${destinationId}`);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Destination image service error:', error);
            throw error;
        }
    },

    async create(data) {
        try {
            const response = await api.post('/destination-images', data);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Destination image service error:', error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await api.put(`/destination-images/${id}`, data);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Destination image service error:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await api.delete(`/destination-images/${id}`);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Destination image service error:', error);
            throw error;
        }
    }
};

export default destinationImageService;