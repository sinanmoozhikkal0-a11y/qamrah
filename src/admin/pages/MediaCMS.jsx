import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Loader2,
  Folder,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import SaveToast from '../components/SaveToast';

export default function MediaCMS() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadFolder, setUploadFolder] = useState('media');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await api.media.getAll();
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        setMediaList(list);
      }
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(`Uploading "${file.name}" to Cloudinary...`);

    try {
      const res = await api.uploads.uploadImage(file, { folder: uploadFolder });
      if (res.success) {
        setToastMessage('Image uploaded to Cloudinary successfully');
        setToastType('success');
        loadMedia();
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      setToastMessage(err.message || 'Upload failed');
      setToastType('error');
    } finally {
      setUploading(false);
      setUploadProgress('');
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setToastMessage('Cloudinary secure URL copied to clipboard');
    setToastType('success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.media.delete(deleteTarget._id);
      if (res.success) {
        setToastMessage('Image deleted from Cloudinary & database');
        setToastType('success');
        setDeleteTarget(null);
        loadMedia();
      } else {
        throw new Error(res.message || 'Failed to delete');
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to delete');
      setToastType('error');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div>
      <SaveToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Media File"
        message={`Are you sure you want to permanently delete "${deleteTarget?.filename}"? This will remove the asset from Cloudinary and your database.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Image Preview Modal */}
      {previewItem && (
        <div
          className="admin-modal-overlay"
          onClick={() => setPreviewItem(null)}
          style={{ zIndex: 1000 }}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', width: '90%', padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: '600' }}>
                {previewItem.filename}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                width: '100%',
                maxHeight: '420px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#040B07',
                border: '1px solid var(--admin-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <img
                src={previewItem.url || previewItem.secure_url}
                alt={previewItem.filename}
                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '16px' }}>
              <div><strong>Storage:</strong> {previewItem.storageType === 'cloudinary' ? 'Cloudinary CDN' : 'Local Storage'}</div>
              {previewItem.public_id && <div><strong>Public ID:</strong> <code>{previewItem.public_id}</code></div>}
              {previewItem.size > 0 && <div><strong>File Size:</strong> {formatFileSize(previewItem.size)}</div>}
              <div><strong>URL:</strong> <span style={{ wordBreak: 'break-all', color: 'var(--admin-gold-base)' }}>{previewItem.url || previewItem.secure_url}</span></div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => handleCopyUrl(previewItem.url || previewItem.secure_url, previewItem._id)}
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                <Copy size={14} />
                <span>Copy URL</span>
              </button>
              <a
                href={previewItem.url || previewItem.secure_url}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                <ExternalLink size={14} />
                <span>Open in Tab</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload Banner */}
      <div
        className="admin-card"
        style={{
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: '700' }}>Cloudinary Media Library</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Upload product photos, pack visuals, and hero banners directly to Cloudinary. Click any image to copy its secure CDN URL for CMS use.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Target Folder Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Folder size={14} color="#C5A059" />
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="admin-select"
              style={{ padding: '6px 12px', fontSize: '0.8rem', minWidth: '130px' }}
            >
              <option value="media">qamrah/media</option>
              <option value="products">qamrah/products</option>
              <option value="categories">qamrah/categories</option>
              <option value="packs">qamrah/packs</option>
              <option value="hero">qamrah/hero</option>
            </select>
          </div>

          <label
            className="admin-btn admin-btn-primary admin-btn-lg"
            style={{
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {uploading ? (
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Upload size={18} />
            )}
            <span>{uploading ? 'UPLOADING TO CLOUDINARY...' : 'UPLOAD NEW IMAGE'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {uploadProgress && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(197, 160, 89, 0.1)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            color: 'var(--admin-gold-base)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* Media Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '20px'
        }}
      >
        {mediaList.map((item) => {
          const isCloud = item.storageType === 'cloudinary' || (item.url && item.url.includes('cloudinary.com'));

          return (
            <div
              key={item._id}
              className="admin-card"
              style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease, transform 0.2s ease'
              }}
            >
              {/* Thumbnail Container with click-to-preview */}
              <div
                onClick={() => setPreviewItem(item)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#040B07',
                  border: '1px solid var(--admin-border)',
                  marginBottom: '10px',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                title="Click to view full preview"
              >
                <img
                  src={item.url || item.secure_url}
                  alt={item.filename}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />

                {/* Storage badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '0.65rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isCloud ? 'rgba(197, 160, 89, 0.85)' : 'rgba(163, 184, 172, 0.4)',
                    color: '#040B07',
                    fontWeight: '700'
                  }}
                >
                  {isCloud ? 'Cloudinary' : 'Local'}
                </div>

                {/* Hover overlay hint */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(4, 11, 7, 0.4)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <Eye size={20} color="#FFFFFF" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#FFFFFF',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={item.filename}
                >
                  {item.filename}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                  <span>{item.folder ? item.folder.replace('qamrah/', '') : 'media'}</span>
                  <span>{formatFileSize(item.size)}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.url || item.secure_url, item._id)}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  {copiedId === item._id ? <Check size={13} color="#68D391" /> : <Copy size={13} />}
                  <span>{copiedId === item._id ? 'Copied' : 'Copy URL'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  title="Delete Image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {mediaList.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--admin-text-muted)' }}>
          <ImageIcon size={48} color="#A3B8AC" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>No media uploaded to Cloudinary yet. Use the upload button above to add images.</p>
        </div>
      )}
    </div>
  );
}
