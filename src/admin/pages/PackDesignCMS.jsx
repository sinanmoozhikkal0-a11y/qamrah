import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import SaveToast from '../components/SaveToast';
import ImageUploadField from '../components/ImageUploadField';

export default function PackDesignCMS() {
  const [packDesigns, setPackDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const initialForm = {
    name: '',
    packType: 'Standup Pouch',
    packSize: 'Standard',
    packImage: '/images/pouch_cashew.jpg',
    frontImage: '/images/pouch_cashew.jpg',
    backImage: '/images/pouch_cashew_back.jpg',
    description: '',
    priceAdjustment: 0,
    status: 'active',
    order: 1
  };
  const [formData, setFormData] = useState(initialForm);

  const loadPackDesigns = async () => {
    setLoading(true);
    try {
      const res = await api.packDesigns.getAll();
      if (res.success) {
        setPackDesigns(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackDesigns();
  }, []);

  const handleOpenAdd = () => {
    setEditingPack(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pack) => {
    setEditingPack(pack);
    setFormData({
      name: pack.name || '',
      packType: pack.packType || 'Standup Pouch',
      packSize: pack.packSize || 'Standard',
      packImage: pack.packImage || '',
      frontImage: pack.frontImage || '',
      backImage: pack.backImage || '',
      description: pack.description || '',
      priceAdjustment: pack.priceAdjustment || 0,
      status: pack.status || 'active',
      order: pack.order || 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPack) {
        const res = await api.packDesigns.update(editingPack._id, formData);
        if (res.success) {
          setToastMessage('Pack design updated successfully');
          setToastType('success');
          loadPackDesigns();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.packDesigns.create(formData);
        if (res.success) {
          setToastMessage('Pack design created successfully');
          setToastType('success');
          loadPackDesigns();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setToastMessage(err.message || 'Something went wrong');
      setToastType('error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.packDesigns.delete(deleteTarget._id);
      if (res.success) {
        setToastMessage('Pack design deleted');
        setToastType('success');
        setDeleteTarget(null);
        loadPackDesigns();
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
        title="Delete Pack Design"
        message={`Are you sure you want to delete pack design "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="admin-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>Pack Design Options</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Customers can choose these packaging options when ordering products. Price adjustments are automatically added.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add Pack Design</span>
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pack Design</th>
                <th>Type</th>
                <th>Size</th>
                <th>Price Adjustment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packDesigns.map((pack) => (
                <tr key={pack._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={pack.packImage || '/images/pouch_cashew.jpg'}
                        alt={pack.name}
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', color: '#FFFFFF' }}>{pack.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {pack.description || 'Standard luxury packing'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--admin-gold-base)', fontWeight: '600' }}>{pack.packType}</td>
                  <td>{pack.packSize}</td>
                  <td>
                    <span style={{ fontWeight: '700', color: pack.priceAdjustment > 0 ? 'var(--admin-gold-base)' : '#68D391' }}>
                      {pack.priceAdjustment > 0 ? `+₹${pack.priceAdjustment}` : 'Included (₹0)'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${pack.status === 'active' ? 'active' : 'inactive'}`}>
                      {pack.status === 'active' ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => handleOpenEdit(pack)} className="admin-btn admin-btn-secondary admin-btn-sm">
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => setDeleteTarget(pack)} className="admin-btn admin-btn-danger admin-btn-sm">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '20px' }}>
              {editingPack ? 'Edit Pack Design' : 'Add Pack Design'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-label">Pack Design Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input"
                  placeholder="e.g. Premium Gold Pack, Royal Gift Box"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Pack Type</label>
                  <input
                    type="text"
                    value={formData.packType}
                    onChange={(e) => setFormData({ ...formData, packType: e.target.value })}
                    className="admin-input"
                    placeholder="Pouch, Tin, Wooden Box..."
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Pack Size / Edition</label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="admin-input"
                    placeholder="Standard, Luxury, Grand"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Pack Image"
                value={formData.packImage}
                onChange={(url) => setFormData({ ...formData, packImage: url, frontImage: url })}
                folder="packs"
                section="pack"
              />

              <div className="admin-form-group">
                <label className="admin-label">Price Adjustment (₹)</label>
                <input
                  type="number"
                  value={formData.priceAdjustment}
                  onChange={(e) => setFormData({ ...formData, priceAdjustment: Number(e.target.value) })}
                  className="admin-input"
                  placeholder="0 for standard, 150 for premium, 350 for gift box"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-textarea"
                  placeholder="Tell the customer what makes this packaging special..."
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Availability</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="admin-select"
                >
                  <option value="active">Available</option>
                  <option value="inactive">Unavailable</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  SAVE PACK DESIGN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
