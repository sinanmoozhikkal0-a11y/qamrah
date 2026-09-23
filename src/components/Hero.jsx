import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  Leaf,
  Package,
  HeartHandshake
} from 'lucide-react';
import { api } from '../services/api';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Curated Luxury Collection Slides matching the reference image layout
  const defaultSlides = [
    {
      id: 'cashew',
      productId: 'cashews',
      eyebrow: 'PREMIUM NUTS • NATURALLY GOOD',
      line1: 'Premium Goodness,',
      line2: 'Carefully Selected.',
      description:
        'Handpicked premium nuts and dry fruits, selected for exceptional taste, freshness and quality.',
      image: '/images/hero_cashew_render.jpg',
      categorySlug: '/shop/cashews',
      productSlug: '/product/cashews'
    },
    {
      id: 'dates',
      productId: 'dates',
      eyebrow: 'SACRED HARVEST • MADINAH GROVES',
      line1: 'Royal Ajwa Dates,',
      line2: 'Holy City Delights.',
      description:
        'Authentic Madinah Ajwa dates naturally dried on the palm. Soft, caramel-rich, and packed with essential minerals.',
      image: '/images/hero_dates_render.jpg',
      categorySlug: '/shop/dates',
      productSlug: '/product/dates'
    },
    {
      id: 'almonds',
      productId: 'almonds',
      eyebrow: 'SUPREME GRADE • CALIFORNIA GROVES',
      line1: 'California Almonds,',
      line2: 'Pure Nutritive Crunch.',
      description:
        'Sun-drenched Nonpareil supreme almonds rich in Vitamin E, botanical antioxidants, and sustained daily energy.',
      image: '/images/hero_almond_render.jpg',
      categorySlug: '/shop/almonds',
      productSlug: '/product/almonds'
    },
    {
      id: 'pistachios',
      productId: 'pistachios',
      eyebrow: 'PERSIAN ROAST • HIMALAYAN SALT',
      line1: 'Imperial Pistachios,',
      line2: 'Roasted To Perfection.',
      description:
        'Naturally opened jumbo Iranian pistachios, dry-roasted with pink salt to accentuate vibrant emerald kernels.',
      image: '/images/hero_pista_render.jpg',
      categorySlug: '/shop/pistachios',
      productSlug: '/product/pistachios'
    }
  ];

  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await api.home.get();
        if (res.success && res.data?.heroSlides && res.data.heroSlides.length > 0) {
          const activeSlides = res.data.heroSlides
            .filter((s) => s.enabled !== false)
            .map((s, idx) => ({
              id: s._id || `slide-${idx}`,
              eyebrow: s.eyebrow || 'PREMIUM NUTS • NATURALLY GOOD',
              line1: s.line1 || 'Premium Goodness,',
              line2: s.line2 || 'Carefully Selected.',
              description: s.description || '',
              image: s.image || defaultSlides[idx % defaultSlides.length].image,
              categorySlug: s.button1Link || '/shop',
              productSlug: s.button2Link || '/shop'
            }));
          if (activeSlides.length > 0) {
            setSlides(activeSlides);
          }
        }
      } catch (_err) {
        // preserve fallback default slides
      }
    };

    fetchHeroData();
  }, []);


  // Auto slide rotation (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const slide = slides[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const features = [
    {
      icon: Award,
      title: 'PREMIUM QUALITY',
      subtitle: 'Handpicked premium selection'
    },
    {
      icon: Leaf,
      title: 'NO PRESERVATIVES',
      subtitle: 'Pure natural goodness'
    },
    {
      icon: Package,
      title: 'FRESHLY PACKED',
      subtitle: 'Packed for maximum freshness'
    },
    {
      icon: HeartHandshake,
      title: 'NATURALLY HEALTHY',
      subtitle: 'Wholesome everyday nutrition'
    }
  ];

  return (
    <section style={{ backgroundColor: '#FAF6F0', padding: '16px 20px 48px', color: '#0F281E' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* ========================================================================= */}
        {/* MAIN HERO CARD                                                            */}
        {/* ========================================================================= */}

        {/* ========================================================================= */}
        {/* 2. MAIN HERO CARD                                                         */}
        {/* ========================================================================= */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            backgroundColor: '#F5EFE4',
            borderRadius: '32px',
            border: '1px solid rgba(216, 182, 106, 0.25)',
            overflow: 'hidden',
            padding: '56px 64px 64px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)',
            minHeight: '540px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          className="hero-main-card"
        >
          {/* Subtle Organic Background Waves */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.6,
              background: 'radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(216, 182, 106, 0.15) 0%, transparent 50%)'
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '40px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}
            className="hero-grid"
          >
            {/* Left Content Column */}
            <div>
              {/* Eyebrow */}
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  letterSpacing: '0.18em',
                  color: '#B0883A',
                  textTransform: 'uppercase',
                  marginBottom: '20px'
                }}
              >
                {slide.eyebrow}
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: 'clamp(2.5rem, 4.2vw, 3.8rem)',
                  fontWeight: '700',
                  color: '#0F281E',
                  lineHeight: '1.12',
                  marginBottom: '24px',
                  letterSpacing: '-0.01em'
                }}
              >
                <div>{slide.line1}</div>
                <div>{slide.line2}</div>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#4B5E53',
                  maxWidth: '460px',
                  lineHeight: '1.65',
                  marginBottom: '36px'
                }}
              >
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Link
                  to={slide.categorySlug}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#0E291C',
                    color: '#FFFFFF',
                    padding: '14px 28px',
                    borderRadius: '30px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(14, 41, 28, 0.25)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>SHOP COLLECTION</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/shop"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    color: '#0E291C',
                    padding: '14px 28px',
                    borderRadius: '30px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    border: '1.5px solid rgba(14, 41, 28, 0.25)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>VIEW PRODUCTS</span>
                </Link>
              </div>
            </div>

            {/* Right Showcase Column with 3D Photorealistic Render */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '540px',
                  aspectRatio: '16/9',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(14, 41, 28, 0.12)',
                  border: '1px solid rgba(216, 182, 106, 0.3)'
                }}
              >
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={`${slide.line1} ${slide.line2} - QAMRAH Premium Selection`}
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    animation: 'fadeIn 0.5s ease forwards'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Right Slide Control Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '28px',
              right: '36px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10
            }}
          >
            <button
              onClick={handlePrev}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(14, 41, 28, 0.2)',
                backgroundColor: '#FFFFFF',
                color: '#0F281E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>

            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F281E', minWidth: '40px', textAlign: 'center' }}>
              {currentSlide + 1} / {slides.length}
            </span>

            <button
              onClick={handleNext}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(14, 41, 28, 0.2)',
                backgroundColor: '#FFFFFF',
                color: '#0F281E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
              aria-label="Next Slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM FEATURE BAR                                                     */}
        {/* ========================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginTop: '36px',
            paddingTop: '12px'
          }}
          className="hero-features-grid"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(216, 182, 106, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: '1.5px solid #D8B66A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#B0883A',
                    flexShrink: 0
                  }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F281E', letterSpacing: '0.06em', marginBottom: '2px' }}>
                    {feat.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#687E72' }}>
                    {feat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .hero-features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-main-card {
            padding: 40px 32px 72px !important;
          }
        }
        @media (max-width: 640px) {
          .hero-features-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-main-card {
            padding: 32px 20px 72px !important;
          }
        }
      `}</style>
    </section>
  );
}
