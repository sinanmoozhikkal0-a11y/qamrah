import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { defaultHomePage } from '../data/defaultData';
import { TORN_PAPER_D } from './tornPaperPath';

// Normalizer for products array from CMS/backend
const normalizeHeroProducts = (rawProducts) => {
  if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
    return [];
  }
  return rawProducts
    .filter((p) => p && p.isActive !== false && p.image)
    .map((p, idx) => ({ ...p, _idx: idx }))
    .sort((a, b) => {
      const orderA = a.order !== undefined && a.order !== null && a.order !== '' ? Number(a.order) : a._idx;
      const orderB = b.order !== undefined && b.order !== null && b.order !== '' ? Number(b.order) : b._idx;
      return orderA - orderB;
    });
};

const getFallbackHeroConfig = () => {
  return defaultHomePage?.heroSection || {
    enabled: true,
    rotationTiming: 4,
    products: []
  };
};

export default function Hero({ onQuickView: _onQuickView, heroData: propHeroData }) {
  // Initialize with prop, localStorage cache, or default fallback
  const [heroConfig, setHeroConfig] = useState(() => {
    if (propHeroData && propHeroData.enabled !== false) {
      return propHeroData;
    }
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('qamrah_home');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.heroSection && parsed.heroSection.enabled !== false) {
            return parsed.heroSection;
          }
        }
      } catch {
        // Fallback
      }
    }
    return getFallbackHeroConfig();
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const slideTimerRef = useRef(null);

  const applyHeroConfig = useCallback((cmsHero) => {
    if (!cmsHero || cmsHero.enabled === false) return;
    setHeroConfig(cmsHero);
  }, []);

  // Update when propHeroData changes from parent
  useEffect(() => {
    if (propHeroData && propHeroData.enabled !== false) {
      applyHeroConfig(propHeroData);
    }
  }, [propHeroData, applyHeroConfig]);

  // Fetch from GET /api/home if propHeroData not supplied, and listen for live CMS updates
  useEffect(() => {
    let isMounted = true;

    if (!propHeroData) {
      const fetchHeroData = async () => {
        try {
          const res = await api.home.get();
          if (!isMounted) return;
          if (res.success && res.data?.heroSection) {
            applyHeroConfig(res.data.heroSection);
          }
        } catch {
          // Fallback
        }
      };

      fetchHeroData();
    }

    // Listen to real-time updates dispatched when admin saves in HomeCMS
    const handleHomeUpdated = (e) => {
      if (!isMounted) return;
      if (e.detail?.heroSection) {
        applyHeroConfig(e.detail.heroSection);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('qamrah_home_updated', handleHomeUpdated);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('qamrah_home_updated', handleHomeUpdated);
      }
    };
  }, [propHeroData, applyHeroConfig]);

  // Derive normalized product items from current backend configuration
  const cmsProducts = normalizeHeroProducts(heroConfig?.products);
  const fallbackProducts = normalizeHeroProducts(getFallbackHeroConfig().products);
  const products = cmsProducts.length > 0 ? cmsProducts : fallbackProducts;

  const totalProducts = products.length;
  const activeSlideIndex = totalProducts > 0 ? ((currentSlide % totalProducts) + totalProducts) % totalProducts : 0;
  const currentProduct = products[activeSlideIndex] || products[0] || {};

  // Progressive background preloading of remaining hero images
  useEffect(() => {
    if (products.length > 1 && typeof window !== 'undefined') {
      products.slice(1).forEach((prod) => {
        if (prod.image) {
          const img = new Image();
          img.src = prod.image;
        }
      });
    }
  }, [products]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalProducts);
  }, [totalProducts]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalProducts) % totalProducts);
  }, [totalProducts]);

  const handleSelectSlide = (idx) => {
    setCurrentSlide(idx);
  };

  // Auto-rotation timer (pauses when user hovers, uses backend rotation timing)
  useEffect(() => {
    if (isHovered || totalProducts <= 1) return;

    const rawTiming = Number(heroConfig.rotationTiming);
    const intervalTime = (rawTiming && rawTiming > 0 ? rawTiming : 4) * 1000;

    slideTimerRef.current = setInterval(() => {
      handleNext();
    }, intervalTime);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isHovered, totalProducts, heroConfig.rotationTiming, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Split headline lines if provided
  const line1 = currentProduct.headingLine1 || (
    currentProduct.headline
      ? currentProduct.headline.split('\n')[0]
      : 'Start Your Day With Our'
  );
  const line2 = currentProduct.headingLine2 || (
    currentProduct.headline && currentProduct.headline.includes('\n')
      ? currentProduct.headline.split('\n')[1]
      : (currentProduct.name || 'Fresh Dates.')
  );

  return (
    <section
      className="qamrah-hero-banner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Fresh Dry Fruits & Dates Showcase"
    >
      {/* Background Slides with High-Resolution Photography */}
      <div className="hero-slides-wrapper">
        {products.map((product, idx) => {
          const isActive = idx === activeSlideIndex;
          return (
            <div
              key={product.id || product._id || product.image || idx}
              className={`hero-slide-item ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
            >
              <img
                src={product.image}
                alt={product.name || 'QAMRAH Premium Dates and Nuts'}
                className="hero-slide-img"
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          );
        })}
      </div>

      {/* Atmospheric Left-Side Gradient Overlay for Flawless Text Readability */}
      <div className="hero-gradient-overlay" />

      {/* Main Content: Typography and 'Buy Now' Action Button */}
      <div className="hero-content-layer">
        <div className="hero-inner-container">
          <div className="hero-text-content">
            {/* Main Headline styled like reference picture 1 */}
            <h1 className="hero-main-title">
              <span className="hero-title-line1">{line1}</span>
              <span className="hero-title-line2">{line2}</span>
            </h1>

            {/* Optional elegant subtitle description */}
            {currentProduct.description && (
              <p className="hero-subtext">
                {currentProduct.description}
              </p>
            )}

            {/* Clean White Pill 'Buy Now' Button matching picture 1 */}
            <div className="hero-cta-box">
              <Link
                to={currentProduct.link || '/shop'}
                className="hero-buy-now-button"
                id={`hero-buy-now-${currentProduct.id || activeSlideIndex}`}
              >
                {currentProduct.ctaText || 'Buy Now'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Side Chevron Navigation Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        className="hero-arrow-btn hero-arrow-prev"
        aria-label="Previous product slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="hero-arrow-btn hero-arrow-next"
        aria-label="Next product slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Bottom Center Pagination Dots (Exact layout from Picture 1) */}
      <div className="hero-pagination-dots" role="tablist" aria-label="Slide indicators">
        {products.map((product, idx) => {
          const isActive = idx === activeSlideIndex;
          return (
            <button
              key={product.id || product._id || product.image || idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Slide ${idx + 1} - ${product.name || 'Product'}`}
              onClick={() => handleSelectSlide(idx)}
              className={`hero-dot-indicator ${isActive ? 'active' : ''}`}
            />
          );
        })}
      </div>

      {/* Authentic Ripped / Torn Paper Bottom Border Divider */}
      <div className="hero-torn-paper-edge" aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="hero-torn-paper-svg"
        >
          <path d={TORN_PAPER_D} fill="#FFFFFF" />
        </svg>
      </div>

      {/* High-End Responsive CSS Matching Picture 1 */}
      <style>{`
        /* ===================================================================
           HERO BANNER CONTAINER
           =================================================================== */
        .qamrah-hero-banner {
          position: relative;
          width: 100%;
          min-height: clamp(480px, 66vh, 680px);
          overflow: hidden;
          background-color: #071911;
          display: flex;
          align-items: center;
          user-select: none;
        }

        /* Responsive height */
        @media (max-width: 768px) {
          .qamrah-hero-banner {
            min-height: 480px;
          }
        }

        /* ===================================================================
           BACKGROUND SLIDES & KEN BURNS ZOOM
           =================================================================== */
        .hero-slides-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-slide-item {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: scale(1.035);
          transition: opacity 1.0s cubic-bezier(0.4, 0, 0.2, 1), transform 4.5s cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
          will-change: opacity, transform;
        }

        .hero-slide-item.active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
          z-index: 2;
        }

        .hero-slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 38%;
          display: block;
        }

        /* ===================================================================
           ATMOSPHERIC GRADIENT OVERLAY
           Matches Picture 1: Dark rich tones on left, transparent on right
           =================================================================== */
        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            rgba(5, 18, 12, 0.88) 0%,
            rgba(5, 18, 12, 0.74) 28%,
            rgba(5, 18, 12, 0.42) 52%,
            rgba(5, 18, 12, 0.12) 75%,
            rgba(5, 18, 12, 0.22) 100%
          );
        }

        @media (max-width: 768px) {
          .hero-gradient-overlay {
            background: linear-gradient(
              180deg,
              rgba(5, 18, 12, 0.75) 0%,
              rgba(5, 18, 12, 0.55) 45%,
              rgba(5, 18, 12, 0.85) 100%
            );
          }
        }

        /* ===================================================================
           CONTENT LAYER & TYPOGRAPHY
           =================================================================== */
        .hero-content-layer {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          padding-top: 30px;
          padding-bottom: 70px;
        }

        .hero-inner-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(24px, 6vw, 90px);
        }

        .hero-text-content {
          max-width: 580px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          animation: heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Headline: Matches Picture 1 font, weight, styling */
        .hero-main-title {
          font-family: var(--font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(2.3rem, 4.4vw, 3.7rem);
          font-weight: 700;
          line-height: 1.18;
          letter-spacing: -0.01em;
          color: #FFFFFF;
          margin: 0 0 16px 0;
          text-shadow: 0 3px 16px rgba(0, 0, 0, 0.65), 0 1px 3px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
        }

        .hero-title-line1 {
          display: block;
        }

        .hero-title-line2 {
          display: block;
        }

        .hero-subtext {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: clamp(0.9rem, 1.15vw, 1.05rem);
          line-height: 1.6;
          color: rgba(245, 240, 230, 0.9);
          margin: 0 0 28px 0;
          max-width: 480px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }

        /* ===================================================================
           'BUY NOW' BUTTON (Exact match to Picture 1)
           White background, dark crisp text, rounded corners
           =================================================================== */
        .hero-cta-box {
          display: flex;
          align-items: center;
        }

        .hero-buy-now-button {
          display: inline-block;
          background-color: #FFFFFF;
          color: #111E17;
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 12px 34px;
          border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .hero-buy-now-button:hover {
          background-color: #FAF4EA;
          color: #05140D;
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.45);
        }

        .hero-buy-now-button:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* ===================================================================
           PAGINATION DOTS (Exact match to Picture 1)
           Centered at bottom, small circular dots
           =================================================================== */
        .hero-pagination-dots {
          position: absolute;
          bottom: 34px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(4px);
        }

        .hero-dot-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.45);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-dot-indicator:hover {
          background-color: rgba(255, 255, 255, 0.85);
          transform: scale(1.3);
        }

        .hero-dot-indicator.active {
          width: 9px;
          height: 9px;
          background-color: #FFFFFF;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.95);
        }

        /* ===================================================================
           SIDE CHEVRON ARROWS (Desktop & Large Screens)
           =================================================================== */
        .hero-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(7, 22, 15, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .qamrah-hero-banner:hover .hero-arrow-btn {
          opacity: 0.85;
        }

        .hero-arrow-btn:hover {
          opacity: 1 !important;
          background: rgba(216, 182, 106, 0.35);
          border-color: #D8B66A;
          color: #FFFFFF;
          transform: translateY(-50%) scale(1.08);
        }

        .hero-arrow-prev {
          left: 20px;
        }

        .hero-arrow-next {
          right: 20px;
        }

        @media (max-width: 768px) {
          .hero-arrow-btn {
            display: none;
          }
        }

        /* ===================================================================
           TORN / RIPPED PAPER BOTTOM BORDER (Exact match to Picture 1)
           =================================================================== */
        .hero-torn-paper-edge {
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 28px;
          z-index: 6;
          pointer-events: none;
          line-height: 0;
          overflow: hidden;
        }

        .hero-torn-paper-svg {
          width: 100%;
          height: 100%;
          display: block;
          filter: drop-shadow(0 -4px 6px rgba(0, 0, 0, 0.22));
        }

        @media (max-width: 640px) {
          .hero-torn-paper-edge {
            height: 20px;
          }
          .hero-main-title {
            font-size: 2.1rem;
          }
          .hero-buy-now-button {
            padding: 11px 28px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}
