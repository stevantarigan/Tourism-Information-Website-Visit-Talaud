import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import destinationService from '../../../services/destinationService';
import './AllDestinations.css';

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

/* Format angka dengan pemisah ribuan (id-ID) */
const formatNumber = (n) => {
    const num = Number(n) || 0;
    return num.toLocaleString('id-ID');
};

/* Palet warna harmonis dengan tema Visit Talaud.
   Urutan: makin tinggi peringkat, makin pekat warnanya.
   Slot terakhir dipakai untuk "Lainnya" (netral). */
const CHART_COLORS = [
    '#0f5b9e',
    '#2f74c0',
    '#3a7bd5',
    '#00b4d8',
    '#63c8e6',
    '#b8c6d6',
];

/* =========================================================
   PIE CHART – Analisis Kepopuleran Destinasi
   ========================================================= */
const PopularityChart = ({ destinations }) => {
    const TOP_N = 5;

    const { chartData, totalViews, hasData } = useMemo(() => {
        const list = Array.isArray(destinations) ? destinations : [];

        const valid = list
            .map((d) => ({
                id: d.id,
                name: d.name || 'Tanpa Nama',
                views: Number(d.view_count) || 0,
            }))
            .filter((d) => d.views >= 0);

        const total = valid.reduce((sum, d) => sum + d.views, 0);

        if (valid.length === 0 || total === 0) {
            return { chartData: [], totalViews: 0, hasData: false };
        }

        const sorted = [...valid].sort((a, b) => b.views - a.views);

        let data;
        if (sorted.length <= TOP_N + 1) {
            data = sorted;
        } else {
            const top = sorted.slice(0, TOP_N);
            const rest = sorted.slice(TOP_N);
            const restTotal = rest.reduce((sum, d) => sum + d.views, 0);
            data = [
                ...top,
                {
                    id: '__others__',
                    name: 'Lainnya',
                    views: restTotal,
                    isOthers: true,
                    othersCount: rest.length,
                },
            ];
        }

        const withPercent = data.map((d) => ({
            ...d,
            percent: total > 0 ? (d.views / total) * 100 : 0,
        }));

        return { chartData: withPercent, totalViews: total, hasData: true };
    }, [destinations]);

    if (!hasData) {
        return (
            <section
                className="popularity-section"
                aria-label="Analisis Kepopuleran Destinasi"
            >
                <div className="popularity-card popularity-empty">
                    <div className="popularity-empty-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                            <path d="M22 12A10 10 0 0 0 12 2v10z" />
                        </svg>
                    </div>
                    <h3>Belum Ada Data Tayangan</h3>
                    <p>
                        Diagram akan muncul otomatis setelah destinasi memiliki
                        data jumlah tayangan.
                    </p>
                </div>
            </section>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;
        const item = payload[0].payload;
        return (
            <div className="popularity-tooltip">
                <div className="popularity-tooltip-title">{item.name}</div>
                <div className="popularity-tooltip-row">
                    <span>Tayangan</span>
                    <strong>{formatNumber(item.views)}</strong>
                </div>
                <div className="popularity-tooltip-row">
                    <span>Proporsi</span>
                    <strong>{item.percent.toFixed(1)}%</strong>
                </div>
                {item.isOthers && item.othersCount > 0 && (
                    <div className="popularity-tooltip-hint">
                        Gabungan {item.othersCount} destinasi lainnya
                    </div>
                )}
            </div>
        );
    };

    return (
        <section
            className="popularity-section"
            aria-label="Analisis Kepopuleran Destinasi"
        >
            <div className="popularity-card">
                <div className="popularity-header">
                    <div className="popularity-heading">
                        <h2 className="popularity-title">
                            Analisis Kepopuleran Destinasi
                        </h2>
                        <p className="popularity-subtitle">
                            Proporsi tayangan halaman tiap destinasi terhadap
                            total tayangan seluruh destinasi.
                        </p>
                    </div>

                    <div className="popularity-summary">
                        <span className="popularity-summary-label">
                            Total Tayangan
                        </span>
                        <span className="popularity-summary-value">
                            {formatNumber(totalViews)}
                        </span>
                        <span className="popularity-summary-sub">
                            akumulasi seluruh destinasi
                        </span>
                    </div>
                </div>

                <div className="popularity-body">
                    <div className="popularity-chart-wrap">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="views"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="62%"
                                    outerRadius="88%"
                                    paddingAngle={2}
                                    stroke="#ffffff"
                                    strokeWidth={3}
                                    isAnimationActive
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${entry.id ?? index}`}
                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="popularity-chart-center" aria-hidden="true">
                            <span className="popularity-chart-center-value">
                                {formatNumber(totalViews)}
                            </span>
                            <span className="popularity-chart-center-label">
                                tayangan
                            </span>
                        </div>
                    </div>

                    <ul className="popularity-legend">
                        {chartData.map((entry, index) => (
                            <li
                                key={entry.id ?? index}
                                className="popularity-legend-item"
                            >
                                <span
                                    className="popularity-legend-dot"
                                    style={{
                                        background: CHART_COLORS[index % CHART_COLORS.length],
                                    }}
                                    aria-hidden="true"
                                />
                                <div className="popularity-legend-text">
                                    <span
                                        className="popularity-legend-name"
                                        title={entry.name}
                                    >
                                        {entry.name}
                                    </span>
                                    {entry.isOthers && entry.othersCount > 0 && (
                                        <span className="popularity-legend-sub">
                                            {entry.othersCount} destinasi digabung
                                        </span>
                                    )}
                                </div>
                                <div className="popularity-legend-meta">
                                    <span className="popularity-legend-views">
                                        {formatNumber(entry.views)}
                                    </span>
                                    <span className="popularity-legend-percent">
                                        {entry.percent.toFixed(1)}%
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

/* =========================================================
   KARTU DESTINASI
   ========================================================= */
const DestinationItem = ({ dest, index, isPopular }) => {
    const rawImage = dest.cover_image || dest.image;
    const imageUrl = getImageUrl(rawImage);
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className={`dest-card ${isPopular ? 'is-popular' : ''}`}
            style={{ animationDelay: `${index * 0.06}s` }}
        >
            <div className="dest-card-img">
                {imageUrl && !imgError ? (
                    <img
                        src={imageUrl}
                        alt={dest.name}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="dest-img-placeholder">
                        <span>🏝️</span>
                    </div>
                )}
                <div className="dest-img-overlay" />

                {isPopular && (
                    <span className="dest-popular-badge">
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

                <span className="dest-views">
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
                    {formatViews(dest.view_count)}
                </span>
            </div>
            <div className="dest-card-body">
                <h3 className="dest-name">{dest.name || 'Nama Destinasi'}</h3>
                <p className="dest-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {dest.location || 'Lokasi menarik'}
                </p>
                <p className="dest-desc">
                    {dest.description?.length > 100
                        ? dest.description.substring(0, 100) + '...'
                        : dest.description || 'Deskripsi belum tersedia.'}
                </p>
                <Link to={`/destination/${dest.id}`} className="dest-btn">
                    Jelajahi
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

/* =========================================================
   HALAMAN UTAMA
   ========================================================= */
const AllDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [filteredDest, setFilteredDest] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await destinationService.getAll();
                const data = response?.data ?? response;
                const list = Array.isArray(data) ? data : [];
                setDestinations(list);
                setFilteredDest(list);
            } catch (err) {
                setError(err.message || 'Gagal memuat destinasi');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredDest(destinations);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredDest(
                destinations.filter(
                    (d) =>
                        d.name?.toLowerCase().includes(lower) ||
                        d.location?.toLowerCase().includes(lower)
                )
            );
        }
    }, [searchTerm, destinations]);

    /* Top 3 ID berdasarkan view_count tertinggi (dari SEMUA data) */
    const top3Ids = [...destinations]
        .sort((a, b) => (Number(b.view_count) || 0) - (Number(a.view_count) || 0))
        .slice(0, 3)
        .map((d) => d.id);

    if (loading) {
        return (
            <div className="dest-loading">
                <div className="dest-spinner" />
                <p>Memuat destinasi...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dest-error">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Coba Lagi</button>
            </div>
        );
    }

    return (
        <div className="destinations-page">
            <button className="back-btn" onClick={() => window.history.back()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Kembali
            </button>

            <header className="dest-header">
                <div className="dest-header-content">
                    <h1>Destinasi Wisata</h1>
                    <div className="dest-underline" />
                    <p className="dest-subtitle">
                        Temukan keindahan tersembunyi Kepulauan Talaud
                    </p>
                </div>

                <div className="search-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari destinasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {destinations.length > 0 && (
                <PopularityChart destinations={destinations} />
            )}

            {filteredDest.length === 0 && !loading ? (
                <div className="dest-empty">
                    <span>🔍</span>
                    <p>Tidak ada destinasi ditemukan</p>
                </div>
            ) : (
                <div className="dest-grid">
                    {filteredDest.map((dest, idx) => (
                        <DestinationItem
                            key={dest.id}
                            dest={dest}
                            index={idx}
                            isPopular={top3Ids.includes(dest.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllDestinations;