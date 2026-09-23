import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Truck, MessageCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import SaveToast from '../components/SaveToast';

export default function SettingsCMS() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.settings.get();
      if (res.success) setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await api.settings.update(settings);
      if (res.success) {
        setToastMessage('Store settings updated successfully');
        setToastType('success');
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to update settings');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div style={{ padding: '40px', color: '#FFFFFF' }}>Loading Settings...</div>;
  }

  return (
    <div>
      <SaveToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <div className="admin-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>Global Store &amp; Shipping Settings</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Configure store identity, shipping rates, and notification parameters.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary admin-btn-lg">
          <Save size={16} />
          <span>{saving ? 'SAVING...' : 'SAVE SETTINGS'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Identity */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Store Identity</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Store Brand Name</label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Store Tagline</label>
              <input
                type="text"
                value={settings.storeTagline || ''}
                onChange={(e) => setSettings({ ...settings, storeTagline: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Store Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Store Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <Truck size={20} color="#D8B66A" />
              <span>Shipping Rates &amp; Free Shipping Rule</span>
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.shippingCharge}
                onChange={(e) => setSettings({ ...settings, shippingCharge: Number(e.target.value) })}
                className="admin-input"
                placeholder="49"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Free Shipping Above (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="admin-input"
                placeholder="999"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Currency Symbol</label>
              <input
                type="text"
                value={settings.currencySymbol || '₹'}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Notification Settings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <MessageCircle size={20} color="#68D391" />
              <span>WhatsApp Admin Order Notification</span>
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Target Admin WhatsApp Number *</label>
              <input
                type="text"
                value={settings.whatsappNumber || '+916235820223'}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="admin-input"
                placeholder="+916235820223"
              />
            </div>

            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFFFFF', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.whatsappNotificationEnabled}
                  onChange={(e) => setSettings({ ...settings, whatsappNotificationEnabled: e.target.checked })}
                />
                <span style={{ fontWeight: '600' }}>Enable Instant WhatsApp Order Notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Social Media Profiles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Instagram Link</label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Facebook Link</label>
              <input
                type="text"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">YouTube Link</label>
              <input
                type="text"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                  })
                }
                className="admin-input"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary admin-btn-lg">
            SAVE ALL SETTINGS
          </button>
        </div>
      </form>
    </div>
  );
}
