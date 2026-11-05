import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/icons/logo-pariwisata-talaud.png";

/* ---------- Ikon SVG ---------- */
const LockIcon = () => (
    <svg
        className="btn-admin-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <rect x="3.75" y="10.25" width="16.5" height="10.5" rx="2.6" />
        <path d="M7.75 10.25V7.5a4.25 4.25 0 0 1 8.5 0v2.75" />
        <circle cx="12" cy="15.5" r="1.35" fill="currentColor" stroke="none" />
        <path d="M12 16.85v1.9" />
    </svg>
);

const ArrowIcon = () => (
    <svg
        className="btn-admin-arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 12h13" />
        <path d="M12.5 6l6 6-6 6" />
    </svg>
);

const CloseIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/* ---------- Daftar link navigasi (label → id section) ---------- */
const NAV_LINKS = [
    { label: "Beranda", id: "home" },
    { label: "Destinasi", id: "destination" },
    { label: "Galeri", id: "gallery" },
    { label: "Budaya", id: "culture" },
    { label: "Artikel", id: "article" },
    { label: "Kontak", id: "contact" },
];

/* ---------- Komponen Navbar ---------- */
function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("Beranda");
    const [isScrolled, setIsScrolled] = useState(false);

    /* ---------- Deteksi scroll (efek visual navbar) ---------- */
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* ---------- Kunci scroll body saat menu mobile terbuka ---------- */
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    /* ---------- Tutup menu saat resize ke desktop ---------- */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setIsMobileMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ---------- Tutup menu dengan Escape ---------- */
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setIsMobileMenuOpen(false);
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    /* ---------- Sinkronisasi menu aktif dengan posisi scroll ---------- */
    useEffect(() => {
        let ticking = false;

        const updateActiveFromScroll = () => {
            const scrollY = window.pageYOffset || window.scrollY || 0;

            // 1) Di paling atas → paksa Beranda
            if (scrollY < 80) {
                setActiveLink((prev) =>
                    prev === NAV_LINKS[0].label ? prev : NAV_LINKS[0].label
                );
                return;
            }

            // 2) Di paling bawah halaman → paksa menu terakhir (Kontak)
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            const viewportBottom = scrollY + window.innerHeight;
            if (viewportBottom >= docHeight - 2) {
                const lastLabel = NAV_LINKS[NAV_LINKS.length - 1].label;
                setActiveLink((prev) => (prev === lastLabel ? prev : lastLabel));
                return;
            }

            // 3) Cek tiap section: pilih yang top-nya paling dekat
            //    tapi sudah terlewati posisi scroll + offset
            const navbarHeight =
                document.querySelector(".navbar")?.offsetHeight || 72;
            const offset = navbarHeight + 10;

            let currentLabel = NAV_LINKS[0].label;
            let currentTop = -Infinity;

            for (const link of NAV_LINKS) {
                const el = document.getElementById(link.id);
                if (!el) continue;

                const rect = el.getBoundingClientRect();
                const topAbs = rect.top + scrollY;

                if (scrollY + offset >= topAbs && topAbs > currentTop) {
                    currentTop = topAbs;
                    currentLabel = link.label;
                }
            }

            setActiveLink((prev) =>
                prev === currentLabel ? prev : currentLabel
            );
        };

        const onScrollOrResize = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                updateActiveFromScroll();
                ticking = false;
            });
        };

        // Hitung sekali di awal (mis. user reload di tengah halaman)
        updateActiveFromScroll();

        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);

        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, []);

    const closeMenu = () => setIsMobileMenuOpen(false);

    const handleLinkClick = (link, e) => {
        e.preventDefault();
        setActiveLink(link.label);
        setIsMobileMenuOpen(false);

        const element = document.getElementById(link.id);

        if (element) {
            const navHeight =
                document.querySelector(".navbar")?.offsetHeight || 72;
            const elementPosition =
                element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - navHeight,
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
            <div className="navbar-container">
                {/* ---------- Logo ---------- */}
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <img
                        src={logo}
                        alt="Logo Pariwisata Talaud"
                        className="logo-img"
                    />
                    <span className="logo-text">Pariwisata Talaud</span>
                </Link>

                {/* ---------- Nav Links (desktop) ---------- */}
                <ul className="nav-links">
                    {NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <a
                                href={`#${link.id}`}
                                className={
                                    activeLink === link.label ? "active" : ""
                                }
                                onClick={(e) => handleLinkClick(link, e)}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* ---------- Tombol Login Admin (desktop) ---------- */}
                <Link to="/login" className="btn-admin desktop-admin-btn">
                    <LockIcon />
                    <span>Masuk Admin</span>
                    <ArrowIcon />
                </Link>

                {/* ---------- Hamburger ---------- */}
                <button
                    className="hamburger"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Buka menu"
                    aria-expanded={isMobileMenuOpen}
                    type="button"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>

            {/* ---------- Menu Mobile ---------- */}
            <div
                className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
                aria-hidden={!isMobileMenuOpen}
            >
                {/* Header drawer */}
                <div className="mobile-menu-header">
                    <div className="mobile-menu-brand">
                        <img src={logo} alt="" className="mobile-menu-logo" />
                        <div className="mobile-menu-brand-text">
                            <span className="mobile-menu-title">Menu</span>
                            <span className="mobile-menu-subtitle">
                                Pariwisata Talaud
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="mobile-menu-close"
                        onClick={closeMenu}
                        aria-label="Tutup menu"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* List link */}
                <ul className="mobile-nav-links">
                    {NAV_LINKS.map((link, idx) => (
                        <li key={link.label}>
                            <a
                                href={`#${link.id}`}
                                className={
                                    activeLink === link.label ? "active" : ""
                                }
                                onClick={(e) => handleLinkClick(link, e)}
                            >
                                <span className="mobile-link-index">
                                    {String(idx + 1).padStart(2, "0")}
                                </span>
                                <span className="mobile-link-label">
                                    {link.label}
                                </span>
                                <span className="mobile-link-arrow">
                                    <ArrowIcon />
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Footer drawer */}
                <div className="mobile-menu-footer">
                    <Link
                        to="/login"
                        className="btn-admin"
                        onClick={closeMenu}
                    >
                        <LockIcon />
                        <span>Masuk Admin</span>
                        <ArrowIcon />
                    </Link>
                </div>
            </div>

            {/* ---------- Overlay ---------- */}
            <div
                className={`mobile-overlay ${
                    isMobileMenuOpen ? "visible" : ""
                }`}
                onClick={closeMenu}
                aria-hidden="true"
            />
        </nav>
    );
}

export default Navbar;