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
      if (homeRes.success) setHomeData(homeRes.data);
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

      {/* TAB 2: Hero Slider */}
      {activeTab === 'hero' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: '700' }}>
              Hero Slides ({(homeData.heroSlides || []).length})
            </h3>
            <button onClick={handleAddSlide} className="admin-btn admin-btn-primary admin-btn-sm">
              <Plus size={14} />
              <span>Add New Slide</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(homeData.heroSlides || []).map((slide, idx) => (
              <div key={idx} className="admin-card" style={{ borderLeft: '4px solid var(--admin-gold-base)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--admin-gold-base)' }}>Slide {idx + 1}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      <input
                        type="checkbox"
                        checked={slide.enabled}
                        onChange={(e) => handleSlideChange(idx, 'enabled', e.target.checked)}
                      />
                      <span>Active</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(idx)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                    >
                      <Trash2 size={13} />
                      <span>Remove Slide</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Eyebrow Badge</label>
                    <input
                      type="text"
                      value={slide.eyebrow}
                      onChange={(e) => handleSlideChange(idx, 'eyebrow', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <ImageUploadField
                    label="Slide Image"
                    value={slide.image}
                    onChange={(url) => handleSlideChange(idx, 'image', url)}
                    folder="hero"
                    section="hero"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Headline Line 1</label>
                    <input
                      type="text"
                      value={slide.line1}
                      onChange={(e) => handleSlideChange(idx, 'line1', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Headline Line 2</label>
                    <input
                      type="text"
                      value={slide.line2}
                      onChange={(e) => handleSlideChange(idx, 'line2', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Slide Description</label>
                  <textarea
                    rows="2"
                    value={slide.description}
                    onChange={(e) => handleSlideChange(idx, 'description', e.target.value)}
                    className="admin-textarea"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Button 1 Text</label>
                    <input
                      type="text"
                      value={slide.button1Text}
                      onChange={(e) => handleSlideChange(idx, 'button1Text', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Button 1 Link</label>
                    <input
                      type="text"
                      value={slide.button1Link}
                      onChange={(e) => handleSlideChange(idx, 'button1Link', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Button 2 Text</label>
                    <input
                      type="text"
                      value={slide.button2Text}
                      onChange={(e) => handleSlideChange(idx, 'button2Text', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Button 2 Link</label>
                    <input
                      type="text"
                      value={slide.button2Link}
                      onChange={(e) => handleSlideChange(idx, 'button2Link', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>
            ))}
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
