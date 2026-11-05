import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import articleService from '../../../services/articleService';
import './ArticleDetail.css';

const API_BASE = 'http://127.0.0.1:8000';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://'))
        return imagePath;
    if (imagePath.startsWith('/storage/'))
        return `${API_BASE}${imagePath}`;
    if (imagePath.startsWith('storage/'))
        return `${API_BASE}/${imagePath}`;
    return `${API_BASE}/storage/${imagePath}`;
};

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const heroRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        const fetchArticle = async () => {
            try {
                const response = await articleService.getById(id);
                if (!cancelled) {
                    const data = response?.data ?? response;
                    setArticle(data);
                }
            } catch (err) {
                if (!cancelled) setError(err.message || 'Gagal memuat artikel');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchArticle();
        return () => { cancelled = true; };
    }, [id]);

    // Parallax
    const handleScroll = useCallback(() => {
        if (heroRef.current) {
            const heroImg = heroRef.current.querySelector('.article-hero-img');
            if (heroImg) {
                heroImg.style.transform = `translateY(${window.pageYOffset * 0.15}px)`;
            }
        }
    }, []);
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (loading) {
        return (
            <div className="article-detail-loading">
                <div className="spinner"></div>
                <p>Memuat artikel...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="article-detail-error">
                <p>❌ {error}</p>
                <button onClick={() => navigate(-1)} className="btn-back">Kembali</button>
            </div>
        );
    }

    if (!article) return null;

    const imageUrl = getImageUrl(article.thumbnail);
    const formattedDate = new Date(article.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="article-detail">
            <button className="btn-back" onClick={() => navigate(-1)}>
                ← Kembali
            </button>

            <div className="article-hero" ref={heroRef}>
                {imageUrl && (
                    <img src={imageUrl} alt={article.title} className="article-hero-img" />
                )}
                <div className="article-hero-overlay"></div>
                <div className="article-hero-content">
                    <p className="article-date">📅 {formattedDate}</p>
                    <h1 className="article-title">{article.title}</h1>
                </div>
                <div className="hero-bottom-wave"></div>
            </div>

            <div className="article-content">
                <div className="article-body">
                    <div className="article-text"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    {/* Atau jika bukan HTML, gunakan:
                    <p className="article-text">{article.content}</p>
                    */}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;