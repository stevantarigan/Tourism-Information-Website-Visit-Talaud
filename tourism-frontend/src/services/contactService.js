import api from '../api/axios';

// Cache untuk data contacts
let contactsCache = null;

const contactService = {
    async getAll() {
        // Jika data sudah ada di cache, tidak perlu request API lagi
        if (contactsCache !== null) {
            return contactsCache;
        }

        try {
            const response = await api.get('/contacts');
            const data = response.data?.data ?? response.data;

            // Simpan hasil API ke cache
            contactsCache = data;

            return data;
        } catch (error) {
            console.error('Contact service error:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/contacts/${id}`);
            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Contact service error:', error);
            throw error;
        }
    },

    async create(data) {
        try {
            const response = await api.post('/contacts', data);

            // Hapus cache agar getAll() mengambil data terbaru
            contactsCache = null;

            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Contact service error:', error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await api.put(`/contacts/${id}`, data);

            // Hapus cache agar getAll() mengambil data terbaru
            contactsCache = null;

            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Contact service error:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await api.delete(`/contacts/${id}`);

            // Hapus cache agar getAll() mengambil data terbaru
            contactsCache = null;

            return response.data?.data ?? response.data;
        } catch (error) {
            console.error('Contact service error:', error);
            throw error;
        }
    }
};

export default contactService;