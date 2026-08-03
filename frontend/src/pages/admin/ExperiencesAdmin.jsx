import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, Briefcase, Building2, Calendar, ChevronDown, Check, Save } from 'lucide-react';
import { experienceService } from '../../services/experienceService.js';
import { Drawer } from '../../components/admin/Drawer.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import { EmptyState } from '../../components/admin/EmptyState.jsx';
import { settingsService } from '../../services/contentService.js';
import '../../components/admin/admin.css';

/* ─── Type color map ─── */
const TYPE_COLORS = {
  Internship: { bg: 'rgba(99,102,241,0.12)', color: '#818CF8', border: 'rgba(99,102,241,0.3)' },
  Fulltime: { bg: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: 'rgba(34,197,94,0.3)' },
  Organization: { bg: 'rgba(234,179,8,0.12)', color: '#FDE047', border: 'rgba(234,179,8,0.3)' },
  Freelance: { bg: 'rgba(249,115,22,0.12)', color: '#FB923C', border: 'rgba(249,115,22,0.3)' },
};
const DEFAULT_COLOR = { bg: 'rgba(113,113,122,0.12)', color: '#A1A1AA', border: 'rgba(113,113,122,0.3)' };

/* ─── Custom Dropdown ─── */
function CustomSelect({ value, onChange, options, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', height: 34, padding: '0 12px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', color: selected ? 'var(--text-primary)' : 'var(--text-disabled)',
          fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          transition: 'border-color 0.15s',
          ...(open ? { borderColor: '#52525B', boxShadow: '0 0 0 3px rgba(250,250,250,0.06)' } : {}),
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {selected?.icon && <selected.icon size={14} style={{ color: 'var(--text-secondary)' }} />}
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} style={{ color: 'var(--text-secondary)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 99,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}>
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              style={{
                width: '100%', padding: '9px 12px',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                color: value === o.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: value === o.value ? 'var(--surface-hover)' : 'transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (value !== o.value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (value !== o.value) e.currentTarget.style.background = 'transparent'; }}
            >
              {o.icon && <o.icon size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />}
              <span style={{ flex: 1 }}>{o.label}</span>
              {value === o.value && <Check size={13} style={{ color: 'var(--accent)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Type Badge ─── */
function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || DEFAULT_COLOR;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
      borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {type || '—'}
    </span>
  );
}

/* ─── Experience Card ─── */
function ExperienceCard({ item, onEdit, onDelete }) {
  return (
    <div style={{
      position: 'relative', display: 'flex', gap: 16,
      padding: '20px 0', borderBottom: '1px solid var(--border)',
    }}>
      {/* Timeline dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 36 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--surface)', border: '2px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}>
          <Briefcase size={15} />
        </div>
        <div style={{ flex: 1, width: 1, background: 'var(--border)', marginTop: 8 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
          <TypeBadge type={item.type} />
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
            <Calendar size={11} /> {item.period}
          </span>
        </div>

        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>
          {item.role}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
          <Building2 size={12} style={{ flexShrink: 0 }} /> {item.company}
        </div>

        {item.description && (
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            margin: 0,
          }}>
            {item.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
        <button className="btn btn-ghost btn-icon" onClick={() => onEdit(item)} title="Edit"><Pencil size={13} /></button>
        <button className="btn btn-danger btn-icon" onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={13} /></button>
      </div>
    </div>
  );
}

/* ─── Experience Form ─── */
function ExperienceForm({ initialData, onSubmit }) {
  const DEFAULTS = { type: '', role: '', company: '', period: '', description: '', align: 'left' };
  const [form, setForm] = useState(initialData ? { ...DEFAULTS, ...initialData } : { ...DEFAULTS });
  const set = (field) => (e) => setForm(p => ({ ...p, [field]: typeof e === 'string' ? e : e.target.value }));
  const setVal = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const TYPE_OPTIONS = [
    { value: 'Internship', label: 'Internship', icon: Briefcase },
    { value: 'Fulltime', label: 'Fulltime', icon: Briefcase },
    { value: 'Organization', label: 'Organization', icon: Building2 },
    { value: 'Freelance', label: 'Freelance', icon: Building2 },
  ];
  const ALIGN_OPTIONS = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ];

  return (
    <form id="exp-form" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="form-row form-row-2">
        <div className="form-field">
          <label className="form-label">Type <span className="form-label-required">*</span></label>
          <CustomSelect
            value={form.type}
            onChange={(val) => setVal('type', val)}
            options={TYPE_OPTIONS}
            placeholder="Select type"
          />
          {/* Hidden required input trick */}
          <input type="text" required value={form.type} onChange={() => { }} style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} tabIndex={-1} />
        </div>
        <div className="form-field">
          <label className="form-label">Timeline Align</label>
          <CustomSelect
            value={form.align}
            onChange={(val) => setVal('align', val)}
            options={ALIGN_OPTIONS}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Role <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.role} onChange={set('role')} required placeholder="e.g. Tax Intern" maxLength={60} />
        <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right', marginTop: 3 }}>{form.role.length}/60</div>
      </div>

      <div className="form-row form-row-2">
        <div className="form-field">
          <label className="form-label">Company <span className="form-label-required">*</span></label>
          <input className="form-input" value={form.company} onChange={set('company')} required placeholder="e.g. PT Borwita Citra Prima" maxLength={60} />
          <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right', marginTop: 3 }}>{form.company.length}/60</div>
        </div>
        <div className="form-field">
          <label className="form-label">Period <span className="form-label-required">*</span></label>
          <input className="form-input" value={form.period} onChange={set('period')} required placeholder="e.g. Dec 2025 — Present" maxLength={30} />
          <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right', marginTop: 3 }}>{form.period.length}/30</div>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Description <span className="form-label-required">*</span></label>
        <textarea className="form-textarea custom-scrollbar" value={form.description} onChange={set('description')} required placeholder="Describe your role and responsibilities..." maxLength={400} style={{ minHeight: 120 }} />
        <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right', marginTop: 3 }}>{form.description.length}/400</div>
      </div>
    </form>
  );
}

/* ─── Main Page ─── */
export function ExperiencesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const [settings, setSettings] = useState({ experiences_title: '', experiences_subtitle: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [expData, set] = await Promise.all([
        experienceService.getAll(),
        settingsService.get()
      ]);
      setItems(expData);
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
      await settingsService.update({ experiences_title: settings.experiences_title, experiences_subtitle: settings.experiences_subtitle });
      showAlert('success', 'Experience content saved.');
    } catch (err) { showAlert('error', err.message); }
    finally { setSavingSettings(false); }
  };

  const handleSubmitForm = async (data) => {
    setSubmitting(true);
    try {
      if (editing) { await experienceService.update(editing.id, data); showAlert('success', 'Experience updated.'); }
      else { await experienceService.create(data); showAlert('success', 'Experience added.'); }
      setDrawerOpen(false); fetchItems();
    } catch (err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await experienceService.delete(deletingId);
      showAlert('success', 'Experience deleted.');
      setConfirmOpen(false); setDeletingId(null); fetchItems();
    } catch (err) { showAlert('error', err.message); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Experience</h1>
          <p className="page-description">Manage your experience timeline and details.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout">
        <div className="hero-left-col" style={{ gridColumn: '1 / -1' }}>

          {/* Settings Card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Title & Subtitle</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Main content for the Experience section on the homepage.</p>
            </div>
            <div style={{ padding: 20 }}>
              <form onSubmit={handleSettingsSubmit}>
                <div className="form-field">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Experience Title</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.experiences_title || '').length} / 60</span>
                  </div>
                  <input className="form-input" value={settings.experiences_title || ''} onChange={(e) => setSettings({ ...settings, experiences_title: e.target.value })} maxLength={60} placeholder="e.g. Professional Experience..." />
                </div>
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Experience Subtitle</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.experiences_subtitle || '').length} / 250</span>
                  </div>
                  <textarea className="form-input form-textarea" rows={3} value={settings.experiences_subtitle || ''} onChange={(e) => setSettings({ ...settings, experiences_subtitle: e.target.value })} maxLength={250} placeholder="Brief description for the experience section..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                  <Save size={13} /> {savingSettings ? 'Saving...' : 'Save Title & Subtitle'}
                </button>
              </form>
            </div>
          </div>

          <div style={{ padding: '16px 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Experience List</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{!loading && `${items.length} entr${items.length !== 1 ? 'ies' : 'y'}`}</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => { setEditing(null); setDrawerOpen(true); }}>
              <Plus size={14} /> Add Experience
            </button>
          </div>

          {loading ? (
            <LoadingState message="Loading experiences..." />
          ) : error ? (
            <div className="alert alert-error">Failed to load: {error}</div>
          ) : items.length === 0 ? (
            <EmptyState title="No experiences yet" message="Add your first work experience." action={{ label: 'Add Experience', onClick: () => { setEditing(null); setDrawerOpen(true); } }} />
          ) : (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 20px' }}>
              {items.map((item) => (
                <ExperienceCard
                  key={item.id}
                  item={item}
                  onEdit={(item) => { setEditing(item); setDrawerOpen(true); }}
                  onDelete={(id) => { setDeletingId(id); setConfirmOpen(true); }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Experience' : 'New Experience'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</button>
            <button className="btn btn-primary" onClick={() => document.getElementById('exp-form')?.requestSubmit()} disabled={submitting}>
              {submitting ? 'Saving...' : (editing ? 'Save Changes' : 'Add Experience')}
            </button>
          </>
        }
      >
        {drawerOpen && <ExperienceForm key={editing?.id ?? 'new'} initialData={editing} onSubmit={handleSubmitForm} />}
      </Drawer>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete experience?"
        message="This will permanently remove this experience entry."
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingId(null); }}
      />
    </div>
  );
}
