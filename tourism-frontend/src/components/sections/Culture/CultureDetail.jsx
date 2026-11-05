import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cultureService from '../../../services/cultureService';
import './CultureDetail.css';

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
   KOMPONEN CULTURE DETAIL
   ============================================================ */
const CultureDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [culture, setCulture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        let cancelled = false;

        const fetchCulture = async () => {
            try {
                const response = await cultureService.getById(id);
                if (!cancelled) {
                    const data = response?.data ?? response;
                    setCulture(data);
                }
            } catch (err) {
                if (!cancelled)
                    setError(err.message || 'Gagal memuat detail budaya');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchCulture();
        return () => {
            cancelled = true;
        };
    }, [id]);

    /* ---------- Parallax (desktop only) ---------- */
    const handleScroll = useCallback(() => {
        if (window.innerWidth < 768) return;
        if (heroRef.current) {
            const heroImg = heroRef.current.querySelector('.culture-hero-img');
            if (heroImg) {
                heroImg.style.transform = `translateY(${window.pageYOffset * 0.15
                    }px)`;
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

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
            <div className="culture-detail-loading">
                <div className="spinner"></div>
                <p>Memuat detail budaya...</p>
            </div>
        );
    }

    /* ============================================================
       ERROR
       ============================================================ */
    if (error) {
        return (
            <div className="culture-detail-error">
                <p>❌ {error}</p>
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

    if (!culture) return null;

    const imageUrl = getImageUrl(culture.image);
    const formattedDate = culture.event_date
        ? new Date(culture.event_date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : null;

    /* ============================================================
       RENDER
       ============================================================ */
    return (
        <div className="culture-detail">
            {/* ---------- Tombol kembali ---------- */}
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
            <div className="culture-hero" ref={heroRef}>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={culture.title}
                        className="culture-hero-img"
                    />
                )}
                <div className="culture-hero-overlay"></div>

                <div className="culture-hero-content">
                    <h1 className="culture-title">{culture.title}</h1>

                    <div className="culture-meta">
                        {culture.location && (
                            <span className="culture-location">
                                <span className="meta-icon" aria-hidden="true">
                                    📍
                                </span>
                                <span>{culture.location}</span>
                            </span>
                        )}
                        {formattedDate && (
                            <span className="culture-date">
                                <span className="meta-icon" aria-hidden="true">
                                    📅
                                </span>
                                <span>{formattedDate}</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="hero-bottom-wave"></div>
            </div>

            {/* ---------- KONTEN ---------- */}
            <div className="culture-content">
                <div className="culture-description">
                    <h2>Tentang Budaya Ini</h2>
                    <div className="description-divider"></div>
                    <p>{culture.description || 'Belum ada deskripsi.'}</p>
                </div>
            </div>
        </div>
    );
};

export default CultureDetail;