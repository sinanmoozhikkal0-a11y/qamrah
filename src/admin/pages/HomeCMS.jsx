import React, { useState, useEffect } from 'react';
import {
  Home,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Award,
  Layers,
  ShoppingBag,
  BookOpen,
  Mail,
  CheckCircle,
  Eye
} from 'lucide-react';
import { api } from '../../services/api';
import SaveToast from '../components/SaveToast';
import ImageUploadField from '../components/ImageUploadField';

export default function HomeCMS() {
  const [activeTab, setActiveTab] = useState('hero');
  const [homeData, setHomeData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const loadData = async () => {
    setLoading(true);
    try {
      const [homeRes, prodRes] = await Promise.all([
        api.home.get(),
        api.products.getAll()
      ]);
      if (homeRes.success) {
        const data = homeRes.data;
        if (!data.heroSection || !data.heroSection.products || data.heroSection.products.length === 0) {
          data.heroSection = {
            enabled: true,
            eyebrow: 'PREMIUM NUTS',
            headingLine1: 'PURE GOODNESS',
            headingLine2: 'IN EVERY BITE',
            description: 'Naturally sourced, carefully selected, for a healthier tomorrow.',
            ctaText: 'EXPLORE PRODUCTS',
            ctaLink: '/shop',
            backgroundImage: '/images/hero_forest_stage.jpg',
            rotationTiming: 5,
            badgeText: 'PREMIUM QUALITY',
            products: [
              {
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
                name: 'Whole Cashews',
                subName: 'Colossal W-180 • Hand-Selected',
                headline: 'Pure Crunch In Every Bite Colossal Cashews.',
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
            ]
          };
        }
        setHomeData(data);
      }
      if (prodRes.success) setAllProducts(prodRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleHeroFieldChange = (field, value) => {
    setHomeData((prev) => ({
      ...prev,
      heroSection: {
        ...(prev.heroSection || {}),
        [field]: value
      }
    }));
  };

  const handleAddHeroProduct = () => {
    const newProd = {
      name: 'Signature Royal Nuts',
      subName: 'Handpicked Luxury Selection',
      image: '/images/hero_stage_cashew.jpg',
      pouchImage: '/images/pouch_cashew.jpg',
      description: 'Naturally sourced, carefully selected, for a healthier tomorrow.',
      link: '/shop',
      order: ((homeData.heroSection?.products || []).length) + 1,
      isActive: true
    };
    setHomeData((prev) => ({
      ...prev,
      heroSection: {
        ...(prev.heroSection || {}),
        products: [...(prev.heroSection?.products || []), newProd]
      }
    }));
  };

  const handleRemoveHeroProduct = (index) => {
    const updated = [...(homeData.heroSection?.products || [])];
    updated.splice(index, 1);
    setHomeData((prev) => ({
      ...prev,
      heroSection: {
        ...(prev.heroSection || {}),
        products: updated
      }
    }));
  };

  const handleHeroProductChange = (index, field, value) => {
    const updated = [...(homeData.heroSection?.products || [])];
    updated[index] = { ...updated[index], [field]: value };
    setHomeData((prev) => ({
      ...prev,
      heroSection: {
        ...(prev.heroSection || {}),
        products: updated
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.home.update(homeData);
      if (res.success) {
        setToastMessage('Changes saved successfully');
        setToastType('success');
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to save changes');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  // Helper slide modifiers
  const handleAddSlide = () => {
    const newSlide = {
      eyebrow: 'NEW COLLECTION • ROYAL SELECTION',
      line1: 'Royal Harvest,',
      line2: 'Nature’s Best.',
      description: 'Handpicked premium nuts delivered fresh in signature preservation packaging.',
      image: '/images/hero_cashew_render.jpg',
      button1Text: 'DISCOVER COLLECTION',
      button1Link: '/shop',
      button2Text: 'VIEW PRODUCT',
      button2Link: '/shop',
      enabled: true,
      order: (homeData.heroSlides?.length || 0) + 1
    };
    setHomeData({
      ...homeData,
      heroSlides: [...(homeData.heroSlides || []), newSlide]
    });
  };

  const handleRemoveSlide = (index) => {
    const updated = [...homeData.heroSlides];
    updated.splice(index, 1);
    setHomeData({ ...homeData, heroSlides: updated });
  };

  const handleSlideChange = (index, field, value) => {
    const updated = [...homeData.heroSlides];
    updated[index][field] = value;
    setHomeData({ ...homeData, heroSlides: updated });
  };

  if (loading || !homeData) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#FFFFFF' }}>Loading Home CMS...</div>;
  }

  return (
    <div>
      <SaveToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      {/* Top Controls with Prominent Save Button */}
      <div
        className="admin-card"
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>Homepage CMS Editor</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Customize all customer-facing sections of the QAMRAH homepage without touching code.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Eye size={16} />
            <span>Live Preview</span>
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-primary admin-btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={18} />
            <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'announcement' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcement')}
        >
          1. Announcement Bar
        </button>
        <button
          className={`admin-tab ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          2. Hero Slider
        </button>
        <button
          className={`admin-tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          3. Feature Benefits
        </button>
        <button
          className={`admin-tab ${activeTab === 'bestsellers' ? 'active' : ''}`}
          onClick={() => setActiveTab('bestsellers')}
        >
          4. Best Sellers
        </button>
        <button
          className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          5. Shop by Category
        </button>
        <button
          className={`admin-tab ${activeTab === 'story' ? 'active' : ''}`}
          onClick={() => setActiveTab('story')}
        >
          6. Our Story Preview
        </button>
        <button
          className={`admin-tab ${activeTab === 'cta' ? 'active' : ''}`}
          onClick={() => setActiveTab('cta')}
        >
          7. Luxury CTA Banner
        </button>
        <button
          className={`admin-tab ${activeTab === 'newsletter' ? 'active' : ''}`}
          onClick={() => setActiveTab('newsletter')}
        >
          8. Newsletter
        </button>
      </div>

      {/* TAB 1: Announcement Bar */}
      {activeTab === 'announcement' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Top Announcement Bar Badges</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#FFFFFF' }}>
              <input
                type="checkbox"
                checked={homeData.announcement?.enabled}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    announcement: { ...homeData.announcement, enabled: e.target.checked }
                  })
                }
              />
              <span>Enable Section</span>
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(homeData.announcement?.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Badge {idx + 1} Text</label>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const items = [...homeData.announcement.items];
                      items[idx].text = e.target.value;
                      setHomeData({ ...homeData, announcement: { ...homeData.announcement, items } });
                    }}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Badge {idx + 1} Icon Name</label>
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => {
                      const items = [...homeData.announcement.items];
                      items[idx].icon = e.target.value;
                      setHomeData({ ...homeData, announcement: { ...homeData.announcement, items } });
                    }}
                    className="admin-input"
                  />
                </div>
              </div>
            ))}

            <div className="admin-form-group">
              <label className="admin-label">Track Order Link Text</label>
              <input
                type="text"
                value={homeData.announcement?.trackOrderText || 'Track Order'}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    announcement: { ...homeData.announcement, trackOrderText: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hero Section & Product Showcase */}
      {activeTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Main Hero Header & General Settings Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Editorial Hero & Stage Settings</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                  Manage the main hero typography, CTA buttons, background atmosphere, and rotation timings matching the reference design.
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#FFFFFF' }}>
                <input
                  type="checkbox"
                  checked={homeData.heroSection?.enabled ?? true}
                  onChange={(e) => handleHeroFieldChange('enabled', e.target.checked)}
                />
                <span>Enable Hero Section</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Eyebrow Tagline</label>
                <input
                  type="text"
                  value={homeData.heroSection?.eyebrow || ''}
                  onChange={(e) => handleHeroFieldChange('eyebrow', e.target.value)}
                  placeholder="e.g. PREMIUM NUTS"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Rotation Timing (Seconds)</label>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={homeData.heroSection?.rotationTiming || 5}
                  onChange={(e) => handleHeroFieldChange('rotationTiming', Number(e.target.value))}
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Hero Heading (Line 1 - White/Cream)</label>
                <input
                  type="text"
                  value={homeData.heroSection?.headingLine1 || ''}
                  onChange={(e) => handleHeroFieldChange('headingLine1', e.target.value)}
                  placeholder="e.g. PURE GOODNESS"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Hero Heading (Line 2 - Luxury Gold)</label>
                <input
                  type="text"
                  value={homeData.heroSection?.headingLine2 || ''}
                  onChange={(e) => handleHeroFieldChange('headingLine2', e.target.value)}
                  placeholder="e.g. IN EVERY BITE"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Hero Description / Subtitle</label>
              <textarea
                rows="2"
                value={homeData.heroSection?.description || ''}
                onChange={(e) => handleHeroFieldChange('description', e.target.value)}
                placeholder="e.g. Naturally sourced, carefully selected, for a healthier tomorrow."
                className="admin-textarea"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Primary CTA Button Text</label>
                <input
                  type="text"
                  value={homeData.heroSection?.ctaText || ''}
                  onChange={(e) => handleHeroFieldChange('ctaText', e.target.value)}
                  placeholder="e.g. EXPLORE PRODUCTS"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Primary CTA Link</label>
                <input
                  type="text"
                  value={homeData.heroSection?.ctaLink || ''}
                  onChange={(e) => handleHeroFieldChange('ctaLink', e.target.value)}
                  placeholder="e.g. /shop"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Bottom Luxury Badge Text</label>
                <input
                  type="text"
                  value={homeData.heroSection?.badgeText || ''}
                  onChange={(e) => handleHeroFieldChange('badgeText', e.target.value)}
                  placeholder="e.g. PREMIUM QUALITY"
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              <ImageUploadField
                label="Hero Stage Background Image"
                value={homeData.heroSection?.backgroundImage || ''}
                onChange={(url) => handleHeroFieldChange('backgroundImage', url)}
                folder="hero"
                section="hero"
              />
            </div>
          </div>

          {/* Multiple Hero Products Card */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="admin-card-title">
                  Showcase Hero Products ({(homeData.heroSection?.products || []).length})
                </h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                  Manage the luxury packaging renders rotated on the foreground pedestal table.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddHeroProduct}
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                <Plus size={14} />
                <span>Add Product</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(homeData.heroSection?.products || []).map((product, idx) => (
                <div key={idx} className="admin-card" style={{ borderLeft: '4px solid var(--admin-gold-base)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--admin-gold-base)' }}>
                      Product {idx + 1}: {product.name || 'Untitled Product'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={product.isActive ?? true}
                          onChange={(e) => handleHeroProductChange(idx, 'isActive', e.target.checked)}
                        />
                        <span>Active</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveHeroProduct(idx)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Product Name</label>
                      <input
                        type="text"
                        value={product.name || ''}
                        onChange={(e) => handleHeroProductChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Signature Cashew W-180"
                        className="admin-input"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Display Order</label>
                      <input
                        type="number"
                        value={product.order ?? idx + 1}
                        onChange={(e) => handleHeroProductChange(idx, 'order', Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Target Link</label>
                      <input
                        type="text"
                        value={product.link || ''}
                        onChange={(e) => handleHeroProductChange(idx, 'link', e.target.value)}
                        placeholder="e.g. /product/cashews"
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Product Subtitle / Details</label>
                      <input
                        type="text"
                        value={product.subName || ''}
                        onChange={(e) => handleHeroProductChange(idx, 'subName', e.target.value)}
                        placeholder="e.g. Colossal W-180 • Premium Nuts"
                        className="admin-input"
                      />
                    </div>
                    <ImageUploadField
                      label="Product Stage Image"
                      value={product.image || ''}
                      onChange={(url) => handleHeroProductChange(idx, 'image', url)}
                      folder="hero"
                      section="hero"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Product Description / Highlights</label>
                    <textarea
                      rows="2"
                      value={product.description || ''}
                      onChange={(e) => handleHeroProductChange(idx, 'description', e.target.value)}
                      placeholder="e.g. Naturally sourced, carefully selected, for a healthier tomorrow."
                      className="admin-textarea"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Feature Benefits */}
      {activeTab === 'features' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>
            4 Feature Pillars / Strip
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {(homeData.featureBenefits || []).map((feat, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Title</label>
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => {
                      const feats = [...homeData.featureBenefits];
                      feats[idx].title = e.target.value;
                      setHomeData({ ...homeData, featureBenefits: feats });
                    }}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Subtitle</label>
                  <input
                    type="text"
                    value={feat.subtitle}
                    onChange={(e) => {
                      const feats = [...homeData.featureBenefits];
                      feats[idx].subtitle = e.target.value;
                      setHomeData({ ...homeData, featureBenefits: feats });
                    }}
                    className="admin-input"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Best Sellers */}
      {activeTab === 'bestsellers' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Premium Collection / Bestsellers Header</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Eyebrow</label>
              <input
                type="text"
                value={homeData.bestsellerSection?.eyebrow || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    bestsellerSection: { ...homeData.bestsellerSection, eyebrow: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                value={homeData.bestsellerSection?.title || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    bestsellerSection: { ...homeData.bestsellerSection, title: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Subtitle</label>
            <input
              type="text"
              value={homeData.bestsellerSection?.subtitle || ''}
              onChange={(e) =>
                setHomeData({
                  ...homeData,
                  bestsellerSection: { ...homeData.bestsellerSection, subtitle: e.target.value }
                })
              }
              className="admin-input"
            />
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--admin-gold-base)', marginTop: '16px' }}>
            Tip: You can mark or unmark products as "Bestseller" directly in the Products CMS to change which 5 products appear in this section.
          </p>
        </div>
      )}

      {/* TAB 5: Categories */}
      {activeTab === 'categories' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>
            Curated Categories Showcase
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Eyebrow</label>
              <input
                type="text"
                value={homeData.shopByCategorySection?.eyebrow || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    shopByCategorySection: { ...homeData.shopByCategorySection, eyebrow: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Title</label>
              <input
                type="text"
                value={homeData.shopByCategorySection?.title || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    shopByCategorySection: { ...homeData.shopByCategorySection, title: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Subtitle</label>
            <input
              type="text"
              value={homeData.shopByCategorySection?.subtitle || ''}
              onChange={(e) =>
                setHomeData({
                  ...homeData,
                  shopByCategorySection: { ...homeData.shopByCategorySection, subtitle: e.target.value }
                })
              }
              className="admin-input"
            />
          </div>
        </div>
      )}

      {/* TAB 6: Story Preview */}
      {activeTab === 'story' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>
            Homepage "Our Story" Split Section
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Heading</label>
              <input
                type="text"
                value={homeData.storyPreviewSection?.heading || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    storyPreviewSection: { ...homeData.storyPreviewSection, heading: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Showcase Image URL</label>
              <input
                type="text"
                value={homeData.storyPreviewSection?.image || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    storyPreviewSection: { ...homeData.storyPreviewSection, image: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Paragraph 1</label>
            <textarea
              rows="3"
              value={homeData.storyPreviewSection?.paragraph1 || ''}
              onChange={(e) =>
                setHomeData({
                  ...homeData,
                  storyPreviewSection: { ...homeData.storyPreviewSection, paragraph1: e.target.value }
                })
              }
              className="admin-textarea"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Paragraph 2</label>
            <textarea
              rows="3"
              value={homeData.storyPreviewSection?.paragraph2 || ''}
              onChange={(e) =>
                setHomeData({
                  ...homeData,
                  storyPreviewSection: { ...homeData.storyPreviewSection, paragraph2: e.target.value }
                })
              }
              className="admin-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Badge Year</label>
              <input
                type="text"
                value={homeData.storyPreviewSection?.badgeYear || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    storyPreviewSection: { ...homeData.storyPreviewSection, badgeYear: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Badge Text</label>
              <input
                type="text"
                value={homeData.storyPreviewSection?.badgeText || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    storyPreviewSection: { ...homeData.storyPreviewSection, badgeText: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Luxury CTA */}
      {activeTab === 'cta' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>
            Luxury CTA Banner
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Eyebrow</label>
              <input
                type="text"
                value={homeData.luxuryCtaSection?.eyebrow || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    luxuryCtaSection: { ...homeData.luxuryCtaSection, eyebrow: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Heading</label>
              <input
                type="text"
                value={homeData.luxuryCtaSection?.heading || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    luxuryCtaSection: { ...homeData.luxuryCtaSection, heading: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Subheading / Description</label>
            <input
              type="text"
              value={homeData.luxuryCtaSection?.subheading || ''}
              onChange={(e) =>
                setHomeData({
                  ...homeData,
                  luxuryCtaSection: { ...homeData.luxuryCtaSection, subheading: e.target.value }
                })
              }
              className="admin-input"
            />
          </div>
        </div>
      )}

      {/* TAB 8: Newsletter */}
      {activeTab === 'newsletter' && (
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>
            Newsletter Strip
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Eyebrow</label>
              <input
                type="text"
                value={homeData.newsletterSection?.eyebrow || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    newsletterSection: { ...homeData.newsletterSection, eyebrow: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Title</label>
              <input
                type="text"
                value={homeData.newsletterSection?.title || ''}
                onChange={(e) =>
                  setHomeData({
                    ...homeData,
                    newsletterSection: { ...homeData.newsletterSection, title: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Description</label>
            <input
              type="text"
              value={homeData.newsletterSection?.description || ''}
              onChange={(e) =>
                setHomeData({
                  ...homeData,
                  newsletterSection: { ...homeData.newsletterSection, description: e.target.value }
                })
              }
              className="admin-input"
            />
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary admin-btn-lg"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          <span>{saving ? 'SAVING...' : 'SAVE ALL CHANGES'}</span>
        </button>
      </div>
    </div>
  );
}
