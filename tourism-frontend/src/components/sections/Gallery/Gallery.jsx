import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import galleryService from '../../../services/galleryService';
import './Gallery.css';

const API_BASE = 'http://127.0.0.1:8000';

/* ============================================================
   HELPER — URL gambar
   ============================================================ */
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://'))
        return imagePath;
    if (imagePath.startsWith('/storage/')) return `${API_BASE}${imagePath}`;
    if (imagePath.startsWith('storage/')) return `${API_BASE}/${imagePath}`;
    return `${API_BASE}/storage/${imagePath}`;
};

/* ============================================================
   KOMPONEN GALLERY
   ============================================================ */
const Gallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    /* ---------- Fetch data ---------- */
    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                const response = await galleryService.getAll();
                const data = Array.isArray(response)
                    ? response
                    : response?.data ?? [];
                setGalleries(data);
            } catch (err) {
                setError(err.message || 'Gagal memuat galeri');
            } finally {
                setLoading(false);
            }
        };
        fetchGalleries();
    }, []);

    /* ---------- Handler ---------- */
    const openLightbox = (imgUrl) => setSelectedImage(imgUrl);
    const closeLightbox = () => setSelectedImage(null);
    const handleViewAll = () => navigate('/all-gallery');

    /* ---------- Loading ---------- */
    if (loading) {
        return (
            <div className="gallery-loading">
                <div className="spinner"></div>
                <p>Memuat galeri...</p>
            </div>
        );
    }

    /* ---------- Error ---------- */
    if (error) {
        return (
            <div className="gallery-error">
                <p>❌ {error}</p>
            </div>
        );
    }

    /* ---------- Render utama ---------- */
    return (
        <section id="gallery" className="gallery">
            {/* ---------- Header ---------- */}
            <div className="gallery-header">
                <h2>Galeri</h2>
                <div className="title-underline"></div>
                <p className="gallery-subtitle">
                    Momen indah dari destinasi wisata kami
                </p>
            </div>

            {/* ---------- Grid galeri ---------- */}
            <div className="gallery-grid">
                {galleries.length === 0 ? (
                    <div className="no-data">
                        <span className="no-data-icon">🖼️</span>
                        <p>Belum ada foto galeri tersedia</p>
                    </div>
                ) : (
                    galleries.slice(0, 6).map((item) => {
                        const imgUrl = getImageUrl(item.image);
                        return (
                            <div
                                key={item.id}
                                className="gallery-item"
                                onClick={() => imgUrl && openLightbox(imgUrl)}
                            >
                                <img
                                    src={imgUrl}
                                    alt={item.caption || 'Galeri'}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%23f0f0f0"%3E%3Crect width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3E🖼️%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                                <div className="gallery-item-overlay">
                                    <span className="zoom-icon">🔍</span>
                                </div>
                                {item.caption && (
                                    <p className="gallery-caption">
                                        {item.caption}
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* ---------- Tombol Lihat Semua ---------- */}
            {/* TANPA <span> — panah pakai pseudo-element ::after di CSS */}
            <div className="gallery-cta-wrapper">
                <button
                    type="button"
                    className="gallery-cta"
                    onClick={handleViewAll}
                >
                    Lihat Semua Galeri
                </button>
            </div>

            {/* ---------- Lightbox ---------- */}
            {selectedImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button
                        type="button"
                        className="lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Tutup"
                    >
                        ✕
                    </button>
                    <img
                        src={selectedImage}
                        alt="Preview"
                        className="lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default Gallery;