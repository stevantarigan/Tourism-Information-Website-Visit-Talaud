// pages/Admin/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DashboardAdmin.css";

import HomeDashboard from "./components/HomeDashboard";
import HeroManager from "./components/HeroManager";
import DestinationsManager from "./components/DestinationsManager";
import DestinationImagesManager from "./components/DestinationImagesManager";
import GalleryManager from "./components/GalleryManager";
import CultureManager from "./components/CultureManager";
import ArticleManager from "./components/ArticleManager";
import ContactManager from "./components/ContactManager";
import FooterManager from "./components/FooterManager";
import UserManager from "./components/UserManager";

/* ============================================================
   ICONS (satu komponen, banyak path)
   ============================================================ */
const paths = {
    dashboard: (<><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>),
    hero: (<><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>),
    destination: (<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
    image: (<><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>),
    gallery: (<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>),
    culture: (<><path d="M3 21h18" /><path d="M5 21V10l7-6 7 6v11" /><path d="M9 21v-6h6v6" /></>),
    article: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
    contact: (<><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></>),
    footer: (<><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="15" x2="21" y2="15" /></>),
    users: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
    logout: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>),
    brand: (<><path d="M2 16c3 0 3-2 5.5-2S10 16 12.5 16 15 14 17.5 14 20 16 22 16" /><path d="M2 21c3 0 3-2 5.5-2S10 21 12.5 21 15 19 17.5 19 20 21 22 21" /><path d="M12 3l4 8H8l4-8z" /></>),
    menu: (<><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="14" y2="17" /></>),
    close: (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>),
};

const Icon = ({ name, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[name]}
    </svg>
);

/* ============================================================
   MENU (dikelompokkan)
   ============================================================ */
const menuGroups = [
    { title: "Ringkasan", items: [{ key: "home", label: "Dashboard", icon: "dashboard" }] },
    {
        title: "Konten Website",
        items: [
            { key: "hero", label: "Hero Section", icon: "hero" },
            { key: "destinations", label: "Destinasi", icon: "destination" },
            { key: "destination-images", label: "Galeri Destinasi", icon: "image" },
            { key: "gallery", label: "Galeri Umum", icon: "gallery" },
            { key: "culture", label: "Budaya", icon: "culture" },
            { key: "articles", label: "Artikel", icon: "article" },
        ],
    },
    { title: "Interaksi", items: [{ key: "contact", label: "Kontak", icon: "contact" }] },
    {
        title: "Pengaturan",
        items: [
            { key: "footer", label: "Footer", icon: "footer" },
            { key: "users", label: "User Management", icon: "users" },
        ],
    },
];

const allItems = menuGroups.flatMap((g) => g.items);

const views = {
    home: HomeDashboard,
    hero: HeroManager,
    destinations: DestinationsManager,
    "destination-images": DestinationImagesManager,
    gallery: GalleryManager,
    culture: CultureManager,
    articles: ArticleManager,
    contact: ContactManager,
    footer: FooterManager,
    users: UserManager,
};

const MOBILE_BP = 900;

/* ============================================================
   KOMPONEN
   ============================================================ */
function DashboardAdmin() {
    const [user, setUser] = useState(null);
    const [activeMenu, setActiveMenu] = useState("home");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const prevPad = document.body.style.paddingTop;
        const prevMar = document.body.style.marginTop;
        document.body.style.paddingTop = "0px";
        document.body.style.marginTop = "0px";
        return () => {
            document.body.style.paddingTop = prevPad || "";
            document.body.style.marginTop = prevMar || "";
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow =
            sidebarOpen && window.innerWidth <= MOBILE_BP ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > MOBILE_BP) setSidebarOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };
        window.addEventListener("resize", onResize);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("keydown", onKey);
        };
    }, []);

    useEffect(() => {
        if (location.state && location.state.activeMenu) {
            setActiveMenu(location.state.activeMenu);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        const onMenuChange = (event) => {
            if (event.detail && event.detail.menu) setActiveMenu(event.detail.menu);
        };
        window.addEventListener("menuChange", onMenuChange);
        return () => window.removeEventListener("menuChange", onMenuChange);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) {
            navigate("/login");
            return;
        }
        try {
            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleMenuClick = (key) => {
        setActiveMenu(key);
        setSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!user) return null;

    const View = views[activeMenu] || HomeDashboard;
    const current = allItems.find((i) => i.key === activeMenu) || allItems[0];
    const userName = user.name || "Admin";
    const userInitial = userName.charAt(0).toUpperCase();
    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    return (
        <div className="admin-dashboard">
            <div
                className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
            />

            <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Navigasi admin">
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <div className="sidebar-brand-icon"><Icon name="brand" size={22} /></div>
                        <div className="sidebar-brand-text">
                            <span className="brand-name">Talaud</span>
                            <span className="brand-sub">Panel Admin</span>
                        </div>
                    </div>
                    <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}
                        aria-label="Tutup menu" type="button">
                        <Icon name="close" />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuGroups.map((group) => (
                        <div className="sidebar-group" key={group.title}>
                            <div className="sidebar-nav-label">{group.title}</div>
                            {group.items.map((item) => {
                                const isActive = activeMenu === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        className={`sidebar-link ${isActive ? "active" : ""}`}
                                        onClick={() => handleMenuClick(item.key)}
                                        aria-current={isActive ? "page" : undefined}
                                        type="button"
                                    >
                                        <span className="menu-icon"><Icon name={item.icon} /></span>
                                        <span className="menu-label">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-card">
                        <div className="user-avatar">{userInitial}</div>
                        <div className="user-details">
                            <p className="user-name">{userName}</p>
                            <p className="user-role">Administrator</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} type="button">
                        <Icon name="logout" size={16} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button className="hamburger" onClick={() => setSidebarOpen(true)}
                            aria-label="Buka menu" aria-expanded={sidebarOpen} type="button">
                            <Icon name="menu" size={20} />
                        </button>
                        <div className="admin-title-wrap">
                            <h1 className="admin-page-title">{current.label}</h1>
                            <p className="admin-page-date">{today}</p>
                        </div>
                    </div>

                    <div className="admin-topbar-right">
                        <div className="admin-user-chip">
                            <div className="admin-user-avatar">{userInitial}</div>
                            <div className="admin-user-info">
                                <span className="admin-user-name">{userName}</span>
                                <span className="admin-user-role">Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content" key={activeMenu}>
                    <View />
                </div>
            </main>
        </div>
    );
}

export default DashboardAdmin;