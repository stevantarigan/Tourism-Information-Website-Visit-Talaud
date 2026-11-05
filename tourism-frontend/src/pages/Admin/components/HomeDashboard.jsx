// pages/Admin/components/HomeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeDashboard.css';

// Import services
import heroService from '../../../services/heroService';
import destinationService from '../../../services/destinationService';
import galleryService from '../../../services/galleryService';
import cultureService from '../../../services/cultureService';
import articleService from '../../../services/articleService';
import contactService from '../../../services/contactService';
import footerSettingService from '../../../services/footerSettingService';
import userService from '../../../services/userService';

// ===== Icon Components =====
const Icons = {
    Hero: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    ),
    Destination: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Gallery: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    Culture: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Article: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    Contact: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    Footer: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
    ),
    Users: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    ArrowRight: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    )
};

// ===== Mapping menu key ke label =====
const menuKeyToLabel = {
    hero: 'Hero Section',
    destinations: 'Destinasi',
    gallery: 'Galeri',
    culture: 'Budaya',
    articles: 'Artikel',
    contact: 'Pesan Masuk',
    footer: 'Footer',
    users: 'User Management'
};

const HomeDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        hero: 0,
        destinations: 0,
        gallery: 0,
        culture: 0,
        articles: 0,
        contacts: 0,
        footer: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchAllStats();
        
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchAllStats = async () => {
        try {
            const [
                heroData,
                destData,
                galleryData,
                cultureData,
                articleData,
                contactData,
                footerData,
                userData
            ] = await Promise.all([
                heroService.getAll().catch(() => []),
                destinationService.getAll().catch(() => []),
                galleryService.getAll().catch(() => []),
                cultureService.getAll().catch(() => []),
                articleService.getAll().catch(() => []),
                contactService.getAll().catch(() => []),
                footerSettingService.getAll().catch(() => []),
                userService.getAll().catch(() => [])
            ]);

            setStats({
                hero: Array.isArray(heroData) ? heroData.length : 0,
                destinations: Array.isArray(destData) ? destData.length : 0,
                gallery: Array.isArray(galleryData) ? galleryData.length : 0,
                culture: Array.isArray(cultureData) ? cultureData.length : 0,
                articles: Array.isArray(articleData) ? articleData.length : 0,
                contacts: Array.isArray(contactData) ? contactData.length : 0,
                footer: Array.isArray(footerData) ? footerData.length : 0,
                users: Array.isArray(userData) ? userData.length : 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // ===== FUNGSI NAVIGASI KE MANAGER =====
    const navigateToManager = (menuKey) => {
        const event = new CustomEvent('menuChange', { 
            detail: { menu: menuKey } 
        });
        window.dispatchEvent(event);
        
        navigate('/admin/dashboard', { 
            state: { activeMenu: menuKey } 
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // ===== MENU ITEMS =====
    const menuItems = [
        { 
            key: 'hero', 
            label: 'Hero', 
            icon: Icons.Hero,
            color: '#2563EB',
            bgColor: 'rgba(37, 99, 235, 0.08)',
            count: stats.hero,
            description: 'Kelola hero section'
        },
        { 
            key: 'destinations', 
            label: 'Destinasi', 
            icon: Icons.Destination,
            color: '#16A34A',
            bgColor: 'rgba(22, 163, 74, 0.08)',
            count: stats.destinations,
            description: 'Kelola data destinasi wisata'
        },
        { 
            key: 'gallery', 
            label: 'Galeri', 
            icon: Icons.Gallery,
            color: '#D97706',
            bgColor: 'rgba(217, 119, 6, 0.08)',
            count: stats.gallery,
            description: 'Upload dan atur foto galeri'
        },
        { 
            key: 'culture', 
            label: 'Budaya', 
            icon: Icons.Culture,
            color: '#7C3AED',
            bgColor: 'rgba(124, 58, 237, 0.08)',
            count: stats.culture,
            description: 'Kelola informasi budaya'
        },
        { 
            key: 'articles', 
            label: 'Artikel', 
            icon: Icons.Article,
            color: '#DC2626',
            bgColor: 'rgba(220, 38, 38, 0.08)',
            count: stats.articles,
            description: 'Tulis dan edit artikel'
        },
        { 
            key: 'contact', 
            label: 'Kontak', 
            icon: Icons.Contact,
            color: '#EC4899',
            bgColor: 'rgba(236, 72, 153, 0.08)',
            count: stats.contacts,
            description: 'Kelola pesan kontak'
        },
        { 
            key: 'footer', 
            label: 'Footer', 
            icon: Icons.Footer,
            color: '#64748B',
            bgColor: 'rgba(100, 116, 139, 0.08)',
            count: stats.footer,
            description: 'Atur konten footer'
        },
        { 
            key: 'users', 
            label: 'User', 
            icon: Icons.Users,
            color: '#8B5CF6',
            bgColor: 'rgba(139, 92, 246, 0.08)',
            count: stats.users,
            description: 'Kelola akun administrator'
        }
    ];

    return (
        <div className="admin-page">
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="welcome-banner-content">
                    <div className="welcome-text">
                        <h1>Selamat Datang di Panel Admin</h1>
                        <p>Kelola seluruh konten website Talaud dengan mudah dan cepat</p>
                        <div className="welcome-meta">
                            <span>{formatDate(currentTime)}</span>
                            <span>{formatTime(currentTime)}</span>
                        </div>
                    </div>
                    <div className="welcome-stats-mini">
                        <div className="mini-stat">
                            <span className="mini-stat-number">
                                {stats.hero + stats.destinations + stats.gallery + stats.culture + stats.articles + stats.users}
                            </span>
                            <span className="mini-stat-label">Total Konten</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="dashboard-stats">
                {menuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <div 
                            key={item.key}
                            className="stat-card clickable"
                            style={{ 
                                animation: `fadeSlideUp ${0.3 + (index * 0.05)}s ease-out`,
                                borderLeft: `3px solid ${item.color}`
                            }}
                            onClick={() => navigateToManager(item.key)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = item.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
                                e.currentTarget.style.borderColor = 'var(--admin-border)';
                            }}
                        >
                            <div className="stat-icon-wrapper" style={{ background: item.bgColor, color: item.color }}>
                                <IconComponent />
                            </div>
                            <div className="stat-info">
                                <div className="stat-header">
                                    <h3>{item.label}</h3>
                                    {loading ? (
                                        <span className="stat-count-loading">...</span>
                                    ) : (
                                        <span className="stat-count" style={{ color: item.color }}>
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                                <p>{item.description}</p>
                                <div className="stat-action">
                                    <span className="stat-action-text" style={{ color: item.color }}>
                                        Kelola <Icons.ArrowRight />
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HomeDashboard;