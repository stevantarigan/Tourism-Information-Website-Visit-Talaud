import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

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

const ArticleCard = ({ article }) => {
    const imageUrl = getImageUrl(article.thumbnail);

    const formattedDate = new Date(article.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const excerpt = article.content?.length > 120
        ? article.content.substring(0, 120) + '...'
        : article.content;

    return (
        <div className="article-card">
            <div className="card-image">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={article.title}
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            const placeholder = e.target.parentNode.querySelector('.card-image-placeholder');
                            if (placeholder) placeholder.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="card-image-placeholder"
                    style={{ display: imageUrl ? 'none' : 'flex' }}
                >
                    <span>📸</span>
                </div>
            </div>
            <div className="card-body">
                <h3 className="card-title">{article.title}</h3>
                <p className="card-excerpt">{excerpt}</p>
                <div className="card-meta">
                    <span className="card-date">{formattedDate}</span>
                    <Link to={`/article/${article.id}`} className="btn-readmore">
                        Baca Selengkapnya
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;