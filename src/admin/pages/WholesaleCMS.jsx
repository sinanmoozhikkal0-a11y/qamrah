import React, { useState, useEffect } from 'react';
import { Building2, Save, Mail, Phone, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import SaveToast from '../components/SaveToast';

export default function WholesaleCMS() {
  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'content'
  const [wholesaleData, setWholesaleData] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pageRes, enqRes] = await Promise.all([
        api.wholesale.get(),
        api.wholesale.getEnquiries()
      ]);
      if (pageRes.success) setWholesaleData(pageRes.data);
      if (enqRes.success) setEnquiries(enqRes.data || []);
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
      const res = await api.wholesale.update(wholesaleData);
      if (res.success) {
        setToastMessage('Wholesale page content saved');
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
      const res = await api.wholesale.updateEnquiryStatus(id, status);
      if (res.success) {
        setToastMessage(`Enquiry status updated to ${status}`);
        setToastType('success');
        loadAll();
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to update');
      setToastType('error');
    }
  };

  const handleDeleteEnquiry = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.wholesale.deleteEnquiry(deleteTarget._id);
      if (res.success) {
        setToastMessage('Enquiry deleted');
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
        title="Delete Enquiry"
        message={`Are you sure you want to delete enquiry from "${deleteTarget?.businessName}"?`}
        onConfirm={handleDeleteEnquiry}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="admin-tabs" style={{ marginBottom: '20px' }}>
        <button
          className={`admin-tab ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}
        >
          B2B Wholesale Enquiries ({enquiries.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Wholesale Page CMS Content
        </button>
      </div>

      {activeTab === 'enquiries' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Corporate &amp; Bulk Enquiries</h3>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Business / Contact</th>
                  <th>Contact Info</th>
                  <th>Product Interest</th>
                  <th>Est. Volume</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length > 0 ? (
                  enquiries.map((enq) => {
                    const statusClass = enq.status.toLowerCase();
                    return (
                      <tr key={enq._id}>
                        <td>
                          <div style={{ fontWeight: '700', color: '#FFFFFF' }}>{enq.businessName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                            Attn: {enq.contactPerson}
                          </div>
                        </td>
                        <td>
                          <div style={{ color: '#FFFFFF', fontSize: '0.85rem' }}>{enq.email}</div>
                          <div style={{ color: 'var(--admin-gold-base)', fontSize: '0.8rem' }}>{enq.phone}</div>
                        </td>
                        <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                          {enq.productInterest || 'All Products'}
                        </td>
                        <td style={{ fontWeight: '600', color: '#FFFFFF' }}>{enq.orderVolume || '-'}</td>
                        <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                          {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          <select
                            value={enq.status}
                            onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                            className="admin-select"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', width: '120px' }}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setDeleteTarget(enq)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--admin-text-muted)' }}>
                      No wholesale enquiries submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'content' && wholesaleData && (
        <form onSubmit={handleSaveContent} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Header Section</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Eyebrow</label>
                <input
                  type="text"
                  value={wholesaleData.header?.eyebrow || ''}
                  onChange={(e) => setWholesaleData({ ...wholesaleData, header: { ...wholesaleData.header, eyebrow: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Heading</label>
                <input
                  type="text"
                  value={wholesaleData.header?.heading || ''}
                  onChange={(e) => setWholesaleData({ ...wholesaleData, header: { ...wholesaleData.header, heading: e.target.value } })}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Description</label>
              <textarea
                rows="2"
                value={wholesaleData.header?.description || ''}
                onChange={(e) => setWholesaleData({ ...wholesaleData, header: { ...wholesaleData.header, description: e.target.value } })}
                className="admin-textarea"
              />
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Corporate Hamper Feature Box</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  value={wholesaleData.corporateBanner?.title || ''}
                  onChange={(e) => setWholesaleData({ ...wholesaleData, corporateBanner: { ...wholesaleData.corporateBanner, title: e.target.value } })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Image URL</label>
                <input
                  type="text"
                  value={wholesaleData.corporateBanner?.image || ''}
                  onChange={(e) => setWholesaleData({ ...wholesaleData, corporateBanner: { ...wholesaleData.corporateBanner, image: e.target.value } })}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Description</label>
              <textarea
                rows="2"
                value={wholesaleData.corporateBanner?.description || ''}
                onChange={(e) => setWholesaleData({ ...wholesaleData, corporateBanner: { ...wholesaleData.corporateBanner, description: e.target.value } })}
                className="admin-textarea"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary admin-btn-lg">
              SAVE WHOLESALE CONTENT
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
