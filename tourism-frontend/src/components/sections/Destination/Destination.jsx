import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import destinationService from '../../../services/destinationService';
import DestinationCard from './DestinationCard';
import './Destination.css';

const Destination = () => {
    const [allDestinations, setAllDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    const displayedDestinations = allDestinations.slice(0, 3);

    /* Top 3 ID berdasarkan view_count tertinggi (dari SEMUA data) */
    const top3Ids = [...allDestinations]
        .sort((a, b) => (Number(b.view_count) || 0) - (Number(a.view_count) || 0))
        .slice(0, 3)
        .map((d) => d.id);

    /* Fetch data destinasi wisata */
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await destinationService.getAll();
                const data = response?.data ?? response;
                const destArray = Array.isArray(data) ? data : [];
                setAllDestinations(destArray);
            } catch (err) {
                setError(err.message || 'Gagal memuat destinasi');
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    /* ---------- Observer animasi reveal ---------- */
    useEffect(() => {
        if (displayedDestinations.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const cards = document.querySelectorAll('.destination-card');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [displayedDestinations]);

    /* ---------- Handler ---------- */
    const handleViewAll = () => navigate('/destinations');

    /* ---------- Loading ---------- */
    if (loading) {
        return (
            <div className="destination-loading">
                <div className="spinner"></div>
                <p>Memuat destinasi...</p>
            </div>
        );
    }

    /* ---------- Error ---------- */
    if (error) {
        return <div className="destination-error">Error: {error}</div>;
    }

    /* ---------- Render utama ---------- */
    return (
        <section id="destination" className="destination" ref={sectionRef}>
            <div className="container">
                {/* ---------- Header ---------- */}
                <div className="section-header">
                    <h2 className="section-title">
                        Destinasi <span className="title-highlight">Populer</span>
                    </h2>
                    <div className="title-underline"></div>
                    <p className="section-subtitle">
                        Temukan tempat wisata terbaik untuk liburan Anda
                    </p>
                </div>

                {/* ---------- Grid destinasi ---------- */}
                <div className="destination-list">
                    {displayedDestinations.length === 0 ? (
                        <div className="no-data">
                            <span className="no-data-icon">🗺️</span>
                            <p>Belum ada destinasi tersedia</p>
                        </div>
                    ) : (
                        displayedDestinations.map((dest) => (
                            <DestinationCard
                                key={dest.id}
                                destination={dest}
                                isPopular={top3Ids.includes(dest.id)}
                            />
                        ))
                    )}
                </div>

                {/* ---------- Tombol Lihat Semua ---------- */}
                {allDestinations.length > 3 && (
                    <div className="destination-cta-wrapper">
                        <button
                            type="button"
                            className="destination-cta"
                            onClick={handleViewAll}
                        >
                            Lihat Semua Destinasi
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Destination;