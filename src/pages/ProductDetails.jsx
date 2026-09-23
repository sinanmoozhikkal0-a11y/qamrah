import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Leaf,
  Award,
  Loader2
} from 'lucide-react';
import QuantitySelector from '../components/QuantitySelector';
import ProductCard from '../components/ProductCard';
import CheckoutModal from '../components/CheckoutModal';
import QuickViewModal from '../components/QuickViewModal';
import SectionTitle from '../components/SectionTitle';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/structuredData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';

const DEFAULT_PACK_DESIGNS = [
  { name: 'Classic QAMRAH Pack', priceAdjustment: 0 },
  { name: 'Premium Gold Pack', priceAdjustment: 150 },
  { name: 'Royal Gift Box', priceAdjustment: 350 },
  { name: 'Corporate Gift Pack', priceAdjustment: 500 }
];

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packDesigns, setPackDesigns] = useState(DEFAULT_PACK_DESIGNS);
  const [selectedPackDesign, setSelectedPackDesign] = useState(DEFAULT_PACK_DESIGNS[0]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Fetch product and pack designs directly from API
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setActiveImageIndex(0);
    setLoading(true);

    const loadData = async () => {
      try {
        const [prodRes, packRes] = await Promise.all([
          api.products.getByIdOrSlug(id),
          api.packDesigns.getAll()
        ]);

        if (prodRes.success && prodRes.data) {
          const currentProd = prodRes.data;
          setProduct(currentProd);
          setSelectedWeight(
            currentProd.packSize ||
            currentProd.weight ||
            (currentProd.availableWeights?.[0]?.label) ||
            '250g'
          );

          // Fetch related products in the same category from live backend API
          if (currentProd.category) {
            try {
              const relRes = await api.products.getAll({ category: currentProd.category, status: 'active' });
              if (relRes.success && relRes.data) {
                const currentKey = currentProd.slug || currentProd._id || currentProd.id;
                const filteredRel = relRes.data
                  .filter((p) => (p.slug || p._id || p.id) !== currentKey)
                  .slice(0, 4);
                setRelatedProducts(filteredRel);
              }
            } catch (_) {
              setRelatedProducts([]);
            }
          }
        } else {
          setProduct(null);
        }

        if (packRes.success && packRes.data && packRes.data.length > 0) {
          const activePacks = packRes.data.filter((p) => p.status !== 'inactive');
          if (activePacks.length > 0) {
            setPackDesigns(activePacks);
            setSelectedPackDesign(activePacks[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load product details from backend:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '160px 20px', textAlign: 'center', backgroundColor: '#07130D', minHeight: '60vh' }}>
        <Loader2 size={40} color="#D8B66A" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--color-cream-muted)', fontSize: '1rem' }}>Retrieving royal product specifications from vault...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', backgroundColor: '#07130D', minHeight: '60vh' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#FFFFFF' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          The requested product does not exist in our live catalog or has been archived.
        </p>
        <Link to="/shop" className="btn btn-primary">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  const productKey = product.slug || product.id || product._id;
  const isLiked = isInWishlist(productKey);

  // Compute base price based on selected weight
  let basePrice = product.price;
  let currentOriginalPrice = product.mrp || product.originalPrice;

  if (product.availableWeights && product.availableWeights.length > 0) {
    const matched = product.availableWeights.find((w) => w.label === selectedWeight);
    if (matched) {
      basePrice = matched.price;
      currentOriginalPrice = matched.originalPrice || matched.price;
    }
  }

  // Pack design adjustment
  const packAdjustment = selectedPackDesign?.priceAdjustment || 0;
  const currentPrice = basePrice + packAdjustment;
  const isOutOfStock = product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedWeight, quantity, selectedPackDesign?.name, packAdjustment);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedWeight, quantity, selectedPackDesign?.name, packAdjustment);
    setIsCheckoutOpen(true);
  };

  const productImage = product.mainImage || product.image || '/images/pouch_cashew.jpg';
  const productBackImage = product.backImage || productImage;
  const productBadge = product.badge || product.tag;

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: product.categoryName || product.category || 'Category', url: `/shop/${product.category || 'all'}` },
    { name: product.name, url: `/product/${product.slug || product.id}` }
  ]);

  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '100vh', padding: '36px 0 80px' }}>
      <SEO
        title={product.name}
        description={product.shortDescription || product.description || `Buy ${product.name} from QAMRAH. Handpicked royal grade dry fruits.`}
        canonical={`/product/${product.slug || product.id}`}
        ogImage={productImage}
        ogType="product"
        jsonLd={[productSchema, breadcrumbSchema]}
      />
      <div className="container">
        {/* Breadcrumbs */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'var(--color-text-subtle)',
            marginBottom: '32px'
          }}
        >
          <Link to="/" style={{ color: 'var(--color-cream-muted)' }}>
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/shop" style={{ color: 'var(--color-cream-muted)' }}>
            Shop
          </Link>
          <ChevronRight size={14} />
          <Link to={`/shop/${product.category}`} style={{ color: 'var(--color-gold-base)', textTransform: 'capitalize' }}>
            {product.categoryName}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: '#FFFFFF', fontWeight: '600' }}>{product.name}</span>
        </nav>

        {/* Main Product Presentation Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1fr)',
            gap: '54px',
            marginBottom: '72px'
          }}
          className="product-detail-grid"
        >
          {/* Left: Product Image & Gallery */}
          <div>
            <div
              className="luxury-card"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#0A1A12',
                border: '1px solid var(--color-gold-border)',
                boxShadow: 'var(--shadow-lg)',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '440px'
              }}
            >
              <img
                src={
                  activeImageIndex === 1 && productBackImage
                    ? productBackImage
                    : productImage
                }
                alt={`${product.name} ${activeImageIndex === 1 ? 'Back View' : 'Front View'}`}
                style={{
                  width: '100%',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.7))',
                  transition: 'all 0.3s ease'
                }}
              />

              {/* Tag Badges */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2 }}>
                {isOutOfStock ? (
                  <span
                    style={{
                      background: '#C53030',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    OUT OF STOCK
                  </span>
                ) : (
                  productBadge && <span className="badge-gold" style={{ background: 'var(--color-gold-primary)', color: '#07130D' }}>{productBadge}</span>
                )}
                <span className="badge-gold">
                  {activeImageIndex === 1 ? 'NUTRITION & BACK VIEW' : 'FRONT PACKET'}
                </span>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? 1 : 0))}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(7, 19, 13, 0.85)',
                  border: '1px solid rgba(216, 182, 106, 0.4)',
                  color: '#D8B66A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 3,
                  transition: 'all 0.25s ease'
                }}
                aria-label="Previous image slide"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? 1 : 0))}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(7, 19, 13, 0.85)',
                  border: '1px solid rgba(216, 182, 106, 0.4)',
                  color: '#D8B66A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 3,
                  transition: 'all 0.25s ease'
                }}
                aria-label="Next image slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* 2-Slide Thumbnail Selector Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginTop: '16px'
              }}
            >
              {/* Thumbnail 1: Front View */}
              <button
                type="button"
                onClick={() => setActiveImageIndex(0)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: activeImageIndex === 0 ? 'rgba(216, 182, 106, 0.15)' : '#07160E',
                  border: `1.5px solid ${activeImageIndex === 0 ? '#D8B66A' : 'rgba(199, 154, 74, 0.25)'}`,
                  color: activeImageIndex === 0 ? '#F6E2A8' : 'var(--color-cream-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'left'
                }}
              >
                <img
                  src={productImage}
                  alt={`${product.name} Front View`}
                  loading="lazy"
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>FRONT VIEW</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Main Pack Design</div>
                </div>
              </button>

              {/* Thumbnail 2: Back & Nutrition View */}
              <button
                type="button"
                onClick={() => setActiveImageIndex(1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: activeImageIndex === 1 ? 'rgba(216, 182, 106, 0.15)' : '#07160E',
                  border: `1.5px solid ${activeImageIndex === 1 ? '#D8B66A' : 'rgba(199, 154, 74, 0.25)'}`,
                  color: activeImageIndex === 1 ? '#F6E2A8' : 'var(--color-cream-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'left'
                }}
              >
                <img
                  src={productBackImage}
                  alt={`${product.name} Back Packaging and Nutrition`}
                  loading="lazy"
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>BACK VIEW</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Nutrition & Details</div>
                </div>
              </button>
            </div>

            {/* Micro Trust Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '20px'
              }}
            >
              <div className="luxury-card" style={{ padding: '12px', textAlign: 'center' }}>
                <Leaf size={18} color="#D8B66A" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-cream-base)' }}>Preservative Free</div>
              </div>
              <div className="luxury-card" style={{ padding: '12px', textAlign: 'center' }}>
                <Award size={18} color="#D8B66A" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-cream-base)' }}>Royal Grade</div>
              </div>
              <div className="luxury-card" style={{ padding: '12px', textAlign: 'center' }}>
                <Truck size={18} color="#D8B66A" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-cream-base)' }}>Airtight Pouch</div>
              </div>
            </div>
          </div>

          {/* Right: Product Purchase Controls */}
          <div>
            <div className="eyebrow-label" style={{ marginBottom: '8px' }}>
              <Sparkles size={14} color="#D8B66A" />
              <span>{product.categoryName} • {product.origin}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#FFFFFF', marginBottom: '12px', lineHeight: 1.15 }}>
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', color: '#F6E2A8' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F6E2A8" />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-cream-muted)', fontWeight: '600' }}>
                {product.rating} ({product.reviewCount || 150} Verified Connoisseur Reviews)
              </span>
            </div>

            {/* Price Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                padding: '16px 20px',
                background: 'rgba(15, 35, 23, 0.6)',
                border: '1px solid rgba(199, 154, 74, 0.25)',
                borderRadius: '8px',
                marginBottom: '24px'
              }}
            >
              <span style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--color-gold-light)' }}>
                ₹{currentPrice}
              </span>
              {currentOriginalPrice && (
                <span style={{ fontSize: '1.2rem', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>
                  ₹{currentOriginalPrice}
                </span>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    letterSpacing: '0.05em',
                    color: isOutOfStock ? '#FC8181' : '#68D391'
                  }}
                >
                  {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK • FAST DISPATCH'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>
                  INCLUSIVE OF ALL TAXES
                </span>
              </div>
            </div>

            <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-cream-muted)', marginBottom: '28px' }}>
              {product.shortDescription || product.description}
            </p>

            {/* Weight / Pack Size Selector */}
            {product.availableWeights && product.availableWeights.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-gold-base)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  SELECT PACKAGING SIZE:
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {product.availableWeights.map((w) => {
                    const isSelected = selectedWeight === w.label;
                    return (
                      <button
                        key={w.label}
                        type="button"
                        onClick={() => setSelectedWeight(w.label)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid var(--color-gold-base)' : '1px solid rgba(199, 154, 74, 0.25)',
                          background: isSelected ? 'rgba(199, 154, 74, 0.2)' : 'rgba(7, 19, 13, 0.7)',
                          color: isSelected ? 'var(--color-gold-light)' : 'var(--color-cream-base)',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{w.label}</span>
                        <span style={{ fontSize: '0.75rem', color: isSelected ? '#FFFFFF' : 'var(--color-text-subtle)' }}>
                          ₹{w.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pack Design Option Selector */}
            {packDesigns && packDesigns.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-gold-base)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  SELECT PACK DESIGN:
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {packDesigns.map((pack) => {
                    const isSelected = selectedPackDesign?.name === pack.name;
                    return (
                      <button
                        key={pack.name}
                        type="button"
                        onClick={() => setSelectedPackDesign(pack)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid var(--color-gold-base)' : '1px solid rgba(199, 154, 74, 0.25)',
                          background: isSelected ? 'rgba(199, 154, 74, 0.2)' : 'rgba(7, 19, 13, 0.7)',
                          color: isSelected ? 'var(--color-gold-light)' : 'var(--color-cream-base)',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{pack.name}</span>
                        {pack.priceAdjustment > 0 && (
                          <span style={{ fontSize: '0.75rem', color: isSelected ? '#FFFFFF' : 'var(--color-gold-base)', fontWeight: '700' }}>
                            (+₹{pack.priceAdjustment})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {!isOutOfStock && (
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => setQuantity((q) => q + 1)}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                  />
                )}

                {isOutOfStock ? (
                  <button
                    type="button"
                    disabled
                    style={{
                      flex: 1,
                      padding: '15px 24px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(229, 62, 62, 0.12)',
                      border: '1px solid rgba(229, 62, 62, 0.35)',
                      color: '#FC8181',
                      cursor: 'not-allowed',
                      textAlign: 'center'
                    }}
                  >
                    CURRENTLY OUT OF STOCK
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '15px 24px', fontSize: '0.9rem' }}
                  >
                    <ShoppingBag size={18} />
                    <span>ADD TO CART</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(199, 154, 74, 0.35)',
                    background: isLiked ? 'var(--color-gold-primary)' : 'rgba(7, 19, 13, 0.7)',
                    color: isLiked ? '#07130D' : 'var(--color-cream-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Heart size={20} fill={isLiked ? '#07130D' : 'none'} />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn btn-outline btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>BUY NOW (EXPRESS CHECKOUT)</span>
                </button>
              )}

              {isOutOfStock && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    background: 'rgba(229, 62, 62, 0.08)',
                    border: '1px solid rgba(229, 62, 62, 0.2)',
                    color: 'var(--color-cream-muted)',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                  }}
                >
                  This harvest batch is temporarily sold out. Add to your wishlist to receive restock notifications.
                </div>
              )}
            </div>

            {/* Highlights List */}
            {product.highlights && (
              <div
                style={{
                  borderTop: '1px solid rgba(199, 154, 74, 0.2)',
                  paddingTop: '20px'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-gold-base)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  KEY QUALITY ASSURANCES:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--color-cream-base)' }}>
                      <CheckCircle2 size={16} color="#D8B66A" style={{ flexShrink: 0 }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="luxury-card" style={{ padding: '36px', marginBottom: '72px' }}>
          {/* Tabs Bar */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              borderBottom: '1px solid rgba(199, 154, 74, 0.2)',
              paddingBottom: '16px',
              marginBottom: '28px',
              overflowX: 'auto'
            }}
          >
            {[
              { id: 'description', label: 'Description' },
              { id: 'benefits', label: 'Health Benefits' },
              { id: 'nutrition', label: 'Nutritional Facts' },
              { id: 'shipping', label: 'Storage & Shipping' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  letterSpacing: '0.04em',
                  color: activeTab === tab.id ? 'var(--color-gold-light)' : 'var(--color-text-subtle)',
                  cursor: 'pointer',
                  padding: '4px 0',
                  position: 'relative',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-17px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'var(--color-gold-base)'
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--color-cream-muted)' }}>
            {activeTab === 'description' && (
              <div>
                <p style={{ marginBottom: '16px' }}>{product.description}</p>
                <p>
                  <strong>Ingredients:</strong> {product.ingredients || '100% Pure Natural Kernels'}
                </p>
                <p style={{ marginTop: '12px' }}>
                  <strong>Origin:</strong> {product.origin || 'Imported Botanical Harvest'}
                </p>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div>
                <p style={{ marginBottom: '16px' }}>
                  QAMRAH dry fruits are minimally processed to preserve naturally active lipids, minerals, and bio-available micro-nutrients:
                </p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.healthBenefits?.map((b, i) => (
                    <li key={i}>{b}</li>
                  )) || <li>Rich source of antioxidants, dietary fiber, and heart-healthy unsaturated fatty acids.</li>}
                </ul>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h4 style={{ color: '#FFFFFF', marginBottom: '12px' }}>Approximate Values per 30g Serving</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  {product.nutritionalFacts ? (
                    Object.entries(product.nutritionalFacts).map(([key, val]) => (
                      <div key={key} style={{ background: 'rgba(7, 19, 13, 0.7)', padding: '12px 16px', borderRadius: '6px', border: '1px solid rgba(199, 154, 74, 0.15)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-base)', textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF' }}>
                          {val}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Nutritional breakdown available on physical packaging label.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>Preservation &amp; Storage Guidelines</h4>
                <p style={{ marginBottom: '14px' }}>
                  Store in a cool, dry, dark pantry away from direct heat and moisture. Once opened, re-zip the oxygen-barrier seal immediately or transfer to an airtight glass canister. Refrigeration is recommended during warm tropical months to preserve natural essential oils and optimal crispness.
                </p>
                <p>
                  <strong>Express Dispatch:</strong> Orders placed before 3:00 PM are dispatched same-day via expedited temperature-safe air cargo.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <SectionTitle
              eyebrow="YOU MAY ALSO SAVOR"
              title="Related Connoisseur Picks"
              align="center"
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
              }}
            >
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug || p._id || p.id} product={p} onQuickView={(item) => setQuickViewProduct(item)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <style>{`
        @media (max-width: 840px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  );
}
