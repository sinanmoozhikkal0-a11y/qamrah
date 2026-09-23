import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import OurStory from './pages/OurStory';
import Wholesale from './pages/Wholesale';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Admin CMS Components
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import ProductsCMS from './admin/pages/ProductsCMS';
import CategoriesCMS from './admin/pages/CategoriesCMS';
import OrdersCMS from './admin/pages/OrdersCMS';
import PackDesignCMS from './admin/pages/PackDesignCMS';
import HomeCMS from './admin/pages/HomeCMS';
import StoryCMS from './admin/pages/StoryCMS';
import WholesaleCMS from './admin/pages/WholesaleCMS';
import ContactCMS from './admin/pages/ContactCMS';
import FaqsCMS from './admin/pages/FaqsCMS';
import MediaCMS from './admin/pages/MediaCMS';
import SettingsCMS from './admin/pages/SettingsCMS';

// Helper component to auto-scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AdminAuthProvider>
      <div className={isAdmin ? 'admin-root' : 'site-wrapper'}>
        <ScrollToTop />
        
        {/* Customer Header - hidden on /admin */}
        {!isAdmin && <TopBar />}
        {!isAdmin && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

        {/* Dynamic Route Content */}
        <main className={isAdmin ? 'admin-main-wrapper' : 'main-content'}>
          <Routes>
            {/* Customer Facing Storefront Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/wholesale" element={<Wholesale />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Super CMS Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsCMS />} />
              <Route path="categories" element={<CategoriesCMS />} />
              <Route path="orders" element={<OrdersCMS />} />
              <Route path="pack-designs" element={<PackDesignCMS />} />
              <Route path="home" element={<HomeCMS />} />
              <Route path="story" element={<StoryCMS />} />
              <Route path="wholesale" element={<WholesaleCMS />} />
              <Route path="contact" element={<ContactCMS />} />
              <Route path="faqs" element={<FaqsCMS />} />
              <Route path="media" element={<MediaCMS />} />
              <Route path="settings" element={<SettingsCMS />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Customer Luxury Footer - hidden on /admin */}
        {!isAdmin && <Footer />}

        {/* Global Live Search Modal - hidden on /admin */}
        {!isAdmin && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </div>
    </AdminAuthProvider>
  );
}

