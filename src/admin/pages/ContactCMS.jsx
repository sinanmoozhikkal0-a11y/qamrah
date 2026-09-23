import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Save, Trash2, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import SaveToast from '../components/SaveToast';

export default function ContactCMS() {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'content'
  const [contactData, setContactData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pageRes, msgRes] = await Promise.all([
        api.contact.get(),
        api.contact.getMessages()
      ]);
      if (pageRes.success) setContactData(pageRes.data);
      if (msgRes.success) setMessages(msgRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveContent = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await api.contact.update(contactData);
      if (res.success) {
        setToastMessage('Contact page details saved');
        setToastType('success');
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to save');
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.contact.updateMessageStatus(id, status);
      if (res.success) {
        setToastMessage(`Message marked as ${status}`);
        setToastType('success');
        loadAll();
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to update');
      setToastType('error');
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.contact.deleteMessage(deleteTarget._id);
      if (res.success) {
        setToastMessage('Message deleted');
        setToastType('success');
        setDeleteTarget(null);
        loadAll();
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to delete');
      setToastType('error');
    }
  };

  return (
    <div>
      <SaveToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Message"
        message={`Are you sure you want to delete message from "${deleteTarget?.name}"?`}
        onConfirm={handleDeleteMessage}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="admin-tabs" style={{ marginBottom: '20px' }}>
        <button
          className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Customer Messages Inbox ({messages.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Contact Page Details &amp; Concierge Hours
        </button>
      </div>

      {activeTab === 'messages' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Customer Enquiries</h3>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Contact Info</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <tr key={msg._id}>
                      <td style={{ fontWeight: '700', color: '#FFFFFF' }}>{msg.name}</td>
                      <td>
                        <div style={{ color: '#FFFFFF', fontSize: '0.85rem' }}>{msg.email}</div>
                        {msg.phone && (
                          <div style={{ color: 'var(--admin-gold-base)', fontSize: '0.8rem' }}>{msg.phone}</div>
                        )}
                      </td>
                      <td style={{ color: 'var(--admin-gold-base)', fontWeight: '600' }}>{msg.subject}</td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', maxWidth: '300px' }}>
                        {msg.message}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                        {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <select
                          value={msg.status}
                          onChange={(e) => handleUpdateStatus(msg._id, e.target.value)}
                          className="admin-select"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', width: '110px' }}
                        >
                          <option value="New">New</option>
                          <option value="Read">Read</option>
                          <option value="Replied">Replied</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setDeleteTarget(msg)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--admin-text-muted)' }}>
                      No contact messages received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'content' && contactData && (
        <form onSubmit={handleSaveContent} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Header</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Eyebrow</label>
                <input
                  type="text"
                  value={contactData.header?.eyebrow || ''}
                  onChange={(e) => setContactData({ ...contactData, header: { ...contactData.header, eyebrow: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Heading</label>
                <input
                  type="text"
                  value={contactData.header?.heading || ''}
                  onChange={(e) => setContactData({ ...contactData, header: { ...contactData.header, heading: e.target.value } })}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Description</label>
              <input
                type="text"
                value={contactData.header?.description || ''}
                onChange={(e) => setContactData({ ...contactData, header: { ...contactData.header, description: e.target.value } })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Concierge Contact Touchpoints</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Email Concierge</label>
                <input
                  type="email"
                  value={contactData.email || ''}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Phone Numbers</label>
                <input
                  type="text"
                  value={contactData.phone || ''}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">WhatsApp Number</label>
                <input
                  type="text"
                  value={contactData.whatsapp || ''}
                  onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Concierge Hours</label>
                <input
                  type="text"
                  value={contactData.workingHours || ''}
                  onChange={(e) => setContactData({ ...contactData, workingHours: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Headquarters &amp; Flagship Address</label>
              <textarea
                rows="2"
                value={contactData.address || ''}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                className="admin-textarea"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary admin-btn-lg">
              SAVE CONTACT DETAILS
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
