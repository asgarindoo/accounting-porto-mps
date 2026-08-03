import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Pencil, Trash2, ImageOff, ArrowLeft, X, Save, UploadCloud } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { achievementService } from '../../services/achievementService.js';
import { settingsService } from '../../services/contentService.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import { EmptyState } from '../../components/admin/EmptyState.jsx';
import '../../components/admin/admin.css';

function AchievementForm({ initialData, onSubmit, onCancel, isLoading, onError }) {
  const [form, setForm] = useState({
    icon: initialData?.icon || 'Award',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    link: initialData?.link || '',
    image: initialData?.image || '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(form.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleQuillChange = useCallback((value) => {
    setForm((p) => ({ ...p, content: value }));
  }, []);

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'blockquote', 'code-block'],
      ['clean']
    ]
  }), []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm(p => ({ ...p, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = form.image;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('bucket', 'images');
        formData.append('path', 'achievements');

        if (initialData && initialData.image) {
          formData.append('oldUrl', initialData.image);
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Image upload failed');
        finalImageUrl = data.data.url;
      } else if (initialData && form.image === '' && initialData.image) {
        // user removed the image without replacing it
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: initialData.image, bucket: 'images' }),
            credentials: 'include',
          });
        } catch (e) { console.error('Failed to delete old image', e); }
      }

      onSubmit({
        ...form,
        image: finalImageUrl,
      });
    } catch (err) {
      if (onError) onError('error', 'Error uploading image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>{initialData ? 'Edit Achievement' : 'New Achievement'}</h2>
        <button className="btn btn-ghost btn-icon" onClick={onCancel}><X size={18} /></button>
      </div>

      <form id="ach-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">Title <span className="form-label-required">*</span></label>
          <input className="form-input" value={form.title} onChange={set('title')} required placeholder="e.g. 3rd Place Sustainable Business Pitch" />
        </div>

        <div className="form-field">
          <label className="form-label">Organization & Year <span className="form-label-required">*</span></label>
          <input className="form-input" value={form.subtitle} onChange={set('subtitle')} required placeholder="e.g. Google • 2024" />
          <p className="form-helper">This appears right below the title with an Award icon.</p>
        </div>

        {/* Image Upload */}
        <div className="form-field" style={{ marginBottom: 32 }}>
          <div className="form-label">Preview Image <span style={{ fontSize: 11, color: 'var(--text-disabled)', marginLeft: 8, fontWeight: 400 }}>(Recommended: 1200x900px, max 5MB)</span></div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 240, height: 180, borderRadius: 8, border: '1px dashed var(--border)',
                background: 'var(--bg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative'
              }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={removeImage} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div style={{ color: 'var(--text-disabled)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <ImageOff size={32} />
                  <span style={{ fontSize: 12 }}>No image selected</span>
                </div>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ width: 'fit-content' }}>
                <UploadCloud size={14} /> {imagePreview ? 'Change Image' : 'Select Image'}
              </button>
              <p className="form-helper">This image appears when visitors hover over this achievement on the landing page.</p>
            </div>
          </div>
        </div>

        <div className="form-field" style={{ marginBottom: '40px' }}>
          <label className="form-label">Detailed Content (Rich Text)</label>
          <div style={{ background: 'var(--bg)', borderRadius: '8px' }}>
            <ReactQuill theme="snow" value={form.content || ''} onChange={handleQuillChange} modules={quillModules} />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Description <span className="form-label-required">*</span></label>
          <textarea className="form-textarea" rows={3} value={form.description} onChange={set('description')} required placeholder="Brief description of the achievement (appears as a short excerpt)..." />
        </div>

        <div className="form-field">
          <label className="form-label">Link</label>
          <input className="form-input" value={form.link || ''} onChange={set('link')} placeholder="https://..." />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 32 }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading || isUploading}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isLoading || isUploading}>{isLoading || isUploading ? 'Saving...' : 'Save Achievement'}</button>
        </div>
      </form>
    </div>
  );
}

export function AchievementsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const [settings, setSettings] = useState({ achievements_title: '', achievements_subtitle: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [achData, set] = await Promise.all([
        achievementService.getAll(),
        settingsService.get()
      ]);
      setItems(achData);
      if (set) setSettings((prev) => ({ ...prev, ...set }));
    }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const showAlert = (type, message) => { setAlert({ type, message }); setTimeout(() => setAlert(null), 3500); };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await settingsService.update({ achievements_title: settings.achievements_title, achievements_subtitle: settings.achievements_subtitle });
      showAlert('success', 'Achievements content saved.');
    } catch (err) { showAlert('error', err.message); }
    finally { setSavingSettings(false); }
  };

  const openAdd = () => { setEditing(null); setIsFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditing(null); };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) { await achievementService.update(editing.id, data); showAlert('success', 'Achievement updated.'); }
      else { await achievementService.create(data); showAlert('success', 'Achievement added.'); }
      closeForm(); fetchItems();
    } catch (err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      const itemToDelete = items.find(i => i.id === deletingId);
      if (itemToDelete && itemToDelete.image) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: itemToDelete.image, bucket: 'images' }),
            credentials: 'include',
          });
        } catch (e) { console.error('Failed to delete image', e); }
      }

      await achievementService.delete(deletingId);
      showAlert('success', 'Achievement deleted.');
      setConfirmOpen(false);
      setDeletingId(null);
      fetchItems();
    }
    catch (err) { showAlert('error', err.message); }
  };

  if (isFormOpen) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <button className="btn btn-ghost" onClick={closeForm} style={{ paddingLeft: 0, gap: 8 }}>
            <ArrowLeft size={16} /> Back to Achievements
          </button>
        </div>
        <AchievementForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isLoading={submitting}
          onError={showAlert}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Achievements</h1>
          <p className="page-description">Manage your awards and achievements.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout">
        <div className="hero-left-col" style={{ gridColumn: '1 / -1' }}>

          {/* Settings Card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Title & Subtitle</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Main content for the Achievements section on the homepage.</p>
            </div>
            <div style={{ padding: 20 }}>
              <form onSubmit={handleSettingsSubmit}>
                <div className="form-field">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Achievements Title</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.achievements_title || '').length} / 60</span>
                  </div>
                  <input className="form-input" value={settings.achievements_title || ''} onChange={(e) => setSettings({ ...settings, achievements_title: e.target.value })} maxLength={60} placeholder="e.g. Achievements & Awards..." />
                </div>
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Achievements Subtitle</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.achievements_subtitle || '').length} / 250</span>
                  </div>
                  <textarea className="form-input form-textarea" rows={3} value={settings.achievements_subtitle || ''} onChange={(e) => setSettings({ ...settings, achievements_subtitle: e.target.value })} maxLength={250} placeholder="Brief description for the achievements section..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                  <Save size={13} /> {savingSettings ? 'Saving...' : 'Save Title & Subtitle'}
                </button>
              </form>
            </div>
          </div>

          {/* List Header */}
          <div style={{ padding: '16px 0 8px' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Achievement List</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{!loading && `${items.length} entr${items.length !== 1 ? 'ies' : 'y'}`}</p>
          </div>

          {loading ? <LoadingState message="Loading achievements..." /> : error ? (
            <div className="alert alert-error">Failed to load: {error}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>

              {/* Add Achievement Card */}
              <div
                onClick={openAdd}
                style={{
                  background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '340px', cursor: 'pointer', color: 'var(--text-secondary)',
                  transition: 'all 0.2s', padding: 24, textAlign: 'center', gap: 12
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'inherit' }}>Add New Achievement</h3>
                  <p style={{ fontSize: 13, color: 'inherit', opacity: 0.8 }}>Create a new award or achievement entry.</p>
                </div>
              </div>

              {items.map((item) => (
                <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {item.image ? (
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '160px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-disabled)' }}>
                      <ImageOff size={32} />
                    </div>
                  )}

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>{item.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{item.subtitle}</p>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>

                    <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(item)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-icon" onClick={() => { setDeletingId(item.id); setConfirmOpen(true); }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog isOpen={confirmOpen} title="Delete achievement?" message="This will permanently remove this achievement." onConfirm={handleDelete} onCancel={() => { setConfirmOpen(false); setDeletingId(null); }} />
    </div>
  );
}

