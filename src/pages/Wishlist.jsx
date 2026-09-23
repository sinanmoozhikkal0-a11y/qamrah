import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import SEO from '../components/SEO';

export default function Wishlist() {
  const { wishlistItems, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddAllToCart = () => {
    wishlistItems.forEach((product) => {
      addToCart(product, product.packSize || product.weight || '250g', 1);
    });
    addToast(`Moved all ${wishlistItems.length} items to your shopping cart!`);
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div style={{ backgroundColor: '#07130D', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <SEO title="Your Wishlist" noIndex={true} />
        <div className="luxury-card" style={{ maxWidth: '520px', width: '100%', padding: '54px 32px', textAlign: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(199, 154, 74, 0.1)',
              border: '1px solid var(--color-gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-gold-base)',
              margin: '0 auto 24px'
            }}
          >
            <Heart size={32} />
          </div>

          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>YOUR CURATION</div>
          <h2 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginBottom: '12px' }}>
            Your Wishlist is Empty
          </h2>
          <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.6' }}>
            Explore our artisanal collection of W-180 cashews, Ajwa dates, California almonds, and Persian pistachios and save your favorites here.
          </p>

          <Link to="/shop" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <span>EXPLORE PRODUCTS</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '100vh', padding: '48px 0 90px' }}>
      <SEO title="Your Wishlist" noIndex={true} />
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div className="eyebrow-label">
              <Sparkles size={14} color="#D8B66A" />
              <span>SAVED FOR LATER</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF' }}>
              My Wishlist <span style={{ fontSize: '1.4rem', color: 'var(--color-gold-base)', fontWeight: '400' }}>({wishlistItems.length})</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAddAllToCart}
              className="btn btn-primary btn-sm"
            >
              <ShoppingBag size={15} />
              <span>MOVE ALL TO CART</span>
            </button>

            <button
              onClick={clearWishlist}
              className="btn btn-outline btn-sm"
            >
              <Trash2 size={15} />
              <span>Clear Wishlist</span>
            </button>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}
        >
          {wishlistItems.map((product) => (
            <ProductCard key={product.slug || product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
