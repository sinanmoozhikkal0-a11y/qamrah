import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import SaveToast from '../components/SaveToast';

export default function FaqsCMS() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const initialForm = {
    question: '',
    answer: '',
    category: 'General',
    order: 1,
    status: 'active'
  };
  const [formData, setFormData] = useState(initialForm);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.faqs.getAll();
      if (res.success) setFaqs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General',
      order: faq.order || 1,
      status: faq.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        const res = await api.faqs.update(editingFaq._id, formData);
        if (res.success) {
          setToastMessage('FAQ updated successfully');
          setToastType('success');
          loadFaqs();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.faqs.create(formData);
        if (res.success) {
          setToastMessage('FAQ added successfully');
          setToastType('success');
          loadFaqs();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setToastMessage(err.message || 'Error');
      setToastType('error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.faqs.delete(deleteTarget._id);
      if (res.success) {
        setToastMessage('FAQ deleted');
        setToastType('success');
        setDeleteTarget(null);
        loadFaqs();
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
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ question?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="admin-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            FAQs appear on the customer Contact &amp; Concierge page.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq._id}>
                  <td style={{ fontWeight: '600', color: '#FFFFFF', maxWidth: '400px' }}>{faq.question}</td>
                  <td style={{ color: 'var(--admin-gold-base)' }}>{faq.category}</td>
                  <td>{faq.order || 0}</td>
                  <td>
                    <span className={`status-badge ${faq.status === 'active' ? 'active' : 'inactive'}`}>
                      {faq.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button onClick={() => handleOpenEdit(faq)} className="admin-btn admin-btn-secondary admin-btn-sm">
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => setDeleteTarget(faq)} className="admin-btn admin-btn-danger admin-btn-sm">
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

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '20px' }}>
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-label">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Answer *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Order</label>
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
                  SAVE FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
