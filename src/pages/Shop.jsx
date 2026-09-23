import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Sparkles, Loader2 } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import QuickViewModal from '../components/QuickViewModal';
import SEO from '../components/SEO';
import { generateBreadcrumbSchema } from '../utils/structuredData';
import { api } from '../services/api';

export default function Shop() {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([{ id: 'all', name: 'All Products', slug: 'all' }]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [searchFilter, setSearchFilter] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadApiData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll()
        ]);
        if (prodRes.success && prodRes.data) {
          setProductsList(prodRes.data);
        } else {
          setProductsList([]);
        }
        if (catRes.success && catRes.data && catRes.data.length > 0) {
          setCategoriesList([
            { id: 'all', name: 'All Products', slug: 'all' },
            ...catRes.data.map((c) => ({
              id: c.slug,
              slug: c.slug,
              name: c.name,
              image: c.image
            }))
          ]);
        }
      } catch (err) {
        console.error('Failed to load products from backend:', err);
        setProductsList([]);
      } finally {
        setLoading(false);
      }
    };
    loadApiData();
  }, []);

  // Sync category if URL param changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory('all');
    }
  }, [urlCategory]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${catId}`);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(3000);
    setSearchFilter('');
    setSortBy('featured');
    navigate('/shop');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      const matchCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchPrice = item.price <= maxPrice;
      const matchSearch =
        !searchFilter.trim() ||
        item.name.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
        (item.description && item.description.toLowerCase().includes(searchFilter.toLowerCase().trim()));

      return matchCat && matchPrice && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.reviewCount || 0) - (a.reviewCount || 0);
      // Default: featured
      return (b.isFeatured || b.featured ? 1 : 0) - (a.isFeatured || a.featured ? 1 : 0);
    });
  }, [productsList, selectedCategory, maxPrice, searchFilter, sortBy]);

  const isFiltered =
    selectedCategory !== 'all' || maxPrice < 3000 || searchFilter.trim() !== '' || sortBy !== 'featured';

  const currentCatObj = categoriesList.find((c) => c.id === selectedCategory);
  const currentCatName = currentCatObj?.name || 'All Products';
  const pageTitle = selectedCategory && selectedCategory !== 'all'
    ? `${currentCatName} — Royal Selection`
    : 'Shop Premium Dry Fruits & Nuts Collection';
  const pageDesc = selectedCategory && selectedCategory !== 'all'
    ? `Explore QAMRAH's artisanal collection of handpicked ${currentCatName.toLowerCase()} sealed in signature freshness preservation packaging.`
    : "Discover QAMRAH's artisanal collection of handpicked W-180 Jumbo Cashews, California Almonds, Saudi Ajwa Dates, Iranian Pistachios, and Luxury Mix Nuts.";
  const canonicalUrl = selectedCategory && selectedCategory !== 'all'
    ? `/shop/${selectedCategory}`
    : '/shop';

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    ...(selectedCategory && selectedCategory !== 'all' ? [{ name: currentCatName, url: `/shop/${selectedCategory}` }] : [])
  ]);

  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '100vh', padding: '48px 0 80px' }}>
      <SEO
        title={pageTitle}
        description={pageDesc}
        canonical={canonicalUrl}
        jsonLd={breadcrumbSchema}
      />
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
            <Sparkles size={14} color="#D8B66A" />
            <span>THE ROYAL ARCHIVE</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#FFFFFF', marginBottom: '12px' }}>
            SHOP <span className="text-gold-gradient">PREMIUM COLLECTION</span>
          </h1>

          <p style={{ color: 'var(--color-cream-muted)', maxWidth: '580px', margin: '0 auto', fontSize: '1rem' }}>
            Discover handpicked W-180 Cashews, California Almonds, Saudi Dates, Persian Pistachios and Artisanal Mixes.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '36px'
          }}
        >
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--color-gold-base)' : '1px solid rgba(199, 154, 74, 0.25)',
                  backgroundColor: isActive ? 'linear-gradient(135deg, #E2BF72, #C79A4A)' : 'rgba(15, 35, 23, 0.6)',
                  background: isActive ? 'linear-gradient(135deg, #E2BF72 0%, #C79A4A 100%)' : 'rgba(15, 35, 23, 0.6)',
                  color: isActive ? '#07130D' : 'var(--color-cream-base)',
                  boxShadow: isActive ? '0 4px 14px rgba(199, 154, 74, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Filter & Controls Bar */}
        <div
          className="luxury-card"
          style={{
            padding: '18px 24px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: '#0A1B12'
          }}
        >
          {/* Left: Search input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 240px' }}>
            <input
              type="text"
              placeholder="Search in current view..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="luxury-input"
              style={{ height: '42px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Middle: Price Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-base)', fontWeight: '600', whiteSpace: 'nowrap' }}>
              Max Price: ₹{maxPrice}
            </span>
            <input
              type="range"
              min="400"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{
                accentColor: 'var(--color-gold-base)',
                cursor: 'pointer',
                width: '120px'
              }}
            />
          </div>

          {/* Right: Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-cream-muted)', whiteSpace: 'nowrap' }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="luxury-select"
              style={{ width: '180px', height: '42px', fontSize: '0.85rem' }}
            >
              <option value="featured">Featured Selection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated (4.8+)</option>
              <option value="newest">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {isFiltered && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '24px',
              fontSize: '0.8rem'
            }}
          >
            <span style={{ color: 'var(--color-text-subtle)' }}>Active Filters:</span>

            {selectedCategory !== 'all' && (
              <span className="badge-gold">
                Category: {selectedCategory}
                <button
                  onClick={() => handleCategoryChange('all')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '4px' }}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {maxPrice < 3000 && (
              <span className="badge-gold">
                Under ₹{maxPrice}
                <button
                  onClick={() => setMaxPrice(3000)}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '4px' }}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {searchFilter && (
              <span className="badge-gold">
                Query: "{searchFilter}"
                <button
                  onClick={() => setSearchFilter('')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '4px' }}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={handleClearFilters}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-gold-light)',
                textDecoration: 'underline',
                fontSize: '0.8rem',
                cursor: 'pointer',
                marginLeft: '6px'
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div style={{ marginBottom: '24px' }}>
          {loading ? (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
              <Loader2 size={36} color="#D8B66A" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.95rem' }}>Loading premium catalog from vault...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', marginBottom: '16px' }}>
                Showing <strong>{filteredProducts.length}</strong> premium products
              </div>

              <ProductGrid
                products={filteredProducts}
                onQuickView={(p) => setQuickViewProduct(p)}
                emptyMessage="No premium nuts found matching your criteria. Try adjusting your price slider or search terms."
              />
            </>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
