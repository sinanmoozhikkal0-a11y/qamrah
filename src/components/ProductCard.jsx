import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const productKey = product.slug || product.id || product._id;
  const productImage = product.mainImage || product.image || '/images/pouch_cashew.jpg';
  const productBadge = product.badge || product.tag;
  const originalPrice = product.mrp || product.originalPrice;
  const isOutOfStock = product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0);

  const isLiked = isInWishlist(productKey);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const pack = product.packSize || product.weight || '250g';
    addToCart(product, pack, 1);
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

  // Category Tag (e.g. PREMIUM DATES, JUMBO SIZE, NATURAL)
  const categoryTag = (product.categoryName || product.category || 'PREMIUM').toUpperCase();
  const title = (product.name || 'SIGNATURE DELIGHT').toUpperCase();

  return (
    <div className="qamrah-glass-card" id={`product-card-${productKey}`}>
      {/* Top Header Row: Badge on Left, Minimalist Outline Heart on Right */}
      <div className="card-top-bar">
        <div className="card-badge-wrap">
          {isOutOfStock ? (
            <div className="card-tag-badge out-of-stock">
              <span className="badge-lbl">OUT OF STOCK</span>
            </div>
          ) : discountPercent > 0 ? (
            <div className="card-tag-badge discount">
              <span className="badge-val">{discountPercent}%</span>
              <span className="badge-lbl">OFF</span>
            </div>
          ) : productBadge ? (
            <div className="card-tag-badge gold">
              <span className="badge-lbl">{productBadge}</span>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`card-heart-btn ${isLiked ? 'liked' : ''}`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            fill={isLiked ? '#D8B66A' : 'none'}
            color={isLiked ? '#D8B66A' : 'rgba(245, 240, 230, 0.75)'}
          />
        </button>
      </div>

      {/* Center Image Container with Hover Zoom & Quick View */}
      <div className="card-image-wrapper">
        <Link to={`/product/${productKey}`} className="card-image-link" tabIndex={-1}>
          <img
            src={productImage}
            alt={product.name || 'QAMRAH Dry Fruits'}
            className="card-main-img"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {onQuickView && (
          <button
            type="button"
            onClick={handleQuickView}
            className="card-quickview-btn"
            aria-label="Quick view product"
          >
            <Eye size={13} color="#D8B66A" />
            <span>QUICK VIEW</span>
          </button>
        )}
      </div>

      {/* Bottom Content Area: Category, Uppercase Title, Gold Price, and Cart Pill */}
      <div className="card-details-box">
        {/* Category Tag & Rating */}
        <div className="card-category-row">
          <span className="card-category-text">{categoryTag}</span>
          {product.rating && (
            <span className="card-rating-text">★ {product.rating}</span>
          )}
        </div>

        {/* Product Title (Bold, modern uppercase matching Picture 1) */}
        <h3 className="card-title-heading">
          <Link to={`/product/${productKey}`}>
            {title}
          </Link>
        </h3>

        {/* Price Row: Radiant Gold Sale Price + Strikethrough Original Price */}
        <div className="card-price-row">
          <span className="card-price-current">
            ₹{product.price}
          </span>
          {originalPrice && originalPrice > product.price && (
            <span className="card-price-original">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* "ADD TO CART" Pill Button with Shopping Cart Icon (Exact match to Picture 1) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`card-cart-pill-btn ${isOutOfStock ? 'disabled' : ''}`}
          aria-label={isOutOfStock ? 'Out of stock' : `Add ${product.name} to cart`}
        >
          <ShoppingCart
            size={15}
            color={isOutOfStock ? '#FC8181' : '#D8B66A'}
            strokeWidth={1.8}
          />
          <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
        </button>
      </div>

      {/* Scoped CSS Matching Picture 1's Luxury Frosted Glass Aesthetic */}
      <style>{`
        /* ===================================================================
           LUXURY GLASSMORPHIC PRODUCT CARD (Exact match to Picture 1)
           =================================================================== */
        .qamrah-glass-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 20px;
          border: 1px solid rgba(216, 182, 106, 0.38);
          background: rgba(11, 30, 20, 0.52);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(216, 182, 106, 0.18);
          padding: 16px 16px 18px 16px;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .qamrah-glass-card:hover {
          transform: translateY(-6px);
          border-color: rgba(216, 182, 106, 0.75);
          box-shadow: 0 20px 42px rgba(0, 0, 0, 0.58),
                      0 0 22px rgba(216, 182, 106, 0.22),
                      inset 0 1px 0 rgba(216, 182, 106, 0.35);
        }

        /* Top Bar: Badge & Heart */
        .card-top-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          width: 100%;
          min-height: 32px;
          z-index: 3;
        }

        .card-badge-wrap {
          display: flex;
          align-items: center;
        }

        /* "10% OFF" Badge matching Picture 1 */
        .card-tag-badge.discount {
          background: linear-gradient(135deg, #FDE6A8 0%, #D8B66A 100%);
          color: #0E2217;
          border-radius: 6px;
          padding: 3px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          line-height: 1.05;
        }

        .card-tag-badge.discount .badge-val {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .card-tag-badge.discount .badge-lbl {
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.06em;
        }

        .card-tag-badge.out-of-stock {
          background: #C53030;
          color: #FFFFFF;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .card-tag-badge.gold {
          background: linear-gradient(135deg, #FDE6A8 0%, #C79A4A 100%);
          color: #07130D;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }

        /* Minimalist Outline Heart Button */
        .card-heart-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: transform 0.25s ease, filter 0.25s ease;
        }

        .card-heart-btn:hover {
          transform: scale(1.18);
          filter: drop-shadow(0 0 6px rgba(216, 182, 106, 0.6));
        }

        /* Product Image Box */
        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 4px 0 14px 0;
          overflow: hidden;
        }

        .card-image-link {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .card-main-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.35));
        }

        .qamrah-glass-card:hover .card-main-img {
          transform: scale(1.06);
          filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.5));
        }

        /* Floating Quick View Button */
        .card-quickview-btn {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%) translateY(16px);
          opacity: 0;
          background: rgba(7, 19, 13, 0.88);
          border: 1px solid rgba(216, 182, 106, 0.6);
          color: #FAF4EA;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          z-index: 4;
        }

        .qamrah-glass-card:hover .card-quickview-btn {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .card-quickview-btn:hover {
          background: rgba(216, 182, 106, 0.25);
          border-color: #D8B66A;
          color: #FFFFFF;
        }

        /* Details Area */
        .card-details-box {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: space-between;
        }

        .card-category-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .card-category-text {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: #9FB5A9;
          text-transform: uppercase;
        }

        .card-rating-text {
          font-size: 0.72rem;
          font-weight: 700;
          color: #F6E2A8;
        }

        /* Uppercase Product Title */
        .card-title-heading {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          line-height: 1.35;
          text-transform: uppercase;
          margin: 0 0 10px 0;
          min-height: 2.5em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-title-heading a {
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .card-title-heading a:hover {
          color: #D8B66A;
        }

        /* Price Row matching Picture 1 */
        .card-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 14px;
        }

        .card-price-current {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: #D8B66A;
        }

        .card-price-original {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.86rem;
          font-weight: 400;
          color: #6F8477;
          text-decoration: line-through;
        }

        /* "ADD TO CART" Pill Button matching Picture 1 */
        .card-cart-pill-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(10, 28, 18, 0.45);
          border: 1.5px solid rgba(216, 182, 106, 0.55);
          border-radius: 9999px;
          padding: 10px 18px;
          color: #FAF4EA;
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .card-cart-pill-btn:hover:not(:disabled) {
          background: rgba(216, 182, 106, 0.22);
          border-color: #D8B66A;
          color: #FFFFFF;
          box-shadow: 0 6px 20px rgba(216, 182, 106, 0.3);
          transform: translateY(-1.5px);
        }

        .card-cart-pill-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .card-cart-pill-btn.disabled,
        .card-cart-pill-btn:disabled {
          background: rgba(197, 48, 48, 0.12);
          border-color: rgba(197, 48, 48, 0.4);
          color: #FC8181;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
