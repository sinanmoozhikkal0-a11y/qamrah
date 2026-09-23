import React, { useState, useEffect } from 'react';
import { BookOpen, Save, Sparkles, Award } from 'lucide-react';
import { api } from '../../services/api';
import SaveToast from '../components/SaveToast';

export default function StoryCMS() {
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const loadStory = async () => {
    setLoading(true);
    try {
      const res = await api.story.get();
      if (res.success) setStoryData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStory();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await api.story.update(storyData);
      if (res.success) {
        setToastMessage('Our Story content saved successfully');
        setToastType('success');
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to save');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !storyData) {
    return <div style={{ padding: '40px', color: '#FFFFFF' }}>Loading Our Story CMS...</div>;
  }

  return (
    <div>
      <SaveToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <div className="admin-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>Our Story CMS Editor</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Edit the brand heritage, philosophy, and the 4 core pillars of excellence.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary admin-btn-lg">
          <Save size={16} />
          <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header Block */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Editorial Header</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Eyebrow</label>
              <input
                type="text"
                value={storyData.header?.eyebrow || ''}
                onChange={(e) => setStoryData({ ...storyData, header: { ...storyData.header, eyebrow: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Main Heading</label>
              <input
                type="text"
                value={storyData.header?.heading || ''}
                onChange={(e) => setStoryData({ ...storyData, header: { ...storyData.header, heading: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Quote / Subtitle</label>
            <input
              type="text"
              value={storyData.header?.quote || ''}
              onChange={(e) => setStoryData({ ...storyData, header: { ...storyData.header, quote: e.target.value } })}
              className="admin-input"
            />
          </div>
        </div>

        {/* Philosophy Block */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Our Philosophy</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Philosophy Heading</label>
              <input
                type="text"
                value={storyData.philosophy?.heading || ''}
                onChange={(e) => setStoryData({ ...storyData, philosophy: { ...storyData.philosophy, heading: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Showcase Image URL</label>
              <input
                type="text"
                value={storyData.philosophy?.image || ''}
                onChange={(e) => setStoryData({ ...storyData, philosophy: { ...storyData.philosophy, image: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Paragraph 1</label>
            <textarea
              rows="3"
              value={storyData.philosophy?.paragraph1 || ''}
              onChange={(e) => setStoryData({ ...storyData, philosophy: { ...storyData.philosophy, paragraph1: e.target.value } })}
              className="admin-textarea"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Paragraph 2</label>
            <textarea
              rows="3"
              value={storyData.philosophy?.paragraph2 || ''}
              onChange={(e) => setStoryData({ ...storyData, philosophy: { ...storyData.philosophy, paragraph2: e.target.value } })}
              className="admin-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Stat 1 Value</label>
              <input
                type="text"
                value={storyData.philosophy?.stat1Number || ''}
                onChange={(e) => setStoryData({ ...storyData, philosophy: { ...storyData.philosophy, stat1Number: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Stat 1 Label</label>
              <input
                type="text"
                value={storyData.philosophy?.stat1Label || ''}
                onChange={(e) => setStoryData({ ...storyData, philosophy: { ...storyData.philosophy, stat1Label: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Stat 2 Value</label>
              <input
                type="text"
                value={storyData.philosophy?.stat2Number || ''}
                onChange={(e) => setStoryData({ ...storyData, philosophy: { ...storyData.philosophy, stat2Number: e.target.value } })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Stat 2 Label</label>
              <input
                type="text"
                value={storyData.philosophy?.stat2Label || ''}
                onChange={(e) => setStoryData({ ...storyData, philosophy: { ...storyData.philosophy, stat2Label: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>
            The 4 Pillars of QAMRAH
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {(storyData.pillars || []).map((pillar, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Pillar {idx + 1} Title</label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const updated = [...storyData.pillars];
                      updated[idx].title = e.target.value;
                      setStoryData({ ...storyData, pillars: updated });
                    }}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Description</label>
                  <textarea
                    rows="3"
                    value={pillar.description}
                    onChange={(e) => {
                      const updated = [...storyData.pillars];
                      updated[idx].description = e.target.value;
                      setStoryData({ ...storyData, pillars: updated });
                    }}
                    className="admin-textarea"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary admin-btn-lg">
            SAVE STORY CONTENT
          </button>
        </div>
      </form>
    </div>
  );
}
