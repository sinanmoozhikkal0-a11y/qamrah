import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Star, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';

      // Load products and categories from backend API
      setLoading(true);
      Promise.all([
        api.products.getAll({ status: 'active' }),
        api.categories.getAll()
      ]).then(([prodRes, catRes]) => {
        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data);
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
      }).catch((err) => {
        console.error('Failed to load search catalog from backend:', err);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setSelectedCategory('all');
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter products directly from backend list
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const cleanQuery = query.toLowerCase().trim();

    if (!cleanQuery) return matchesCategory;

    const matchesQuery =
      (item.name && item.name.toLowerCase().includes(cleanQuery)) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(cleanQuery)) ||
      (item.description && item.description.toLowerCase().includes(cleanQuery)) ||
      (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(cleanQuery)));

    return matchesCategory && matchesQuery;
  });

  const categoryOptions = [
    { id: 'all', label: 'All' },
    ...categories.map((c) => ({
      id: c.slug,
      label: c.name
    }))
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 12, 8, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="luxury-card"
        style={{
          width: '100%',
          maxWidth: '760px',
          backgroundColor: '#091A11',
          border: '1px solid var(--color-gold-border)',
          borderRadius: 'var(--radius-md)',
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 30px rgba(199,154,74,0.2)',
          position: 'relative',
          animation: 'fadeInUp 0.25s ease forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div className="eyebrow-label" style={{ margin: 0 }}>
            <span>SEARCH QAMRAH CATALOG</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close search modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-cream-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '18px'
          }}
        >
          <Search
            size={20}
            color="#D8B66A"
            style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Cashews, Medjool Dates, California Almonds, Pistachios..."
            className="luxury-input"
            style={{
              paddingLeft: '48px',
              paddingRight: query ? '40px' : '18px',
              fontSize: '1rem',
              height: '52px',
              borderRadius: '8px'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search text"
              style={{
                position: 'absolute',
                right: '14px',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-subtle)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '14px',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(199, 154, 74, 0.15)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginRight: '4px' }}>
            Category:
          </span>
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '5px 12px',
                borderRadius: '20px',
                border: selectedCategory === cat.id
                  ? '1px solid var(--color-gold-base)'
                  : '1px solid rgba(199, 154, 74, 0.2)',
                background: selectedCategory === cat.id
                  ? 'linear-gradient(135deg, #E2BF72 0%, #C79A4A 100%)'
                  : 'rgba(7, 19, 13, 0.6)',
                color: selectedCategory === cat.id ? '#07130D' : 'var(--color-cream-base)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <Loader2 size={30} color="#D8B66A" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.85rem' }}>Searching royal vault...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--color-cream-base)' }}>
                No products found matching "{query}"
              </p>
              <p style={{ fontSize: '0.85rem' }}>Try searching for "Cashew", "Ajwa", "Almond", or "Pistachio"</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredProducts.map((item) => {
                const itemKey = item.slug || item.id || item._id;
                const itemImg = item.mainImage || item.image || '/images/pouch_cashew.jpg';
                const isOutOfStock = item.inStock === false || (item.stock !== undefined && Number(item.stock) <= 0);
                return (
                  <Link
                    key={itemKey}
                    to={`/product/${itemKey}`}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(7, 19, 13, 0.7)',
                      border: '1px solid rgba(199, 154, 74, 0.15)',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-gold-base)';
                      e.currentTarget.style.backgroundColor = 'rgba(16, 35, 23, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(199, 154, 74, 0.15)';
                      e.currentTarget.style.backgroundColor = 'rgba(7, 19, 13, 0.7)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={itemImg}
                        alt={item.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          border: '1px solid rgba(199, 154, 74, 0.2)',
                          opacity: isOutOfStock ? 0.75 : 1
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'var(--color-text-white)',
                            marginBottom: '2px'
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-gold-base)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span>{item.categoryName || item.category}</span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                            <Star size={11} fill="#D8B66A" /> {item.rating || 4.9}
                          </span>
                          {isOutOfStock && (
                            <>
                              <span>•</span>
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: '700',
                                  letterSpacing: '0.04em',
                                  background: 'rgba(229, 62, 62, 0.2)',
                                  border: '1px solid rgba(229, 62, 62, 0.45)',
                                  color: '#FC8181',
                                  padding: '1px 6px',
                                  borderRadius: '3px'
                                }}
                              >
                                OUT OF STOCK
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-gold-light)' }}>
                        ₹{item.price}
                      </span>
                      <ArrowRight size={16} color="#D8B66A" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
