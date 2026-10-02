import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { TORN_PAPER_D } from './tornPaperPath';

const defaultProducts = [
  {
    id: 'dates',
    name: 'Fresh Dates',
    subName: 'Royal Madinah & Saudi Harvest',
    headline: 'Start Your Day With Our Fresh Dates.',
    headingLine1: 'Start Your Day With Our',
    headingLine2: 'Fresh Dates.',
    image: '/images/hero_slide_dates.jpg',
    pouchImage: '/images/pouch_dates.jpg',
    description: 'Naturally soft, caramel-rich, and nourishing from royal Madinah groves.',
    ctaText: 'Buy Now',
    link: '/product/dates',
    order: 1,
    isActive: true
  },
  {
    id: 'cashews',
    name: 'Whole Cashews',
    subName: 'Colossal W-180 • Hand-Selected',
    headline: 'Fuel Your Day With Crunchy Cashews.',
    headingLine1: 'Pure Crunch In Every Bite',
    headingLine2: 'Colossal Cashews.',
    image: '/images/hero_slide_cashews.jpg',
    pouchImage: '/images/pouch_cashew.jpg',
    description: 'Naturally sourced, hand-sorted colossal kernels with an irresistible golden crunch.',
    ctaText: 'Buy Now',
    link: '/product/cashews',
    order: 2,
    isActive: true
  },
  {
    id: 'almonds',
    name: 'California Almonds',
    subName: 'Supreme Grade • 100% Raw & Natural',
    headline: 'Sun-Drenched Vitality California Almonds.',
    headingLine1: 'Sun-Drenched Vitality',
    headingLine2: 'California Almonds.',
    image: '/images/hero_slide_almonds.jpg',
    pouchImage: '/images/pouch_almond.jpg',
    description: 'Rich in natural Vitamin E, wholesome plant protein, and revitalizing crispness.',
    ctaText: 'Buy Now',
    link: '/product/almonds',
    order: 3,
    isActive: true
  },
  {
    id: 'pistachios',
    name: 'Persian Pistachios',
    subName: 'Persian Akbari • Light Pink Salt Roast',
    headline: 'Naturally Opened & Crisp Persian Pistachios.',
    headingLine1: 'Naturally Opened & Crisp',
    headingLine2: 'Persian Pistachios.',
    image: '/images/hero_slide_pistachios.png',
    pouchImage: '/images/pouch_pista.jpg',
    description: 'Jumbo sun-dried kernels slowly dry-roasted with mineral-rich pink rock salt.',
    ctaText: 'Buy Now',
    link: '/product/pistachios',
    order: 4,
    isActive: true
  },
  {
    id: 'pistachios-dark',
    name: 'Royal Emerald Pistachios',
    subName: 'Emerald Harvest • Rare Caliber',
    headline: 'The True Taste of Royal Luxury Pistachios.',
    headingLine1: 'The True Taste of Royal',
    headingLine2: 'Luxury Pistachios.',
    image: '/images/hero_slide_pista_dark.jpg',
    pouchImage: '/images/pouch_pista.jpg',
    description: 'Vibrant emerald green kernels harvested at peak ripeness for unmatched royal aroma.',
    ctaText: 'Buy Now',
    link: '/product/pistachios',
    order: 5,
    isActive: true
  }
];

const defaultHeroConfig = {
  enabled: true,
  rotationTiming: 5,
  products: defaultProducts
};

export default function Hero({ onQuickView: _onQuickView }) {
  const [heroConfig, setHeroConfig] = useState(defaultHeroConfig);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const slideTimerRef = useRef(null);

  // Fetch dynamic hero configuration from backend CMS
  useEffect(() => {
    let isMounted = true;

    const fetchHeroData = async () => {
      try {
        const res = await api.home.get();
        if (!isMounted) return;

        if (res.success && res.data) {
          const cmsHero = res.data.heroSection;
          if (cmsHero && cmsHero.enabled !== false) {
            let activeProducts = [];
            if (Array.isArray(cmsHero.products) && cmsHero.products.length > 0) {
              activeProducts = cmsHero.products
                .filter((p) => p.isActive !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            }

            setHeroConfig({
              enabled: true,
              rotationTiming: cmsHero.rotationTiming || 5,
              products: activeProducts.length > 0 ? activeProducts : defaultProducts
            });
          }
        }
      } catch {
        // Fallback to defaults
      }
    };

    fetchHeroData();
    return () => {
      isMounted = false;
    };
  }, []);

  const products = heroConfig.products && heroConfig.products.length > 0
    ? heroConfig.products
    : defaultProducts;

  const totalProducts = products.length;
  const currentProduct = products[currentSlide % totalProducts] || products[0];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalProducts);
  }, [totalProducts]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalProducts) % totalProducts);
  }, [totalProducts]);

  const handleSelectSlide = (idx) => {
    setCurrentSlide(idx);
  };

  // Auto-rotation timer (pauses when user hovers)
  useEffect(() => {
    if (isHovered || totalProducts <= 1) return;

    const intervalTime = (heroConfig.rotationTiming || 5) * 1000;
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
          const isActive = idx === currentSlide;
          return (
            <div
              key={product.id || product._id || idx}
              className={`hero-slide-item ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
            >
              <img
                src={product.image || '/images/hero_slide_dates.jpg'}
                alt={product.name || 'QAMRAH Premium Dates and Nuts'}
                className="hero-slide-img"
                fetchPriority={idx === 0 ? 'high' : 'auto'}
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
                id={`hero-buy-now-${currentProduct.id || currentSlide}`}
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
          const isActive = idx === currentSlide;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Slide ${idx + 1} - ${product.name}`}
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
          transform: scale(1.03);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 6s cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
        }

        .hero-slide-item.active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
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
