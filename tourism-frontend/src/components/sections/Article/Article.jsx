import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import articleService from '../../../services/articleService';
import ArticleCard from './ArticleCard';
import './Article.css';

const Article = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    /* ---------- Fetch data ---------- */
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await articleService.getAll();
                const data = response?.data ?? response;
                setArticles(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Gagal memuat artikel');
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    /* ---------- Handler ---------- */
    const handleViewAll = () => navigate('/all-article');

    /* ---------- Loading ---------- */
    if (loading) {
        return <div className="loading-state">Memuat artikel...</div>;
    }

    /* ---------- Error ---------- */
    if (error) {
        return <div className="error-state">Error: {error}</div>;
    }

    /* ---------- Render utama ---------- */
    return (
        <section id="article" className="article">
            <div className="container">
                {/* ---------- Header ---------- */}
                <h2>Artikel Terbaru</h2>
                <p className="section-subtitle">
                    Temukan informasi menarik seputar destinasi wisata dan budaya
                </p>

                {/* ---------- Grid artikel ---------- */}
                <div className="article-list">
                    {articles.length === 0 ? (
                        <p className="no-data">Belum ada artikel tersedia</p>
                    ) : (
                        articles.slice(0, 3).map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))
                    )}
                </div>

                {/* ---------- Tombol Lihat Semua ---------- */}
                {/* Nama class unik (.article-cta) supaya tidak
                    bertabrakan dengan CSS lama. Panah pakai ::after. */}
                <div className="article-cta-wrapper">
                    <button
                        type="button"
                        className="article-cta"
                        onClick={handleViewAll}
                    >
                        Lihat Semua Artikel
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Article;