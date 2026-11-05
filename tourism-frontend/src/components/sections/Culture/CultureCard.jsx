import React from 'react';
import { Link } from 'react-router-dom';
import './CultureCard.css';

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

const CultureCard = ({ culture }) => {
    const imageUrl = getImageUrl(culture.image);
    const formattedDate = culture.event_date
        ? new Date(culture.event_date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : null;

    return (
        <div className="culture-card">
            <div className="card-image">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={culture.title}
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            const placeholder =
                                e.target.parentNode.querySelector('.card-image-placeholder');
                            if (placeholder) placeholder.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="card-image-placeholder"
                    style={{ display: imageUrl ? 'none' : 'flex' }}
                >
                    🎭
                </div>
                <div className="card-image-overlay"></div>
            </div>

            <div className="card-body">
                <h3 className="card-title">{culture.title}</h3>

                {culture.location && (
                    <p className="card-location">
                        <span className="location-icon">📍</span>
                        {culture.location}
                    </p>
                )}

                {formattedDate && (
                    <p className="card-date">
                        <span className="date-icon">📅</span>
                        {formattedDate}
                    </p>
                )}

                <p className="card-description">
                    {culture.description?.length > 100
                        ? culture.description.substring(0, 100) + '...'
                        : culture.description || 'Deskripsi belum tersedia.'}
                </p>

                <div className="card-footer">
                    <Link to={`/culture/${culture.id}`} className="btn-detail">
                        Selengkapnya
                        <span className="btn-arrow">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CultureCard;