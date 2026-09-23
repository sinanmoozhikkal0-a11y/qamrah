import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import SaveToast from '../components/SaveToast';
import ImageUploadField from '../components/ImageUploadField';

export default function CategoriesCMS() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const initialForm = {
    name: '',
    slug: '',
    image: '/images/pouch_cashew.jpg',
    description: '',
    order: 1,
    status: 'active'
  };
  const [formData, setFormData] = useState(initialForm);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.categories.getAll();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      image: cat.image || '',
      description: cat.description || '',
      order: cat.order || 1,
      status: cat.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await api.categories.update(editingCategory._id, formData);
        if (res.success) {
          setToastMessage('Category updated successfully');
          setToastType('success');
          loadCategories();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.categories.create(formData);
        if (res.success) {
          setToastMessage('Category added successfully');
          setToastType('success');
          loadCategories();
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
      const res = await api.categories.delete(deleteTarget._id);
      if (res.success) {
        setToastMessage('Category deleted successfully');
        setToastType('success');
        setDeleteTarget(null);
        loadCategories();
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to delete category');
      setToastType('error');
    }
  };

  return (
    <div>
      <SaveToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="admin-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>Manage Categories</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Categories automatically organize the Shop and Homepage collections.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Display Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={cat.image || '/images/pouch_cashew.jpg'}
                        alt={cat.name}
                        style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--admin-border)' }}
                      />
                      <span style={{ fontWeight: '700', color: '#FFFFFF' }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--admin-gold-base)' }}>{cat.slug}</td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', maxWidth: '300px' }}>
                    {cat.description || '-'}
                  </td>
                  <td>{cat.order || 0}</td>
                  <td>
                    <span className={`status-badge ${cat.status === 'active' ? 'active' : 'inactive'}`}>
                      {cat.status || 'active'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => handleOpenEdit(cat)} className="admin-btn admin-btn-secondary admin-btn-sm">
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => setDeleteTarget(cat)} className="admin-btn admin-btn-danger admin-btn-sm">
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
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-label">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input"
                  placeholder="e.g. Cashews"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="admin-input"
                  placeholder="e.g. cashews"
                />
              </div>

              <ImageUploadField
                label="Category Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="categories"
                section="category"
              />

              <div className="admin-form-group">
                <label className="admin-label">Description / Subtitle</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-input"
                  placeholder="Colossal W-180 & Roasted Cashew Kernels"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="admin-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  SAVE CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
