import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

/* ---------- Halaman utama ---------- */
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import DashboardAdmin from '../pages/Admin/DashboardAdmin';

/* ---------- Detail pages ---------- */
import DetailDestination from '../components/sections/Destination/DetailDestination';
import CultureDetail from '../components/sections/Culture/CultureDetail';
import ArticleDetail from '../components/sections/Article/ArticleDetail';

/* ---------- All pages ---------- */
import AllDestinations from '../components/sections/Destination/AllDestinations';
import AllGallery from '../components/sections/Gallery/AllGallery';
import AllCulture from '../components/sections/Culture/AllCulture';
import AllArticle from '../components/sections/Article/AllArticle';

const AppRoutes = () => {
    return (
        <>
            {/* ============================================================
                SCROLL TO TOP
                Otomatis scroll ke atas setiap kali route berubah.
                WAJIB di dalam <BrowserRouter> (biasanya di App.jsx).
                ============================================================ */}
            <ScrollToTop />

            <Routes>
                {/* Home & Auth */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />

                {/* Detail pages */}
                <Route path="/destination/:id" element={<DetailDestination />} />
                <Route path="/culture/:id" element={<CultureDetail />} />
                <Route path="/article/:id" element={<ArticleDetail />} />

                {/* All pages */}
                <Route path="/destinations" element={<AllDestinations />} />
                <Route path="/all-gallery" element={<AllGallery />} />
                <Route path="/all-culture" element={<AllCulture />} />
                <Route path="/all-article" element={<AllArticle />} />
            </Routes>
        </>
    );
};

export default AppRoutes;