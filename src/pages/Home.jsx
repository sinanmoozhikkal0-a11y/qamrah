import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import QuickViewModal from '../components/QuickViewModal';
import SEO from '../components/SEO';
import { generateOrganizationSchema, generateWebSiteSchema } from '../utils/structuredData';
import { api } from '../services/api';
import { PRODUCTS } from '../data/products';

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [bestsellers, setBestsellers] = useState([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoadingBestsellers(true);
      try {
        const [homeRes, prodRes] = await Promise.all([
          api.home.get(),
          api.products.getAll()
        ]);

        if (homeRes.success && homeRes.data) {
          setCmsData(homeRes.data);
        }

        if (prodRes.success && prodRes.data && prodRes.data.length > 0) {
          setBestsellers(prodRes.data.slice(0, 5));
        } else {
          setBestsellers(PRODUCTS.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load home data from backend:', err);
        setBestsellers(PRODUCTS.slice(0, 5));
      } finally {
        setLoadingBestsellers(false);
      }
    };

    loadHomeData();
  }, []);

  // Category cards from CMS or default
  const categoryHighlights = cmsData?.shopByCategorySection?.categories?.length > 0
    ? cmsData.shopByCategorySection.categories
    : [
        {
          id: 'cashews',
          name: 'CASHEWS',
          subtitle: 'Colossal W-180 & Roasted',
          image: '/images/pouch_cashew.jpg',
          link: '/shop/cashews'
        },
        {
          id: 'almonds',
          name: 'ALMONDS',
          subtitle: 'California Supreme & Mamra',
          image: '/images/pouch_almond.jpg',
          link: '/shop/almonds'
        },
        {
          id: 'dates',
          name: 'DATES',
          subtitle: 'Royal Ajwa & King Medjool',
          image: '/images/pouch_dates.jpg',
          link: '/shop/dates'
        },
        {
          id: 'pistachios',
          name: 'PISTACHIOS',
          subtitle: 'Persian Roasted & Green Kernels',
          image: '/images/pouch_pista.jpg',
          link: '/shop/pistachios'
        }
      ];

  return (
    <div>
      <SEO
        title="Royal Dry Fruits, Premium Nuts & Sacred Dates"
        description="Discover QAMRAH's artisanal collection of handpicked W-180 Jumbo Cashews, California Almonds, Saudi Ajwa Dates, Iranian Pistachios, and Luxury Mix Nuts."
        canonical="/"
        ogType="website"
        jsonLd={[
          generateOrganizationSchema(),
          generateWebSiteSchema()
        ]}
      />
      {/* SECTION 1: HERO */}
      <Hero onQuickView={setQuickViewProduct} />

      {/* SECTION 2: BESTSELLERS */}
      <section
        className="bestsellers-showcase-section"
        style={{
          padding: '90px 0',
          position: 'relative',
          backgroundColor: '#07130D',
          backgroundImage: `
            radial-gradient(ellipse at 85% 15%, rgba(216, 182, 106, 0.09) 0%, transparent 45%),
            radial-gradient(ellipse at 15% 75%, rgba(22, 60, 40, 0.25) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(10, 28, 18, 0.5) 0%, transparent 100%)
          `,
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <SectionTitle
            eyebrow="OUR BESTSELLERS"
            title="Our Premium Collection"
            subtitle="Experience the finest selection of nuts and dates, packed with nutrition, quality and natural goodness."
            actionText="VIEW ALL PRODUCTS"
            actionLink="/shop"
          />

          {loadingBestsellers ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Loader2 size={32} color="#D8B66A" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.9rem' }}>Loading curated royal bestsellers...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : bestsellers.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px'
              }}
              className="bestseller-grid"
            >
              {bestsellers.map((product) => (
                <ProductCard
                  key={product.slug || product._id || product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-cream-muted)' }}>
              No bestseller products currently available.
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: SHOP BY CATEGORY */}
      <section
        style={{
          padding: '80px 0',
          backgroundColor: '#091A11',
          borderTop: '1px solid rgba(199, 154, 74, 0.2)',
          borderBottom: '1px solid rgba(199, 154, 74, 0.2)'
        }}
      >
        <div className="container">
          <SectionTitle
            eyebrow="CURATED VARIETIES"
            title="Shop By Category"
            subtitle="Explore our master grades sorted by botanical origin and flavor profiles."
            align="center"
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}
            className="category-cards-grid"
          >
            {categoryHighlights.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="category-card"
                style={{
                  position: 'relative',
                  height: '360px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-gold-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.4s ease'
                }}
              >
                {/* Background Image with Zoom on Hover */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="cat-bg-img"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 0
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(7, 19, 13, 0.2) 0%, rgba(7, 19, 13, 0.92) 100%)',
                    zIndex: 1,
                    transition: 'background 0.3s ease'
                  }}
                  className="cat-overlay"
                />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-cream-muted)',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em'
                    }}
                  >
                    {cat.subtitle}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      letterSpacing: '0.04em',
                      color: '#FFFFFF',
                      marginBottom: '10px'
                    }}
                  >
                    {cat.name}
                  </h3>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      letterSpacing: '0.12em',
                      color: 'var(--color-gold-light)',
                      textTransform: 'uppercase'
                    }}
                  >
                    <span>EXPLORE</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: TRUST BAR */}
      <TrustBar />

      {/* SECTION 8: NEWSLETTER */}
      <Newsletter />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <style>{`
        @media (max-width: 1100px) {
          .bestseller-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .bestseller-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .category-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .bestseller-grid {
            grid-template-columns: 1fr !important;
          }
          .category-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .category-card:hover .cat-bg-img {
          transform: scale(1.08);
        }
        .category-card:hover {
          border-color: var(--color-gold-base) !important;
        }
      `}</style>
    </div>
  );
}
