import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import galleryService from '../../../services/galleryService';
import './AllGallery.css';

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
   KOMPONEN ALL GALLERY
   ============================================================ */
const AllGallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    /* ---------- Deteksi mobile ---------- */
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= 768 : false
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* ---------- Scroll ke atas saat halaman dibuka ---------- */
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    /* ---------- Fetch data ---------- */
    useEffect(() => {
        let mounted = true;

        const fetchGalleries = async () => {
            try {
                const response = await galleryService.getAll();
                const data = Array.isArray(response)
                    ? response
                    : response?.data ?? [];
                if (mounted) setGalleries(data);
            } catch (err) {
                if (mounted) setError(err.message || 'Gagal memuat galeri');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchGalleries();
        return () => {
            mounted = false;
        };
    }, []);

    /* ---------- Lightbox ---------- */
    const openLightbox = (imgUrl) => {
        setSelectedImage(imgUrl);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = '';
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && selectedImage) closeLightbox();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [selectedImage]);

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleBack = () => navigate(-1);

    /* ---------- Filter pencarian ---------- */
    const filteredGalleries = galleries.filter(
        (item) =>
            item.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* ============================================================
       STYLE INLINE TOMBOL BACK (mobile) — Pill compact
       ============================================================ */
    const mobileBackBtnStyle = {
        position: 'fixed',
        top: 12,
        left: 12,
        zIndex: 100,
        padding: '8px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: 50,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
        color: '#2d3436',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        lineHeight: 1,
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        maxWidth: 'calc(100vw - 24px)',
    };

    /* ============================================================
       LOADING
       ============================================================ */
    if (loading) {
        return (
            <div className="all-gallery-loading">
                <div className="spinner"></div>
                <p>Memuat galeri...</p>
            </div>
        );
    }

    /* ============================================================
       ERROR
       ============================================================ */
    if (error) {
        return (
            <div className="all-gallery-error">
                <p>❌ {error}</p>
                <button
                    onClick={handleBack}
                    className="btn-back"
                    type="button"
                >
                    ← Kembali
                </button>
            </div>
        );
    }

    /* ============================================================
       RENDER
       ============================================================ */
    return (
        <div className="all-gallery-page">
            {/* ---------- Header ---------- */}
            <div className="all-gallery-header">
                <div className="header-content">
                    <button
                        onClick={handleBack}
                        className="btn-back"
                        type="button"
                        style={isMobile ? mobileBackBtnStyle : undefined}
                    >
                        ← Kembali
                    </button>

                    <h1>Semua Galeri</h1>

                    <div className="gallery-stats">
                        {filteredGalleries.length} Foto
                    </div>
                </div>

                {/* Search */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Cari foto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        aria-label="Cari foto"
                    />
                    <span className="search-icon">🔍</span>
                </div>
            </div>

            {/* ---------- Grid ---------- */}
            <div className="all-gallery-grid">
                {filteredGalleries.length === 0 ? (
                    <div className="no-data">
                        <span className="no-data-icon">📷</span>
                        <p>
                            {searchTerm
                                ? `Tidak ada foto dengan kata kunci "${searchTerm}"`
                                : 'Belum ada foto galeri tersedia'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="btn-clear-search"
                                type="button"
                            >
                                Hapus Pencarian
                            </button>
                        )}
                    </div>
                ) : (
                    filteredGalleries.map((item) => {
                        const imgUrl = getImageUrl(item.image);
                        return (
                            <div
                                key={item.id}
                                className="all-gallery-item"
                                onClick={() => imgUrl && openLightbox(imgUrl)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (
                                        (e.key === 'Enter' || e.key === ' ') &&
                                        imgUrl
                                    ) {
                                        openLightbox(imgUrl);
                                    }
                                }}
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
                                <div className="all-gallery-item-overlay">
                                    <span className="zoom-icon">🔍</span>
                                </div>
                                {item.caption && (
                                    <p className="all-gallery-caption">
                                        {item.caption}
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* ---------- Lightbox ---------- */}
            {selectedImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button
                        className="lightbox-close"
                        onClick={closeLightbox}
                        type="button"
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
        </div>
    );
};

export default AllGallery;