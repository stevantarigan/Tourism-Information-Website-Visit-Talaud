import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cultureService from '../../../services/cultureService';
import CultureCard from './CultureCard';
import './Culture.css';

const Culture = () => {
    const [cultures, setCultures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    /* ---------- Fetch data ---------- */
    useEffect(() => {
        const fetchCultures = async () => {
            try {
                const response = await cultureService.getAll();
                const data = response?.data ?? response;
                setCultures(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Gagal memuat budaya');
            } finally {
                setLoading(false);
            }
        };
        fetchCultures();
    }, []);

    /* ---------- Handler ---------- */
    const handleViewAll = () => navigate('/all-culture');

    /* ---------- Loading ---------- */
    if (loading) {
        return <div className="culture-loading">Memuat budaya...</div>;
    }

    /* ---------- Error ---------- */
    if (error) {
        return <div className="culture-error">Error: {error}</div>;
    }

    /* ---------- Render utama ---------- */
    return (
        <section id="culture" className="culture">
            {/* ---------- Header ---------- */}
            <div className="culture-header">
                <h2>Budaya &amp; Tradisi</h2>
                <p className="culture-subtitle">
                    Warisan budaya yang kaya dari Talaud
                </p>
                <div className="title-underline"></div>
            </div>

            {/* ---------- Grid budaya ---------- */}
            <div className="culture-list">
                {cultures.length === 0 ? (
                    <p className="no-data">Belum ada data budaya tersedia</p>
                ) : (
                    cultures.slice(0, 4).map((culture) => (
                        <CultureCard key={culture.id} culture={culture} />
                    ))
                )}
            </div>

            {/* ---------- Tombol Lihat Semua ---------- */}
            {/* Nama class unik (.culture-cta) supaya tidak
                bertabrakan dengan CSS lama. Panah pakai ::after. */}
            <div className="culture-cta-wrapper">
                <button
                    type="button"
                    className="culture-cta"
                    onClick={handleViewAll}
                >
                    Lihat Semua Budaya
                </button>
            </div>
        </section>
    );
};

export default Culture;