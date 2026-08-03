import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Pencil, Trash2, ImageOff, Save, X, ArrowLeft, UploadCloud, Check } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { projectService } from '../../services/projectService.js';
import { settingsService } from '../../services/contentService.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import '../../components/admin/admin.css';

const EMPTY_FORM = { title: '', description: '', content: '', link: '', image: '', featured: false, tags: '' };

function ProjectForm({ initialData, onSubmit, onCancel, isLoading, onError }) {
  const [form, setForm] = useState(
    initialData
      ? { ...initialData, tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || '') }
      : EMPTY_FORM
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(form.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: val }));
  };

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
        formData.append('path', 'projects');

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
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
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
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>{initialData ? 'Edit Project' : 'New Project'}</h2>
        <button className="btn btn-ghost btn-icon" onClick={onCancel}><X size={18} /></button>
      </div>

      <form id="project-form" onSubmit={handleSubmit}>

        {/* Title */}
        <div className="form-field">
          <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span>Project Title <span className="form-label-required">*</span></span>
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(form.title || '').length} / 100</span>
          </div>
          <input className="form-input" name="title" value={form.title} onChange={set('title')} required maxLength={100} placeholder="e.g. VAT Reconciliation Automation" />
        </div>

        {/* Image Upload */}
        <div className="form-field" style={{ marginBottom: 32 }}>
          <div className="form-label">Cover Image <span style={{ fontSize: 11, color: 'var(--text-disabled)', marginLeft: 8, fontWeight: 400 }}>(Recommended: 1200x800px, max 5MB)</span></div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 240, height: 160, borderRadius: 8, border: '1px dashed var(--border)',
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
              <p className="form-helper">Image will be uploaded to Supabase Storage when you save the project.</p>
            </div>
          </div>
        </div>

        <div className="form-field" style={{ marginBottom: 40 }}>
          <div className="form-label">Detailed Content (Rich Text)</div>
          <div style={{ background: 'var(--bg)', borderRadius: '8px' }}>
            <ReactQuill theme="snow" value={form.content || ''} onChange={handleQuillChange} modules={quillModules} />
          </div>
        </div>

        {/* Metadata Box */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Project Metadata</h3>

          <div className="form-field">
            <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span>Short Description <span className="form-label-required">*</span></span>
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(form.description || '').length} / 250</span>
            </div>
            <textarea className="form-textarea" rows={2} name="description" value={form.description} onChange={set('description')} required maxLength={250} placeholder="Brief description of the project..." />
          </div>

          <div className="form-row form-row-2">
            <div className="form-field">
              <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span>Link</span>
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(form.link || '').length} / 255</span>
              </div>
              <input className="form-input" name="link" value={form.link || ''} onChange={set('link')} maxLength={255} placeholder="https://github.com/..." />
            </div>

            <div className="form-field">
              <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span>Tags</span>
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(form.tags || '').length} / 100</span>
              </div>
              <input className="form-input" name="tags" value={form.tags} onChange={set('tags')} maxLength={100} placeholder="Python, Excel (comma-separated)" />
            </div>
          </div>

          <div className="form-field" style={{ marginBottom: 0 }}>
            <div onClick={() => setForm(p => ({ ...p, featured: !p.featured }))} className="form-toggle-row" style={{ cursor: 'pointer', margin: 0, padding: 0, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s' }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid', borderColor: form.featured ? 'var(--text-primary)' : 'var(--border)', background: form.featured ? 'var(--text-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                {form.featured && <Check size={14} color="var(--bg)" strokeWidth={3} />}
              </div>
              <div className="form-toggle-content" style={{ flex: 1 }}>
                <p className="form-toggle-label" style={{ fontSize: 14, fontWeight: 600, color: form.featured ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Featured project</p>
                <p className="form-toggle-desc" style={{ fontSize: 12, marginTop: 4 }}>Pin this project in the featured section on the homepage.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading || isUploading}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isLoading || isUploading}>
            {isLoading || isUploading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState({ projects_title: '', projects_subtitle: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [proj, set] = await Promise.all([
        projectService.getAll(),
        settingsService.get()
      ]);
      setProjects(proj);
      if (set) setSettings((prev) => ({ ...prev, ...set }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3500);
  };

  const openAdd = () => { setEditing(null); setIsFormOpen(true); };
  const openEdit = (p) => { setEditing(p); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditing(null); };
  const openDelete = (id) => { setDeletingId(id); setConfirmOpen(true); };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await settingsService.update({ projects_title: settings.projects_title, projects_subtitle: settings.projects_subtitle });
      showAlert('success', 'Projects content saved.');
    } catch (err) { showAlert('error', err.message); }
    finally { setSavingSettings(false); }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await projectService.update(editing.id, formData);
        showAlert('success', 'Project updated.');
      } else {
        await projectService.create(formData);
        showAlert('success', 'Project added.');
      }
      closeForm();
      fetchProjects();
    } catch (err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const projectToDelete = projects.find(p => p.id === deletingId);
      if (projectToDelete && projectToDelete.image) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: projectToDelete.image, bucket: 'images' }),
            credentials: 'include',
          });
        } catch (e) { console.error('Failed to delete image', e); }
      }

      await projectService.delete(deletingId);
      showAlert('success', 'Project deleted.');
      setConfirmOpen(false); setDeletingId(null);
      fetchProjects();
    } catch (err) { showAlert('error', err.message); }
  };

  if (isFormOpen) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <button className="btn btn-ghost" onClick={closeForm} style={{ paddingLeft: 0, gap: 8 }}>
            <ArrowLeft size={16} /> Back to Projects
          </button>
        </div>
        <ProjectForm
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
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Projects</h1>
          <p className="page-description">Manage your portfolio projects and case studies.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout">
        <div className="hero-left-col" style={{ gridColumn: '1 / -1' }}>

          {/* Settings Card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Title & Subtitle</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Main content for the Projects section on the homepage.</p>
            </div>
            <div style={{ padding: 20 }}>
              <form onSubmit={handleSettingsSubmit}>
                <div className="form-field">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Projects Title</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.projects_title || '').length} / 60</span>
                  </div>
                  <input className="form-input" value={settings.projects_title} onChange={(e) => setSettings({ ...settings, projects_title: e.target.value })} maxLength={60} placeholder="e.g. Selected work..." />
                </div>
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Projects Subtitle</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.projects_subtitle || '').length} / 250</span>
                  </div>
                  <textarea className="form-input form-textarea" rows={5} value={settings.projects_subtitle} onChange={(e) => setSettings({ ...settings, projects_subtitle: e.target.value })} maxLength={250} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                  <Save size={13} /> {savingSettings ? 'Saving...' : 'Save Title & Subtitle'}
                </button>
              </form>
            </div>
          </div>

          {/* Projects Grid */}
          <div style={{ padding: '16px 0 8px' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Project List</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{!loading && `${projects.length} project${projects.length !== 1 ? 's' : ''}`}</p>
          </div>

          {loading ? (
            <LoadingState message="Loading projects..." />
          ) : error ? (
            <div className="alert alert-error">Failed to load: {error}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>

              {/* Add Project Card */}
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
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'inherit' }}>Add New Project</h3>
                  <p style={{ fontSize: 13, color: 'inherit', opacity: 0.8 }}>Create a new case study or project entry.</p>
                </div>
              </div>

              {projects.map((project) => (
                <div key={project.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {project.image ? (
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '160px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-disabled)' }}>
                      <ImageOff size={32} />
                    </div>
                  )}

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{project.title}</h3>
                      {project.featured && (
                        <span className="badge badge-featured yes" style={{ padding: '2px 8px', fontSize: 10 }}>Featured</span>
                      )}
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: '20px' }}>
                      {project.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-badge">{tag}</span>
                      ))}
                      {project.tags?.length > 3 && (
                        <span className="tag-badge">+{project.tags.length - 3}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(project)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-icon" onClick={() => openDelete(project.id)} title="Delete">
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

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete project?"
        message="This will permanently remove the project and all its tags. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingId(null); }}
      />
    </div>
  );
}
