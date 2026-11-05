import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const API_BASE = "http://127.0.0.1:8000";

/* ============================================================
   IKON SVG
   ============================================================ */
const IconMail = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
        <path d="m3 7 8.2 5.4a1.6 1.6 0 0 0 1.6 0L21 7" />
    </svg>
);

const IconLock = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10.5" width="16" height="10.5" rx="3" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
);

const IconEye = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.2 12S5.8 5.5 12 5.5 21.8 12 21.8 12 18.2 18.5 12 18.5 2.2 12 2.2 12Z" />
        <circle cx="12" cy="12" r="2.8" />
    </svg>
);

const IconEyeOff = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.7 6.1A9.6 9.6 0 0 1 12 6c6.2 0 9.8 6 9.8 6a17 17 0 0 1-2.4 3.2" />
        <path d="M6.6 7.1A16.6 16.6 0 0 0 2.2 12s3.6 6 9.8 6a9.4 9.4 0 0 0 3.6-.7" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
);

const IconShield = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.5s7.5-3.6 7.5-9.5V5.6L12 2.8 4.5 5.6V12c0 5.9 7.5 9.5 7.5 9.5Z" />
        <path d="m9.2 12.1 2 2 3.6-3.9" />
    </svg>
);

const IconCheck = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 12.5 5 5L20 6.5" />
    </svg>
);

const IconAlert = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9.5" />
        <line x1="12" y1="7.5" x2="12" y2="13" />
        <line x1="12" y1="16.5" x2="12.01" y2="16.5" />
    </svg>
);

const IconArrowRight = () => (
    <svg className="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
);

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H6M11 18l-6-6 6-6" />
    </svg>
);

/* ============================================================
   KOMPONEN LOGIN
   ============================================================ */
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Login gagal, periksa email dan password Anda."
                );
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* ---------- Dekorasi latar ---------- */}
            <div className="login-bg" aria-hidden="true">
                <span className="blob blob-1" />
                <span className="blob blob-2" />
                <span className="blob blob-3" />
                <span className="grid-overlay" />
            </div>

            {/* ---------- Tombol kembali ---------- */}
            <Link to="/" className="back-home">
                <IconArrowLeft />
                <span>Kembali ke Home</span>
            </Link>

            <div className="login-shell">
                {/* ---------- Panel Brand ---------- */}
                <aside className="login-brand">
                    <span className="brand-orb brand-orb-1" aria-hidden="true" />
                    <span className="brand-orb brand-orb-2" aria-hidden="true" />

                    <div className="brand-head">
                        <div className="brand-logo">
                            <IconShield />
                        </div>
                        <div className="brand-head-text">
                            <span className="brand-eyebrow">Panel Admin</span>
                            <h1>Pariwisata Talaud</h1>
                        </div>
                    </div>

                    <p className="brand-desc">
                        Kelola destinasi, galeri, dan informasi wisata Kepulauan Talaud
                        dalam satu dasbor yang sederhana.
                    </p>

                    <ul className="brand-features">
                        <li>
                            <span className="check"><IconCheck /></span>
                            Kelola destinasi &amp; galeri
                        </li>
                        <li>
                            <span className="check"><IconCheck /></span>
                            Perbarui informasi wisata
                        </li>
                        <li>
                            <span className="check"><IconCheck /></span>
                            Pantau konten dengan mudah
                        </li>
                    </ul>

                    <span className="brand-copy">
                        © {new Date().getFullYear()} Pariwisata Talaud
                    </span>
                </aside>

                {/* ---------- Panel Form ---------- */}
                <main className="login-card">
                    <header className="login-header">
                        <h2>Masuk ke Akun</h2>
                        <p>Gunakan email dan password admin Anda untuk melanjutkan.</p>
                    </header>

                    {error && (
                        <div className="login-error" role="alert" aria-live="polite">
                            <IconAlert />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="field">
                            <span className="field-icon"><IconMail /></span>
                            <input
                                id="email"
                                type="email"
                                placeholder=" "
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <label htmlFor="email">Email</label>
                        </div>

                        {/* Password */}
                        <div className="field has-toggle">
                            <span className="field-icon"><IconLock /></span>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder=" "
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <label htmlFor="password">Password</label>
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                tabIndex={-1}
                            >
                                {showPassword ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            <span className="btn-content">
                                {loading ? (
                                    <>
                                        <span className="spinner" aria-hidden="true" />
                                        <span>Memproses…</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk</span>
                                        <IconArrowRight />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <footer className="login-footer">
                        <p>
                            Belum punya akun? <strong>Hubungi administrator</strong>
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default Login;