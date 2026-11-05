import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cultureService from '../../../services/cultureService';
import './AllCulture.css';

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
   KOMPONEN ALL CULTURE
   ============================================================ */
const AllCulture = () => {
    const [cultures, setCultures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
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

        const fetchCultures = async () => {
            try {
                const response = await cultureService.getAll();
                const data = response?.data ?? response;
                if (mounted) setCultures(Array.isArray(data) ? data : []);
            } catch (err) {
                if (mounted) setError(err.message || 'Gagal memuat budaya');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchCultures();
        return () => {
            mounted = false;
        };
    }, []);

    const handleBack = () => navigate(-1);
    const handleCardClick = (id) => navigate(`/culture/${id}`);

    /* ---------- Filter ---------- */
    const locations = [
        ...new Set(cultures.map((item) => item.location).filter(Boolean)),
    ];

    const filteredCultures = cultures.filter((item) => {
        const matchSearch =
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchLocation = filterLocation
            ? item.location === filterLocation
            : true;
        return matchSearch && matchLocation;
    });

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
            <div className="all-culture-loading">
                <div className="spinner"></div>
                <p>Memuat budaya...</p>
            </div>
        );
    }

    /* ============================================================
       ERROR
       ============================================================ */
    if (error) {
        return (
            <div className="all-culture-error">
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
        <div className="all-culture-page">
            {/* ---------- Header ---------- */}
            <div className="all-culture-header">
                <div className="header-content">
                    <button
                        onClick={handleBack}
                        className="btn-back"
                        type="button"
                        style={isMobile ? mobileBackBtnStyle : undefined}
                    >
                        ← Kembali
                    </button>

                    <h1>Semua Budaya &amp; Tradisi</h1>

                    <div className="culture-stats">
                        {filteredCultures.length} Budaya
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="filter-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Cari budaya..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            aria-label="Cari budaya"
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    {locations.length > 0 && (
                        <select
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                            className="filter-select"
                            aria-label="Filter lokasi"
                        >
                            <option value="">Semua Lokasi</option>
                            {locations.map((location, index) => (
                                <option key={index} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* ---------- Grid ---------- */}
            <div className="all-culture-grid">
                {filteredCultures.length === 0 ? (
                    <div className="no-data">
                        <span className="no-data-icon">🎭</span>
                        <p>
                            {searchTerm || filterLocation
                                ? 'Tidak ada budaya dengan kriteria pencarian'
                                : 'Belum ada data budaya tersedia'}
                        </p>
                        {(searchTerm || filterLocation) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterLocation('');
                                }}
                                className="btn-clear-filter"
                                type="button"
                            >
                                Hapus Filter
                            </button>
                        )}
                    </div>
                ) : (
                    filteredCultures.map((culture) => {
                        const imageUrl = getImageUrl(culture.image);
                        const formattedDate = culture.event_date
                            ? new Date(culture.event_date).toLocaleDateString(
                                  'id-ID',
                                  {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                  }
                              )
                            : null;

                        return (
                            <div
                                key={culture.id}
                                className="all-culture-card"
                                onClick={() => handleCardClick(culture.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === 'Enter' ||
                                        e.key === ' '
                                    ) {
                                        handleCardClick(culture.id);
                                    }
                                }}
                            >
                                <div className="card-image">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={culture.title}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display =
                                                    'none';
                                                const placeholder =
                                                    e.target.parentNode.querySelector(
                                                        '.card-image-placeholder'
                                                    );
                                                if (placeholder)
                                                    placeholder.style.display =
                                                        'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="card-image-placeholder"
                                        style={{
                                            display: imageUrl
                                                ? 'none'
                                                : 'flex',
                                        }}
                                    >
                                        🎭
                                    </div>
                                    <div className="card-image-overlay">
                                        <span className="view-detail-icon">
                                            👁️
                                        </span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <h3 className="card-title">
                                        {culture.title}
                                    </h3>

                                    {culture.location && (
                                        <p className="card-location">
                                            <span className="location-icon">
                                                📍
                                            </span>
                                            {culture.location}
                                        </p>
                                    )}

                                    {formattedDate && (
                                        <p className="card-date">
                                            <span className="date-icon">
                                                📅
                                            </span>
                                            {formattedDate}
                                        </p>
                                    )}

                                    <p className="card-description">
                                        {culture.description?.length > 120
                                            ? culture.description.substring(
                                                  0,
                                                  120
                                              ) + '...'
                                            : culture.description ||
                                              'Deskripsi belum tersedia.'}
                                    </p>

                                    <div className="card-footer">
                                        <span className="btn-detail">
                                            Selengkapnya
                                            <span className="btn-arrow">
                                                →
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AllCulture;