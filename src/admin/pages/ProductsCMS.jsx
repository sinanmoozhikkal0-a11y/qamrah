import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Sparkles,
  Upload
} from 'lucide-react';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import SaveToast from '../components/SaveToast';
import ImageUploadField from '../components/ImageUploadField';

export default function ProductsCMS() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Form state
  const initialForm = {
    name: '',
    slug: '',
    category: 'cashews',
    categoryName: 'Cashews',
    shortDescription: '',
    description: '',
    price: 499,
    mrp: 649,
    discount: 20,
    stock: 50,
    packSize: '250g',
    rating: 4.9,
    reviewCount: 100,
    badge: 'Bestseller',
    origin: '',
    ingredients: '',
    mainImage: '/images/pouch_cashew.jpg',
    backImage: '/images/pouch_cashew_back.jpg',
    status: 'active',
    featured: false,
    bestseller: false
  };

  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.products.getAll({ status: '' }),
        api.categories.getAll()
      ]);
      if (prodRes.success) setProducts(prodRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || 'cashews',
      categoryName: product.categoryName || 'Cashews',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price || 0,
      mrp: product.mrp || 0,
      discount: product.discount || 0,
      stock: product.stock !== undefined ? product.stock : 50,
      packSize: product.packSize || '250g',
      rating: product.rating || 4.9,
      reviewCount: product.reviewCount || 100,
      badge: product.badge || '',
      origin: product.origin || '',
      ingredients: product.ingredients || '',
      mainImage: product.mainImage || '',
      backImage: product.backImage || '',
      status: product.status || 'active',
      featured: !!product.featured,
      bestseller: !!product.bestseller
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await api.products.update(editingProduct._id, formData);
        if (res.success) {
          setToastMessage('Product updated successfully');
          setToastType('success');
          loadData();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.products.create(formData);
        if (res.success) {
          setToastMessage('Product added successfully');
          setToastType('success');
          loadData();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setToastMessage(err.message || 'Something went wrong');
      setToastType('error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.products.delete(deleteTarget._id);
      if (res.success) {
        setToastMessage('Product deleted successfully');
        setToastType('success');
        setDeleteTarget(null);
        loadData();
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to delete product');
      setToastType('error');
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.products.update(product._id, { status: newStatus });
      if (res.success) {
        setToastMessage(`Product marked as ${newStatus}`);
        setToastType('success');
        loadData();
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to update status');
      setToastType('error');
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <SaveToast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header controls */}
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
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product name or SKU..."
              className="admin-input"
              style={{ paddingLeft: '38px' }}
            />
            <Search
              size={18}
              color="#A3B8AC"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
            style={{ width: '180px' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Package size={20} color="#D8B66A" />
            <span>Product Catalog ({filteredProducts.length})</span>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price / MRP</th>
                <th>Stock</th>
                <th>Pack Size</th>
                <th>Badge</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={product.mainImage || '/images/pouch_cashew.jpg'}
                        alt={product.name}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          backgroundColor: '#07130D',
                          border: '1px solid var(--admin-border)'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ textTransform: 'capitalize', color: 'var(--admin-gold-base)', fontWeight: '600' }}>
                      {product.categoryName || product.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#FFFFFF' }}>₹{product.price}</div>
                    {product.mrp > product.price && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)', textDecoration: 'line-through' }}>
                        ₹{product.mrp}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: '700',
                        color: (product.stock <= 0 || product.inStock === false) ? '#E53E3E' : (product.stock <= 10 ? '#FC8181' : '#68D391')
                      }}
                    >
                      {(product.stock <= 0 || product.inStock === false) ? '0 (Out of Stock)' : `${product.stock} units`}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)' }}>{product.packSize || '250g'}</td>
                  <td>
                    {product.badge ? (
                      <span className="badge-gold" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {product.badge}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--admin-text-dim)', fontSize: '0.75rem' }}>-</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(product)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                      title="Click to toggle active status"
                    >
                      <span className={`status-badge ${product.status === 'active' ? 'active' : 'inactive'}`}>
                        {product.status || 'active'}
                      </span>
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        title="Edit product"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        title="Delete product"
                      >
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

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: '700' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. W-180 Jumbo Cashew"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Slug / URL Key</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="admin-input"
                    placeholder="Auto-generated from name"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.slug === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryName: selected ? selected.name : e.target.value
                      });
                    }}
                    className="admin-select"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Pack Size</label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. 250g"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Product Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="admin-input"
                    placeholder="Bestseller, Luxury Gift..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <ImageUploadField
                  label="Main Product Image"
                  value={formData.mainImage}
                  onChange={(url) => setFormData({ ...formData, mainImage: url })}
                  folder="products"
                  section="product"
                  required
                />
                <ImageUploadField
                  label="Back Image (Optional)"
                  value={formData.backImage}
                  onChange={(url) => setFormData({ ...formData, backImage: url })}
                  folder="products"
                  section="product"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="admin-input"
                  placeholder="One sentence luxury hook..."
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Full Product Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-textarea"
                  placeholder="Full narrative about provenance, taste profile, and health attributes..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. Al-Madinah Al-Munawwarah, Saudi Arabia"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Ingredients</label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="admin-input"
                    placeholder="100% Pure Whole Raw Cashew Kernels..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', margin: '16px 0 24px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Mark as Featured</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                  />
                  <span>Product is Active in Store</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-lg">
                  SAVE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
