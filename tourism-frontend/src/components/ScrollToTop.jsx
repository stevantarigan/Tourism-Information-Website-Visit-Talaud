import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* ============================================================
   SCROLL TO TOP
   Komponen global yang otomatis scroll ke atas setiap kali
   route berubah. Taruh di dalam <BrowserRouter>.
   ============================================================ */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Matikan auto-restore scroll bawaan browser
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Scroll ke paling atas setiap kali path berubah
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;