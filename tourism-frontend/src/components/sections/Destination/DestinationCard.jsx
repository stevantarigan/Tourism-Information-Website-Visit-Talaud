import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DestinationCard.css';

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

/* Format angka view_count jadi lebih ringkas (1.2rb, 3.5jt) */
const formatViews = (n) => {
    const num = Number(n) || 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'jt';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'rb';
    return num;
};

const DestinationCard = ({ destination, isPopular = false }) => {
    const rawImage = destination?.cover_image || destination?.image;
    const imageUrl = getImageUrl(rawImage);
    const [imgError, setImgError] = useState(false);

    return (
        <div className={`destination-card ${isPopular ? 'is-popular' : ''}`}>
            <div className="card-image">
                {imageUrl && !imgError ? (
                    <img
                        src={imageUrl}
                        alt={destination.name || 'Destinasi'}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="card-image-placeholder">🏝️</div>
                )}
                <div className="card-image-overlay"></div>

                {/* Badge Populer - hanya untuk 3 view count tertinggi */}
                {isPopular && (
                    <span className="card-popular-badge">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Populer
                    </span>
                )}

                {/* Badge view count dengan ikon kunjungan orang */}
                <span className="card-views">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {formatViews(destination.view_count)}
                </span>
            </div>

            <div className="card-body">
                <h3 className="card-title">{destination.name || 'Nama Destinasi'}</h3>
                <p className="card-location">
                    <span className="location-icon">📍</span>
                    {destination.location || 'Lokasi menarik'}
                </p>
                <p className="card-description">
                    {destination.description || 'Deskripsi belum tersedia.'}
                </p>
                <div className="card-footer">
                    <Link to={`/destination/${destination.id}`} className="btn-detail">
                        Lihat Detail
                        <span className="btn-arrow">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DestinationCard;