// components/sections/Footer/FooterSetting.jsx
import React, { useState, useEffect } from 'react';
import footerSettingService from '../../../services/footerSettingService';
import contactService from '../../../services/contactService';
import logo from '../../../assets/icons/logo-pariwisata-talaud.png';
import './FooterSetting.css';

const FooterSetting = () => {
    const [footer, setFooter] = useState(null);
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil data footer
                let footerData = null;
                try {
                    const footerResponse = await footerSettingService.getAll();
                    console.log('📦 Respons API Footer:', footerResponse);

                    if (Array.isArray(footerResponse)) {
                        footerData = footerResponse.length > 0 ? footerResponse[0] : null;
                    } else if (footerResponse?.data) {
                        if (Array.isArray(footerResponse.data)) {
                            footerData = footerResponse.data.length > 0 ? footerResponse.data[0] : null;
                        } else {
                            footerData = footerResponse.data;
                        }
                    } else if (footerResponse?.website_name) {
                        footerData = footerResponse;
                    }
                } catch (footerErr) {
                    console.warn('⚠️ Data footer tidak tersedia:', footerErr);
                }

                console.log('📦 Data footer yang diproses:', footerData);
                setFooter(footerData);

                // Ambil data kontak
                let contactData = null;
                try {
                    const contactResponse = await contactService.getAll();
                    console.log('📦 Respons API Kontak:', contactResponse);

                    if (Array.isArray(contactResponse)) {
                        contactData = contactResponse.length > 0 ? contactResponse[0] : null;
                    } else if (contactResponse?.data) {
                        if (Array.isArray(contactResponse.data)) {
                            contactData = contactResponse.data.length > 0 ? contactResponse.data[0] : null;
                        } else {
                            contactData = contactResponse.data;
                        }
                    } else if (contactResponse?.phone) {
                        contactData = contactResponse;
                    }
                } catch (contactErr) {
                    console.warn('⚠️ Data kontak tidak tersedia:', contactErr);
                }

                console.log('📦 Data kontak yang diproses:', contactData);
                setContact(contactData);

            } catch (err) {
                console.error('❌ Gagal mengambil data:', err);
                // Jangan set error, tetap tampilkan footer dengan data default
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <footer className="footer footer-loading">
                <div className="footer-spinner"></div>
                <p>Memuat footer...</p>
            </footer>
        );
    }

    // Gunakan data dari database atau fallback ke default
    const currentYear = new Date().getFullYear();
    const websiteName = footer?.website_name || 'Pariwisata Talaud';
    const description =
        footer?.description ||
        'Jelajahi keindahan alam dan budaya Kepulauan Talaud, surga tersembunyi di perbatasan Indonesia.';
    const copyrightText =
        footer?.copyright || `© ${currentYear} ${websiteName}. Hak cipta dilindungi undang-undang.`;

    // Data kontak dari database atau fallback
    const phone = contact?.phone || '+62 812-3456-7890';
    const email = contact?.email || 'info@pariwisatatalaud.id';
    const address = contact?.address || 'Kepulauan Talaud, Sulawesi Utara';
    const facebook = contact?.facebook || '';
    const instagram = contact?.instagram || '';
    const youtube = contact?.youtube || '';
    const tiktok = contact?.tiktok || '';

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Kolom 1 – Tentang (dengan logo) */}
                    <div className="footer-col footer-brand">
                        <h3 className="footer-logo">
                            <img
                                src={logo}
                                alt="Logo Pariwisata Talaud"
                                className="logo-icon-img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            {websiteName}
                        </h3>
                        <p className="footer-description">{description}</p>
                        <div className="footer-contact">
                            {address && (
                                <p>
                                    <span className="footer-icon">📍</span>
                                    {address}
                                </p>
                            )}
                            {email && (
                                <p>
                                    <span className="footer-icon">📧</span>
                                    <a
                                        href={`mailto:${email}`}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {email}
                                    </a>
                                </p>
                            )}
                            {phone && (
                                <p>
                                    <span className="footer-icon">📞</span>
                                    <a
                                        href={`tel:${phone}`}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {phone}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Kolom 2 – Navigasi Cepat */}
                    <div className="footer-col footer-nav">
                        <h4 className="footer-heading">Navigasi</h4>
                        <ul className="footer-links">
                            <li><a href="/">Beranda</a></li>
                            <li><a href="/destinations">Destinasi</a></li>
                            <li><a href="/all-gallery">Galeri</a></li>
                            <li><a href="/all-culture">Budaya</a></li>
                            <li><a href="/all-article">Artikel</a></li>
                            <li><a href="#contact">Kontak</a></li>
                        </ul>
                    </div>

                    {/* Kolom 3 – Sosial Media */}
                    <div className="footer-col footer-social">
                        <h4 className="footer-heading">Ikuti Kami</h4>
                        <div className="social-links">
                            {facebook && facebook !== '#' && (
                                <a
                                    href={facebook}
                                    className="social-link"
                                    aria-label="Facebook"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                            )}
                            {instagram && instagram !== '#' && (
                                <a
                                    href={instagram}
                                    className="social-link"
                                    aria-label="Instagram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" />
                                    </svg>
                                </a>
                            )}
                            {youtube && youtube !== '#' && (
                                <a
                                    href={youtube}
                                    className="social-link"
                                    aria-label="YouTube"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            )}
                            {tiktok && tiktok !== '#' && (
                                <a
                                    href={tiktok}
                                    className="social-link"
                                    aria-label="TikTok"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12.525.02c1.31-.01 2.61-.01 3.91-.02.06 1.56.66 3.07 1.69 4.19 1.03 1.12 2.43 1.83 4.03 1.97v3.38c-1.39-.15-2.74-.62-3.92-1.34-.08 2.31-.41 4.6-1.34 6.73-.93 2.13-2.4 3.96-4.28 5.15-1.88 1.19-4.11 1.77-6.41 1.67-2.17-.09-4.25-.8-5.91-2.02.48.49.1 1.16-.86 1.16-.94 0-1.74-.75-1.74-1.68v-1.45c.26.06.53.09.8.09 1.85 0 3.52-.66 4.81-1.76 1.28-1.1 2.03-2.62 2.14-4.24.11-1.62-.41-3.21-1.49-4.47-.3-.35-.06-.86.4-.86h2.09c.34 0 .62.24.69.57.19.93.61 1.79 1.22 2.49.61.7 1.41 1.21 2.29 1.46.03-1.26.06-2.52.09-3.78.05-1.45.55-2.84 1.42-3.94.87-1.1 2.1-1.82 3.44-2.03z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                        {(!facebook || facebook === '#') &&
                         (!instagram || instagram === '#') &&
                         (!youtube || youtube === '#') &&
                         (!tiktok || tiktok === '#') && (
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.3)',
                                    fontSize: '0.85rem',
                                    marginTop: '8px',
                                }}
                            >
                                Belum ada tautan media sosial
                            </p>
                        )}
                    </div>
                </div>

                {/* Hak Cipta */}
                <div className="footer-bottom">
                    <p>{copyrightText}</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSetting;