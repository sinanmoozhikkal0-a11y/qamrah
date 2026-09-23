import React, { useState, useRef } from 'react';
import { Upload, X, Check, Copy, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'products',
  placeholder = '/images/... or Cloudinary URL',
  required = false,
  helpText = '',
  section = 'general'
}) {
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setUploading(true);

    try {
      const res = await api.uploads.uploadImage(file, { folder, section });
      if (res.success && res.data) {
        const secureUrl = res.data.secure_url || res.data.url;
        onChange(secureUrl);
      } else {
        throw new Error(res.message || 'Image upload failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChange('');
    setErrorMsg('');
  };

  const isCloudinary = value && (value.includes('cloudinary.com') || value.includes('res.cloudinary'));

  return (
    <div className="admin-form-group" style={{ marginBottom: '20px' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="admin-label" style={{ margin: 0 }}>
            {label} {required && <span style={{ color: '#E53E3E' }}>*</span>}
          </label>
          {isCloudinary && (
            <span
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(197, 160, 89, 0.12)',
                color: 'var(--admin-gold-base, #C5A059)',
                border: '1px solid rgba(197, 160, 89, 0.3)'
              }}
            >
              Cloudinary CDN
            </span>
          )}
        </div>
      )}

      {/* Main Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'rgba(8, 19, 11, 0.4)',
          border: '1px solid var(--admin-border, rgba(163, 184, 172, 0.15))',
          borderRadius: '10px',
          padding: '12px'
        }}
      >
        {/* Preview and Controls Row */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Thumbnail preview */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '8px',
              backgroundColor: '#040B07',
              border: '1px solid rgba(163, 184, 172, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative'
            }}
          >
            {value ? (
              <img
                src={value}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <ImageIcon size={24} color="#A3B8AC" style={{ opacity: 0.4 }} />
            )}
            {uploading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(4, 11, 7, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Loader2 size={20} color="#C5A059" className="admin-spin" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
                id={`file-upload-${label?.replace(/\s+/g, '-').toLowerCase() || Math.random()}`}
              />

              <label
                htmlFor={`file-upload-${label?.replace(/\s+/g, '-').toLowerCase() || Math.random()}`}
                className="admin-btn admin-btn-primary admin-btn-sm"
                style={{
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>UPLOADING TO CLOUDINARY...</span>
                  </>
                ) : (
                  <>
                    <Upload size={13} />
                    <span>{value ? 'REPLACE IMAGE' : 'UPLOAD TO CLOUDINARY'}</span>
                  </>
                )}
              </label>

              {value && (
                <>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    title="Copy Image URL"
                  >
                    {copied ? <Check size={12} color="#68D391" /> : <Copy size={12} />}
                    <span>{copied ? 'COPIED' : 'COPY URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    title="Clear Image"
                  >
                    <X size={12} />
                    <span>REMOVE</span>
                  </button>
                </>
              )}
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted, #A3B8AC)' }}>
              Supports JPG, PNG, WebP, GIF, SVG up to 10MB • Auto-optimized on Cloudinary
            </div>
          </div>
        </div>

        {/* Direct URL Input Row */}
        <div>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required && !value}
            className="admin-input"
            style={{ fontSize: '0.8rem', padding: '8px 12px' }}
          />
        </div>

        {errorMsg && (
          <div style={{ color: '#FC8181', fontSize: '0.75rem', marginTop: '2px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {helpText && (
          <div style={{ color: 'var(--admin-text-muted, #A3B8AC)', fontSize: '0.72rem' }}>
            {helpText}
          </div>
        )}
      </div>
    </div>
  );
}
