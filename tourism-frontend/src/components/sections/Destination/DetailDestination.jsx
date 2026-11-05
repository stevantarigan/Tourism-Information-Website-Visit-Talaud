import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import destinationService from '../../../services/destinationService';
import destinationImageService from '../../../services/destinationImageService';
import './DetailDestination.css';

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
   KOMPONEN DETAIL DESTINATION
   ============================================================ */
const DetailDestination = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [destination, setDestination] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const heroRef = useRef(null);

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
    }, [id]);

    /* ---------- Fetch data ---------- */
    useEffect(() => {
        let mounted = true;

        const fetchDetail = async () => {
            try {
                const response = await destinationService.getById(id);
                const data = response?.data ?? response;
                if (mounted) setDestination(data);

                try {
                    const imgResponse =
                        await destinationImageService.getByDestinationId(id);
                    const imgData = imgResponse?.data ?? imgResponse;
                    if (mounted)
                        setImages(Array.isArray(imgData) ? imgData : []);
                } catch {
                    if (mounted) setImages([]);
                }
            } catch (err) {
                if (mounted)
                    setError(err.message || 'Gagal memuat detail destinasi');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchDetail();
        return () => {
            mounted = false;
        };
    }, [id]);

    /* ---------- Parallax (desktop only) ---------- */
    const handleScroll = useCallback(() => {
        if (window.innerWidth < 768) return;
        if (heroRef.current) {
            const scrolled = window.pageYOffset;
            const heroImg = heroRef.current.querySelector('.detail-hero-img');
            if (heroImg) {
                heroImg.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

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

    /* ============================================================
       STYLE INLINE TOMBOL BACK (mobile)
       Pill compact — teks "← Kembali" tetap muncul, ukuran kecil
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
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: 50,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
        color: '#0f172a',
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
            <div className="detail-loading">
                <div className="spinner"></div>
                <p>Memuat detail destinasi...</p>
            </div>
        );
    }

    /* ============================================================
       ERROR
       ============================================================ */
    if (error) {
        return (
            <div className="detail-error">
                <div className="error-icon">❌</div>
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="btn-back"
                    type="button"
                >
                    ← Kembali
                </button>
            </div>
        );
    }

    if (!destination) return null;

    const coverUrl = getImageUrl(destination.cover_image);

    /* ============================================================
       RENDER
       ============================================================ */
    return (
        <div className="detail-destination">
            {/* ============================================================
                TOMBOL KEMBALI
                Desktop: pill "← Kembali" (pakai CSS)
                Mobile : pill compact "← Kembali" (pakai inline style)
                ============================================================ */}
            <button
                className="btn-back"
                onClick={() => navigate(-1)}
                type="button"
                aria-label="Kembali"
                style={isMobile ? mobileBackBtnStyle : undefined}
            >
                ← Kembali
            </button>

            {/* ---------- HERO ---------- */}
            <div className="detail-hero" ref={heroRef}>
                {coverUrl && (
                    <img
                        src={coverUrl}
                        alt={destination.name}
                        className="detail-hero-img"
                    />
                )}
                <div className="detail-hero-overlay"></div>

                <div className="detail-hero-content">
                    <h1 className="detail-title">{destination.name}</h1>
                    <p className="detail-location">
                        <span className="location-icon">📍</span>
                        <span>
                            {destination.location || 'Lokasi tidak tersedia'}
                        </span>
                    </p>
                </div>

                <div className="hero-bottom-wave"></div>
            </div>

            {/* ---------- KONTEN ---------- */}
            <div className="detail-content">
                {/* Deskripsi */}
                <div className="detail-description">
                    <h2>Tentang Destinasi</h2>
                    <div className="description-divider"></div>
                    <p>
                        {destination.description || 'Belum ada deskripsi.'}
                    </p>

                </div>

                {/* Galeri foto */}
                {images.length > 0 && (
                    <div className="detail-gallery">
                        <h2>Galeri Foto</h2>
                        <p className="gallery-subtitle">
                            Klik untuk memperbesar
                        </p>

                        <div className="gallery-grid">
                            {images.map((img, idx) => {
                                const imgUrl = getImageUrl(
                                    img.image || img.url
                                );
                                return (
                                    <div
                                        key={idx}
                                        className="gallery-item"
                                        onClick={() => openLightbox(imgUrl)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                            ) {
                                                openLightbox(imgUrl);
                                            }
                                        }}
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`Galeri ${idx + 1}`}
                                            loading="lazy"
                                        />
                                        <div className="gallery-item-overlay">
                                            <span className="zoom-icon">
                                                🔍
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ---------- LIGHTBOX ---------- */}
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

export default DetailDestination;