import React, { useState, useEffect, useCallback, useRef } from 'react';
import heroService from '../../../services/heroService';
import './Hero.css';

const API_BASE = 'http://127.0.0.1:8000';

const Hero = () => {
    const [heroes, setHeroes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoPlayRef = useRef(null);
    const transitionTimeout = useRef(null);

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

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const data = await heroService.getAll();
                const heroArray = Array.isArray(data) ? data : (data ? [data] : []);
                setHeroes(heroArray);
            } catch (err) {
                setError(err.message || 'Gagal memuat data hero');
            } finally {
                setLoading(false);
            }
        };
        fetchHero();
    }, []);

    const goToSlide = useCallback(
        (index) => {
            if (isTransitioning || heroes.length <= 1) return;
            setIsTransitioning(true);
            setCurrentIndex(index);
            if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
            transitionTimeout.current = setTimeout(() => {
                setIsTransitioning(false);
            }, 500);
        },
        [isTransitioning, heroes.length]
    );

    const nextSlide = useCallback(() => {
        goToSlide((currentIndex + 1) % heroes.length);
    }, [currentIndex, heroes.length, goToSlide]);

    const prevSlide = useCallback(() => {
        goToSlide((currentIndex - 1 + heroes.length) % heroes.length);
    }, [currentIndex, heroes.length, goToSlide]);

    useEffect(() => {
        if (heroes.length <= 1) return;
        autoPlayRef.current = setInterval(nextSlide, 5000);
        return () => clearInterval(autoPlayRef.current);
    }, [heroes.length, nextSlide]);

    const pauseAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
    };

    const resumeAutoPlay = () => {
        if (heroes.length <= 1) return;
        pauseAutoPlay();
        autoPlayRef.current = setInterval(nextSlide, 5000);
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
        pauseAutoPlay();
    };

    const handleTouchEnd = (e) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        const threshold = 50;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        setTouchStart(null);
        resumeAutoPlay();
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                pauseAutoPlay();
                prevSlide();
                resumeAutoPlay();
            } else if (e.key === 'ArrowRight') {
                pauseAutoPlay();
                nextSlide();
                resumeAutoPlay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevSlide, nextSlide]);

    useEffect(() => {
        return () => {
            if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, []);

    if (loading) {
        return (
            <section id="home" className="hero hero-loading">
                <div className="hero-content">
                    <h1>Memuat...</h1>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="home" className="hero hero-error">
                <div className="hero-content">
                    <h1>Terjadi Kesalahan</h1>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    if (heroes.length === 0) {
        return (
            <section id="home" className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Jelajah <span className="highlight">Nusantara</span></h1>
                    <p>Temukan keindahan budaya dan destinasi wisata Indonesia</p>
                    <button className="cta-button">Jelajahi Sekarang</button>
                </div>
                <div className="scroll-indicator">
                    <div className="mouse"></div>
                    <span>Scroll</span>
                </div>
            </section>
        );
    }

    const currentHero = heroes[currentIndex];
    const prevImage = heroes[(currentIndex - 1 + heroes.length) % heroes.length]?.image;
    const nextImage = heroes[(currentIndex + 1) % heroes.length]?.image;

    return (
        <section
            id="home"
            className="hero"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="hero-background-wrapper">
                {[prevImage, currentHero.image, nextImage].map((img, idx) => {
                    if (!img) return null;
                    const url = getImageUrl(img);
                    const isActive = idx === 1;
                    return (
                        <div
                            key={`${img}-${idx}`}
                            className={`hero-background ${isActive ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${url})` }}
                        ></div>
                    );
                })}
            </div>

            <div className="hero-overlay"></div>

            <div className="hero-content" key={currentIndex}>
                <h1>
                    {currentHero.title?.includes('Nusantara') ? (
                        <>
                            {currentHero.title.split('Nusantara')[0]}
                            <span className="highlight">Nusantara</span>
                            {currentHero.title.split('Nusantara')[1]}
                        </>
                    ) : (
                        currentHero.title || 'Jelajah Nusantara'
                    )}
                </h1>
                <p>
                    {currentHero.subtitle || currentHero.description ||
                        'Temukan keindahan budaya dan destinasi wisata Indonesia'}
                </p>
                {/* <button className="cta-button">Jelajahi Sekarang</button> */}
            </div>

            {heroes.length > 1 && (
                <div className="hero-indicators">
                    {heroes.map((_, index) => (
                        <span
                            key={index}
                            className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => {
                                pauseAutoPlay();
                                goToSlide(index);
                                resumeAutoPlay();
                            }}
                        ></span>
                    ))}
                </div>
            )}

            {heroes.length > 1 && (
                <>
                    <button
                        className="hero-arrow hero-arrow-left"
                        onClick={() => {
                            pauseAutoPlay();
                            prevSlide();
                            resumeAutoPlay();
                        }}
                        aria-label="Slide sebelumnya"
                    >
                        &#10094;
                    </button>
                    <button
                        className="hero-arrow hero-arrow-right"
                        onClick={() => {
                            pauseAutoPlay();
                            nextSlide();
                            resumeAutoPlay();
                        }}
                        aria-label="Slide berikutnya"
                    >
                        &#10095;
                    </button>
                </>
            )}

            <div className="scroll-indicator">
                <div className="mouse"></div>
                <span>Scroll</span>
            </div>
        </section>
    );
};

export default Hero;