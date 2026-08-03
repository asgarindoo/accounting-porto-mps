import { useState, useEffect, useCallback, useRef } from 'react';
import { Save, UploadCloud, FileText, Trash2, ExternalLink } from 'lucide-react';
import { resumeService, settingsService } from '../../services/contentService.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import '../../components/admin/admin.css';

const UPLOAD_URL = `${import.meta.env.VITE_API_URL || ''}/api/upload`;

export function ResumeAdmin() {
  const [resume, setResume] = useState(null);
  const [settings, setSettings] = useState({ resume_title: '', resume_subtitle: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  // File card state
  const [selectedFile, setSelectedFile] = useState(null);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Settings card
  const [savingSettings, setSavingSettings] = useState(false);

  // Delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [rs, st] = await Promise.all([resumeService.getAll(), settingsService.get()]);
      const first = rs?.[0] || null;
      setResume(first);
      if (first) { setLabel(first.label || ''); setDescription(first.description || ''); }
      if (st) setSettings(prev => ({ ...prev, ...st }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Supabase helpers ──
  const uploadToSupabase = async (file, oldUrl) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'documents');
    formData.append('path', 'resume');
    if (oldUrl) formData.append('oldUrl', oldUrl);
    const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData, credentials: 'include' });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Upload failed');
    return data.data.url;
  };

  const deleteFromSupabase = async (url) => {
    await fetch(UPLOAD_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, bucket: 'documents' }),
      credentials: 'include',
    });
  };

  // ── Single Save handler for the file card ──
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedFile && !resume) {
      showAlert('error', 'Please select a PDF file to upload.');
      return;
    }
    setSaving(true);
    try {
      let fileUrl = resume?.file || '';

      // Upload new file if selected
      if (selectedFile) {
        fileUrl = await uploadToSupabase(selectedFile, resume?.file || null);
      }

      const payload = {
        label: label || 'Resume',
        description,
        file: fileUrl,
        sortOrder: resume?.sortOrder ?? 0,
      };

      let updated;
      if (resume) {
        updated = await resumeService.update(resume.id, payload);
      } else {
        updated = await resumeService.create(payload);
      }

      setResume(updated || { ...(resume || {}), ...payload });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      showAlert('success', 'Resume saved successfully!');
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!resume) return;
    try {
      if (resume.file) await deleteFromSupabase(resume.file);
      await resumeService.delete(resume.id);
      setResume(null); setLabel(''); setDescription('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      showAlert('success', 'Resume deleted.');
    } catch (err) { showAlert('error', err.message); }
    finally { setConfirmOpen(false); }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await settingsService.update({ resume_title: settings.resume_title, resume_subtitle: settings.resume_subtitle });
      showAlert('success', 'Section content saved.');
    } catch (err) { showAlert('error', err.message); }
    finally { setSavingSettings(false); }
  };

  if (loading) return <LoadingState message="Loading resume content..." />;
  if (error) return <div className="alert alert-error">Failed to load: {error}</div>;

  const fileUrl = resume?.file;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Resume</h1>
          <p className="page-description">Manage resume section content and downloadable PDF.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout">
        <div className="hero-left-col" style={{ gridColumn: '1 / -1' }}>

          {/* ── Title & Subtitle card ── */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Title &amp; Subtitle</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Main content for the Resume section on the homepage.</p>
            </div>
            <div style={{ padding: 20 }}>
              <form onSubmit={handleSettingsSubmit}>
                <div className="form-field">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Resume Title</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.resume_title || '').length} / 60</span>
                  </div>
                  <input className="form-input" value={settings.resume_title || ''} onChange={(e) => setSettings({ ...settings, resume_title: e.target.value })} maxLength={60} placeholder="e.g. Resume & CV..." />
                </div>
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Resume Subtitle</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.resume_subtitle || '').length} / 250</span>
                  </div>
                  <textarea className="form-input form-textarea" rows={3} value={settings.resume_subtitle || ''} onChange={(e) => setSettings({ ...settings, resume_subtitle: e.target.value })} maxLength={250} placeholder="Brief description for the resume section..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                  <Save size={13} /> {savingSettings ? 'Saving...' : 'Save Title & Subtitle'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Resume File card ── */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Resume File</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Upload a PDF — users can download it from your portfolio.</p>
              </div>
              {fileUrl && (
                <button className="btn btn-danger btn-icon" title="Delete resume" onClick={() => setConfirmOpen(true)}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <div style={{ padding: 20 }}>

              {/* Current file banner */}
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10,
                    marginBottom: 20, textDecoration: 'none', color: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <FileText size={22} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {label || 'Resume'}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fileUrl}
                    </p>
                  </div>
                  <ExternalLink size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                </a>
              )}

              {/* One unified form */}
              <form onSubmit={handleSave}>

                {/* PDF picker */}
                <div className="form-field">
                  <label className="form-label">{fileUrl ? 'Replace PDF File' : 'PDF File'} {!fileUrl && <span className="form-label-required">*</span>}</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.odt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf"
                    id="resume-pdf-input"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const allowedTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.oasis.opendocument.text',
                        'application/rtf',
                        'text/rtf',
                      ];
                      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|odt|rtf)$/i)) {
                        showAlert('error', 'Only document files are allowed (PDF, Word, ODT, RTF).');
                        e.target.value = '';
                        return;
                      }
                      setSelectedFile(file);
                    }}
                  />
                  <label
                    htmlFor="resume-pdf-input"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px',
                      border: `1px solid ${selectedFile ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 8, background: 'var(--bg)', cursor: 'pointer', fontSize: 13,
                      color: selectedFile ? 'var(--accent)' : 'var(--text-secondary)',
                      fontWeight: selectedFile ? 600 : 400,
                    }}
                  >
                    <UploadCloud size={14} />
                    {selectedFile ? selectedFile.name : (fileUrl ? 'Choose a new PDF to replace...' : 'Choose PDF file...')}
                  </label>
                  <p style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 5 }}>
                    Supported: PDF, Word (.doc/.docx), ODT, RTF — max 10 MB.
                    {fileUrl ? ' Selecting a new file will replace the current one in storage.' : ''}
                  </p>
                </div>

                {/* Label */}
                <div className="form-field">
                  <label className="form-label">Label</label>
                  <input className="form-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Resume – English" />
                </div>

                {/* Description */}
                <div className="form-field" style={{ marginBottom: 20 }}>
                  <label className="form-label">Description</label>
                  <input className="form-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Standard format CV" />
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={13} />
                  {saving ? (selectedFile ? 'Uploading...' : 'Saving...') : 'Save Resume'}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete resume file?"
        message="This will permanently delete the file from Supabase storage. Users will no longer be able to download it."
        onConfirm={handleDeleteResume}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
