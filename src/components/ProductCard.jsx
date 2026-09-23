import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const productKey = product.slug || product.id || product._id;
  const productImage = product.mainImage || product.image || '/images/pouch_cashew.jpg';
  const productPack = product.packSize || product.weight || '250g';
  const productBadge = product.badge || product.tag;
  const originalPrice = product.mrp || product.originalPrice;
  const isOutOfStock = product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0);

  const isLiked = isInWishlist(productKey);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, productPack, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const discountPercent = originalPrice && originalPrice > product.price
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : (product.discount || 0);

  return (
    <div
      className="luxury-card product-card-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top Media / Thumbnail Area */}
      <div
        style={{
          position: 'relative',
          paddingTop: '100%', // 1:1 square
          overflow: 'hidden',
          backgroundColor: '#091A11',
          borderBottom: '1px solid rgba(199, 154, 74, 0.15)'
        }}
      >
        <Link to={`/product/${productKey}`} style={{ position: 'absolute', inset: 0 }}>
          <img
            src={productImage}
            alt={product?.name || 'QAMRAH Premium Selection'}
            className="product-card-img"
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </Link>

        {/* Badges Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 2
          }}
        >
          {isOutOfStock ? (
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: '#C53030',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              OUT OF STOCK
            </span>
          ) : (
            productBadge && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(135deg, #E2BF72 0%, #C79A4A 100%)',
                  color: '#07130D',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}
              >
                {productBadge}
              </span>
            )
          )}

          {!isOutOfStock && discountPercent > 0 && (
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                background: 'rgba(229, 62, 62, 0.85)',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '3px'
              }}
            >
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isLiked ? '#C79A4A' : 'rgba(7, 19, 13, 0.75)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${isLiked ? '#D8B66A' : 'rgba(199, 154, 74, 0.3)'}`,
            color: isLiked ? '#07130D' : '#F5F0E6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <Heart size={16} fill={isLiked ? '#07130D' : 'none'} />
        </button>

        {/* Quick View Floating Action */}
        <button
          type="button"
          onClick={handleQuickView}
          className="quick-view-btn"
          aria-label="Quick view product"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            opacity: 0,
            background: 'rgba(7, 19, 13, 0.9)',
            border: '1px solid var(--color-gold-base)',
            color: 'var(--color-cream-base)',
            padding: '7px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            zIndex: 3,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap'
          }}
        >
          <Eye size={13} color="#D8B66A" />
          <span>QUICK VIEW</span>
        </button>
      </div>

      {/* Product Details Section */}
      <div
        style={{
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Category & Rating Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
              fontSize: '0.725rem'
            }}
          >
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-gold-base)',
                fontWeight: '600'
              }}
            >
              {product.categoryName || product.category}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F6E2A8' }}>
              <Star size={12} fill="#F6E2A8" />
              <span style={{ fontWeight: '700', color: 'var(--color-cream-base)' }}>{product.rating || 4.9}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: '600',
              marginBottom: '6px',
              lineHeight: '1.35',
              minHeight: '2.7em'
            }}
          >
            <Link
              to={`/product/${productKey}`}
              style={{
                color: 'var(--color-text-white)',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-base)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-white)')}
            >
              {product.name}
            </Link>
          </h3>

          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginBottom: '12px' }}>
            Pack: {productPack} • Pure Grade
          </div>
        </div>

        {/* Price and Cart Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid rgba(199, 154, 74, 0.15)',
            marginTop: 'auto'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: 'var(--color-gold-light)'
                }}
              >
                ₹{product.price}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-subtle)',
                    textDecoration: 'line-through'
                  }}
                >
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          {isOutOfStock ? (
            <span
              style={{
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: '700',
                letterSpacing: '0.05em',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(229, 62, 62, 0.12)',
                border: '1px solid rgba(229, 62, 62, 0.35)',
                color: '#FC8181',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                userSelect: 'none'
              }}
            >
              OUT OF STOCK
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className="btn btn-primary btn-sm"
              style={{
                padding: '8px 14px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <ShoppingBag size={14} />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .product-card-container:hover .product-card-img {
          transform: scale(1.06);
        }
        .product-card-container:hover .quick-view-btn {
          opacity: 1 !important;
          transform: translateX(-50%) translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
