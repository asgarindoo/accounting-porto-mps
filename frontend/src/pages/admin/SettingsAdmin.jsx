import { useState, useEffect, useCallback, useRef } from 'react';
import { Save, ImageOff } from 'lucide-react';
import { settingsService } from '../../services/contentService.js';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import '../../components/admin/admin.css';

export function SettingsAdmin() {
  const [settings, setSettings] = useState({
    author_name: '',
    site_title: '',
    site_description: '',
    seo_keywords: '',
    seo_robots: 'index, follow',
    seo_canonical: '',
    admin_title: '',
    site_favicon: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingType, setDeletingType] = useState(null);

  const faviconInputRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const st = await settingsService.get();
      if (st) setSettings((prev) => ({ ...prev, ...st }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showAlert = (type, message) => { setAlert({ type, message }); setTimeout(() => setAlert(null), 3500); };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const isFavicon = type === 'favicon';
    if (!isFavicon) return;

    const currentUrl = settings.site_favicon;
    const setUploading = setUploadingFavicon;
    const fieldName = 'site_favicon';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'images');
    formData.append('path', 'favicons');
    if (currentUrl) formData.append('oldUrl', currentUrl);

    try {
      setUploading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Upload failed');
      const newUrl = data.data.url;
      
      setSettings(prev => ({ ...prev, [fieldName]: newUrl }));
      await settingsService.update({ [fieldName]: newUrl });
      showAlert('success', `Favicon updated successfully.`);
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const requestRemoveImage = (type) => {
    setDeletingType(type);
    setConfirmOpen(true);
  };

  const handleRemoveImage = async () => {
    const type = deletingType;
    const isFavicon = type === 'favicon';
    if (!isFavicon) return;

    const currentUrl = settings.site_favicon;
    const setUploading = setUploadingFavicon;
    const fieldName = 'site_favicon';

    if (!currentUrl) return;

    try {
      setUploading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: currentUrl, bucket: 'images' }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success && res.status !== 404) {
        console.warn('Failed to delete from storage, but removing from DB anyway', data);
      }
      setSettings(prev => ({ ...prev, [fieldName]: '' }));
      await settingsService.update({ [fieldName]: '' });
      showAlert('success', `Favicon removed successfully.`);
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setUploading(false);
      setConfirmOpen(false);
      setDeletingType(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.update({
        author_name: settings.author_name,
        site_title: settings.site_title,
        site_description: settings.site_description,
        seo_keywords: settings.seo_keywords,
        seo_robots: settings.seo_robots,
        seo_canonical: settings.seo_canonical,
        admin_title: settings.admin_title
      });
      showAlert('success', 'Metadata saved successfully.');
    } catch (err) { showAlert('error', err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingState message="Loading settings..." />;
  if (error) return <div className="alert alert-error">Failed to load: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">System Settings</h1>
          <p className="page-description">Manage global site metadata and branding.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout mobile-reverse" style={{ marginBottom: 40, alignItems: 'start' }}>
        
        {/* Left Column: Form Details */}
        <div className="hero-left-col">
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Site Metadata</p>
              </div>
              <div style={{ padding: 20 }}>
                {/* Brand Identity Section */}
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Brand Identity</h3>
                
                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Author Name</label>
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{(settings.author_name || '').length}/50</span>
                  </div>
                  <input className="form-input" value={settings.author_name || ''} onChange={(e) => setSettings({ ...settings, author_name: e.target.value })} placeholder="e.g. Muhammad Panggih Saputra" maxLength={50} />
                  <p className="form-helper">Digunakan untuk Copyright Footer, inisial logo Admin, dan meta tag 'author'.</p>
                </div>

                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Site Title</label>
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{(settings.site_title || '').length}/60</span>
                  </div>
                  <input className="form-input" value={settings.site_title || ''} onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} placeholder="e.g. My Portfolio" maxLength={60} />
                  <p className="form-helper">Muncul di tab browser.</p>
                </div>
                
                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Admin Panel Title <span style={{ color: 'var(--text-disabled)', fontWeight: 400 }}>(Optional)</span></label>
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{(settings.admin_title || '').length}/30</span>
                  </div>
                  <input className="form-input" value={settings.admin_title || ''} onChange={(e) => setSettings({ ...settings, admin_title: e.target.value })} placeholder="e.g. MPS Admin" maxLength={30} />
                  <p className="form-helper">Muncul di pojok kiri atas dan judul tab halaman Admin.</p>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0 24px' }} />

                {/* SEO Configuration Section */}
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>SEO Configuration</h3>
                
                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Site Description (Meta Description)</label>
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{(settings.site_description || '').length}/160</span>
                  </div>
                  <textarea className="form-input form-textarea" rows={3} value={settings.site_description || ''} onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} placeholder="Brief description of the site for search engines..." maxLength={160} />
                  <p className="form-helper">Ringkasan website Anda. Muncul di hasil pencarian Google (di bawah judul).</p>
                </div>
                
                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>SEO Keywords <span style={{ color: 'var(--text-disabled)', fontWeight: 400 }}>(Optional)</span></label>
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{(settings.seo_keywords || '').length}/200</span>
                  </div>
                  <input className="form-input" value={settings.seo_keywords || ''} onChange={(e) => setSettings({ ...settings, seo_keywords: e.target.value })} placeholder="e.g. portfolio, accounting, data analysis" maxLength={200} />
                  <p className="form-helper">Kata kunci terkait Anda, dipisahkan koma. Membantu mesin pencari mengkategorikan situs Anda.</p>
                </div>
                
                <div className="form-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>SEO Robots <span style={{ color: 'var(--text-disabled)', fontWeight: 400 }}>(Optional)</span></label>
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{(settings.seo_robots || '').length}/50</span>
                  </div>
                  <input className="form-input" value={settings.seo_robots || 'index, follow'} onChange={(e) => setSettings({ ...settings, seo_robots: e.target.value })} placeholder="e.g. index, follow" maxLength={50} />
                  <p className="form-helper">Instruksi untuk mesin pencari. Gunakan "index, follow" agar situs di-index. Gunakan "noindex, nofollow" untuk menyembunyikannya.</p>
                </div>
                
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label">Canonical URL <span style={{ color: 'var(--text-disabled)', fontWeight: 400 }}>(Optional)</span></label>
                  <input className="form-input" value={settings.seo_canonical || ''} onChange={(e) => setSettings({ ...settings, seo_canonical: e.target.value })} placeholder="e.g. https://domainanda.com/" />
                  <p className="form-helper">Link utama website Anda. Mencegah isu duplikat konten jika situs bisa diakses dari beberapa domain.</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={13} /> {saving ? 'Saving...' : 'Save Metadata'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Logos */}
        <div className="hero-right-col" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Site Favicon */}
          <div className="portrait-preview-box">
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>Browser Favicon</p>
            {settings.site_favicon ? (
              <img src={settings.site_favicon} alt="Favicon preview" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 8, background: 'var(--surface-hover)', margin: '0 auto 24px', display: 'block' }} />
            ) : (
              <div className="portrait-placeholder-large" style={{ width: 64, height: 64, minHeight: 'unset', margin: '0 auto 24px' }}>
                <ImageOff size={24} />
              </div>
            )}
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24, textAlign: 'center' }}>
              Used in the browser tab. Recommended size: 32x32 or 64x64.
            </p>
            <input type="file" accept="image/png, image/x-icon, image/jpeg, image/svg+xml" onChange={(e) => handleFileUpload(e, 'favicon')} ref={faviconInputRef} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button className="btn btn-secondary" disabled={uploadingFavicon} onClick={() => faviconInputRef.current?.click()} style={{ flex: 1 }}>
                {uploadingFavicon ? 'Uploading...' : (settings.site_favicon ? 'Change' : 'Upload Favicon')}
              </button>
              {settings.site_favicon && (
                <button type="button" className="btn btn-secondary" style={{ color: 'var(--destructive)' }} disabled={uploadingFavicon} onClick={() => requestRemoveImage('favicon')}>
                  Remove
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
      <ConfirmDialog 
        isOpen={confirmOpen} 
        title="Remove Favicon?" 
        message="Are you sure you want to remove the Favicon?" 
        onConfirm={handleRemoveImage} 
        onCancel={() => { setConfirmOpen(false); setDeletingType(null); }} 
      />
    </div>
  );
}
