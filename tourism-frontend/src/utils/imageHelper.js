// utils/imageHelper.js
const API_BASE_URL = 'http://127.0.0.1:8000';

export const getImageUrl = (path) => {
    if (!path) return null;
    
    // Jika sudah absolute URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Jika path diawali /storage
    if (path.startsWith('/storage')) {
        return `${API_BASE_URL}${path}`;
    }
    
    // Jika path diawali storage/
    if (path.startsWith('storage/')) {
        return `${API_BASE_URL}/${path}`;
    }
    
    // Jika path diawali /uploads
    if (path.startsWith('/uploads')) {
        return `${API_BASE_URL}${path}`;
    }
    
    // Jika path diawali uploads/
    if (path.startsWith('uploads/')) {
        return `${API_BASE_URL}/${path}`;
    }
    
    // Jika path diawali heroes/ (untuk gambar hero)
    if (path.startsWith('heroes/')) {
        return `${API_BASE_URL}/storage/${path}`;
    }
    
    // Jika path adalah base64
    if (path.startsWith('data:image')) {
        return path;
    }
    
    // Default: tambahkan /storage/ di depan
    return `${API_BASE_URL}/storage/${path}`;
};

export const getImageUrlWithFallback = (path, fallback = 'https://via.placeholder.com/300x200?text=No+Image') => {
    const url = getImageUrl(path);
    return url || fallback;
};

export default getImageUrl;