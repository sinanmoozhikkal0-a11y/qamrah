import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';

const DEFAULT_PACK_DESIGNS = [
  { name: 'Classic QAMRAH Pack', priceAdjustment: 0 },
  { name: 'Premium Gold Pack', priceAdjustment: 150 },
  { name: 'Royal Gift Box', priceAdjustment: 350 },
  { name: 'Corporate Gift Pack', priceAdjustment: 500 }
];

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [packDesigns, setPackDesigns] = useState(DEFAULT_PACK_DESIGNS);
  const [selectedWeight, setSelectedWeight] = useState(product?.packSize || product?.weight || '250g');
  const [selectedPackDesign, setSelectedPackDesign] = useState(DEFAULT_PACK_DESIGNS[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (isOpen) {
      api.packDesigns.getAll().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          const activePacks = res.data.filter((p) => p.status !== 'inactive');
          if (activePacks.length > 0) {
            setPackDesigns(activePacks);
            setSelectedPackDesign(activePacks[0]);
          }
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setSelectedWeight(product.packSize || product.weight || '250g');
      setSelectedPackDesign(packDesigns[0] || DEFAULT_PACK_DESIGNS[0]);
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product?.slug, product?.id, product?._id, packDesigns]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const isLiked = isInWishlist(product.id || product._id);

  // Compute price based on weight
  let basePrice = product.price;
  let currentOriginalPrice = product.originalPrice || product.mrp;

  if (product.availableWeights && product.availableWeights.length > 0) {
    const matched = product.availableWeights.find((w) => w.label === selectedWeight);
    if (matched) {
      basePrice = matched.price;
      currentOriginalPrice = matched.originalPrice || matched.price;
    }
  }

  const packAdjustment = selectedPackDesign?.priceAdjustment || 0;
  const currentPrice = basePrice + packAdjustment;
  const isOutOfStock = product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedWeight, quantity, selectedPackDesign?.name, packAdjustment);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 12, 8, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="luxury-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          backgroundColor: '#091A11',
          border: '1px solid var(--color-gold-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 35px rgba(199,154,74,0.25)',
          position: 'relative',
          animation: 'fadeInUp 0.3s ease forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(7, 19, 13, 0.75)',
            border: '1px solid rgba(199, 154, 74, 0.3)',
            color: 'var(--color-cream-base)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 360px) 1fr',
            gap: '0'
          }}
          className="quick-view-grid"
        >
          {/* Left Media Column with 2-slide Front/Back switcher */}
          <div
            style={{
              backgroundColor: '#06130C',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '1px solid rgba(199, 154, 74, 0.15)',
              position: 'relative'
            }}
          >
            {isOutOfStock && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: '#C53030',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  zIndex: 5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}
              >
                OUT OF STOCK
              </div>
            )}
            <img
              src={
                activeImageIndex === 1 && (product.backImage || product.mainImage || product.image)
                  ? (product.backImage || product.mainImage || product.image)
                  : (product.mainImage || product.image || '/images/pouch_cashew.jpg')
              }
              alt={`${product.name} ${activeImageIndex === 1 ? 'Back View' : 'Front View'}`}
              style={{
                width: '100%',
                maxHeight: '320px',
                objectFit: 'contain',
                borderRadius: '8px',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))',
                transition: 'all 0.3s ease'
              }}
            />

            {/* Quick View Front / Back Slide Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                width: '100%',
                marginTop: '16px'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveImageIndex(0)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: activeImageIndex === 0 ? 'rgba(216, 182, 106, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${activeImageIndex === 0 ? '#D8B66A' : 'rgba(199, 154, 74, 0.2)'}`,
                  color: activeImageIndex === 0 ? '#F6E2A8' : 'var(--color-cream-muted)',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                FRONT PACKET
              </button>

              <button
                type="button"
                onClick={() => setActiveImageIndex(1)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: activeImageIndex === 1 ? 'rgba(216, 182, 106, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${activeImageIndex === 1 ? '#D8B66A' : 'rgba(199, 154, 74, 0.2)'}`,
                  color: activeImageIndex === 1 ? '#F6E2A8' : 'var(--color-cream-muted)',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                BACK & NUTRITION
              </button>
            </div>
          </div>

          {/* Right Product Info */}
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
            <div className="eyebrow-label" style={{ marginBottom: '6px' }}>
              <span>{product.categoryName}</span>
              <span>•</span>
              <span>{product.origin || 'Pure Selection'}</span>
            </div>

            <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', color: '#FFFFFF' }}>
              {product.name}
            </h3>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', color: '#F6E2A8' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F6E2A8" />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-cream-muted)' }}>
                {product.rating} ({product.reviewCount || 120} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--color-gold-light)' }}>
                ₹{currentPrice}
              </span>
              {currentOriginalPrice && (
                <span style={{ fontSize: '0.95rem', color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}>
                  ₹{currentOriginalPrice}
                </span>
              )}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: isOutOfStock ? '#FC8181' : '#68D391',
                  marginLeft: 'auto'
                }}
              >
                {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-cream-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
              {product.shortDescription || product.description}
            </p>

            {/* Weight Options */}
            {product.availableWeights && product.availableWeights.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Select Pack Weight:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.availableWeights.map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setSelectedWeight(w.label)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: selectedWeight === w.label ? '1px solid var(--color-gold-base)' : '1px solid rgba(199, 154, 74, 0.25)',
                        background: selectedWeight === w.label ? 'rgba(199, 154, 74, 0.2)' : 'rgba(7, 19, 13, 0.7)',
                        color: selectedWeight === w.label ? 'var(--color-gold-light)' : 'var(--color-cream-base)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {w.label} - ₹{w.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pack Design Options */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Select Pack Design:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {packDesigns.map((pack) => {
                  const isSelected = selectedPackDesign?.name === pack.name;
                  return (
                    <button
                      key={pack.name}
                      type="button"
                      onClick={() => setSelectedPackDesign(pack)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: isSelected ? '1.5px solid var(--color-gold-base)' : '1px solid rgba(199, 154, 74, 0.25)',
                        background: isSelected ? 'rgba(199, 154, 74, 0.2)' : 'rgba(7, 19, 13, 0.7)',
                        color: isSelected ? 'var(--color-gold-light)' : 'var(--color-cream-base)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{pack.name}</span>
                      {pack.priceAdjustment > 0 && (
                        <span style={{ fontSize: '0.7rem', color: isSelected ? '#FFFFFF' : 'var(--color-gold-base)', marginLeft: '4px' }}>
                          (+₹{pack.priceAdjustment})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart + Wishlist */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '16px' }}>
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
                    padding: '12px 18px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    letterSpacing: '0.05em',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(229, 62, 62, 0.12)',
                    border: '1px solid rgba(229, 62, 62, 0.35)',
                    color: '#FC8181',
                    cursor: 'not-allowed',
                    textAlign: 'center'
                  }}
                >
                  OUT OF STOCK
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px 18px', fontSize: '0.85rem' }}
                >
                  <ShoppingBag size={16} />
                  <span>ADD TO CART</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(199, 154, 74, 0.3)',
                  background: isLiked ? 'var(--color-gold-primary)' : 'rgba(7, 19, 13, 0.7)',
                  color: isLiked ? '#07130D' : 'var(--color-cream-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Heart size={18} fill={isLiked ? '#07130D' : 'none'} />
              </button>
            </div>

            {/* View Full Product Details Link */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link
                to={`/product/${product.slug || product.id || product._id}`}
                onClick={onClose}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-gold-base)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600'
                }}
              >
                <span>View Complete Product Details &amp; Nutritional Facts</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .quick-view-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
