import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import articleService from '../../../services/articleService';
import './AllArticle.css';

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
   KOMPONEN ALL ARTICLE
   ============================================================ */
const AllArticle = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

        const fetchArticles = async () => {
            try {
                const response = await articleService.getAll();
                const data = response?.data ?? response;
                if (mounted) setArticles(Array.isArray(data) ? data : []);
            } catch (err) {
                if (mounted) setError(err.message || 'Gagal memuat artikel');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchArticles();
        return () => {
            mounted = false;
        };
    }, []);

    const handleBack = () => navigate(-1);
    const handleCardClick = (id) => navigate(`/article/${id}`);

    /* ---------- Filter pencarian ---------- */
    const filteredArticles = articles.filter(
        (item) =>
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="all-article-loading">
                <div className="spinner"></div>
                <p>Memuat artikel...</p>
            </div>
        );
    }

    /* ============================================================
       ERROR
       ============================================================ */
    if (error) {
        return (
            <div className="all-article-error">
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
        <div className="all-article-page">
            {/* ---------- Header ---------- */}
            <div className="all-article-header">
                <div className="header-content">
                    <button
                        onClick={handleBack}
                        className="btn-back"
                        type="button"
                        style={isMobile ? mobileBackBtnStyle : undefined}
                    >
                        ← Kembali
                    </button>

                    <h1>Semua Artikel</h1>

                    <div className="article-stats">
                        {filteredArticles.length} Artikel
                    </div>
                </div>

                {/* Search */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Cari artikel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        aria-label="Cari artikel"
                    />
                    <span className="search-icon">🔍</span>
                </div>
            </div>

            {/* ---------- Grid ---------- */}
            <div className="all-article-grid">
                {filteredArticles.length === 0 ? (
                    <div className="no-data">
                        <span className="no-data-icon">📄</span>
                        <p>
                            {searchTerm
                                ? `Tidak ada artikel dengan kata kunci "${searchTerm}"`
                                : 'Belum ada artikel tersedia'}
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
                    filteredArticles.map((article) => {
                        const imageUrl = getImageUrl(article.thumbnail);
                        const formattedDate = new Date(
                            article.created_at
                        ).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        });
                        const excerpt =
                            article.content?.length > 150
                                ? article.content.substring(0, 150) + '...'
                                : article.content;

                        return (
                            <div
                                key={article.id}
                                className="all-article-card"
                                onClick={() => handleCardClick(article.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === 'Enter' ||
                                        e.key === ' '
                                    ) {
                                        handleCardClick(article.id);
                                    }
                                }}
                            >
                                <div className="card-image">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={article.title}
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
                                        <span>📸</span>
                                    </div>
                                    <div className="card-image-overlay">
                                        <span className="view-detail-icon">
                                            👁️
                                        </span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <h3 className="card-title">
                                        {article.title}
                                    </h3>
                                    <p className="card-excerpt">{excerpt}</p>
                                    <div className="card-meta">
                                        <span className="card-date">
                                            {formattedDate}
                                        </span>
                                        <span className="btn-readmore">
                                            Baca Selengkapnya
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

export default AllArticle;