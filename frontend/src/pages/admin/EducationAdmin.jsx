import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { educationService } from '../../services/educationService.js';
import { Drawer } from '../../components/admin/Drawer.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import { EmptyState } from '../../components/admin/EmptyState.jsx';
import '../../components/admin/admin.css';

function EducationForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({
    degree: initialData?.degree || '',
    institution: initialData?.institution || '',
    period: initialData?.period || '',
    detail: initialData?.detail || '',
  });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <form id="edu-form" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="form-field">
        <label className="form-label">Degree <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.degree} onChange={set('degree')} required placeholder="e.g. Bachelor of Accounting" />
      </div>
      <div className="form-field">
        <label className="form-label">Institution <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.institution} onChange={set('institution')} required placeholder="e.g. Universitas Negeri Surabaya" />
      </div>
      <div className="form-field">
        <label className="form-label">Period <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.period} onChange={set('period')} required placeholder="e.g. Sep 2022 — 2026" />
      </div>
      <div className="form-field">
        <label className="form-label">Detail</label>
        <input className="form-input" value={form.detail} onChange={set('detail')} placeholder="e.g. GPA 3.77 / 4.00" />
        <p className="form-helper">Optional — additional detail like GPA or major.</p>
      </div>
    </form>
  );
}

export function EducationAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchItems = useCallback(async () => {
    try { setLoading(true); setError(null); setItems(await educationService.getAll()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const showAlert = (type, message) => { setAlert({ type, message }); setTimeout(() => setAlert(null), 3500); };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) { await educationService.update(editing.id, data); showAlert('success', 'Education updated.'); }
      else { await educationService.create(data); showAlert('success', 'Education added.'); }
      setDrawerOpen(false); fetchItems();
    } catch (err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try { await educationService.delete(deletingId); showAlert('success', 'Education deleted.'); setConfirmOpen(false); setDeletingId(null); fetchItems(); }
    catch (err) { showAlert('error', err.message); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Education</h1>
          <p className="page-description">{!loading && `${items.length} entr${items.length !== 1 ? 'ies' : 'y'}`}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => { setEditing(null); setDrawerOpen(true); }}>
            <Plus size={14} /> Add Education
          </button>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      {loading ? <LoadingState message="Loading education..." /> : error ? (
        <div className="alert alert-error">Failed to load: {error}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No education yet" message="Add your first education entry." action={{ label: 'Add Education', onClick: () => { setEditing(null); setDrawerOpen(true); } }} />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Degree</th>
                <th>Institution</th>
                <th>Period</th>
                <th>Detail</th>
                <th className="th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td data-label="Degree" style={{ fontWeight: 500 }}>{item.degree}</td>
                  <td data-label="Institution" style={{ color: 'var(--text-secondary)' }}>{item.institution}</td>
                  <td data-label="Period" style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{item.period}</td>
                  <td data-label="Detail" style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{item.detail || '—'}</td>
                  <td data-label=" " className="th-actions">
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-icon" onClick={() => { setEditing(item); setDrawerOpen(true); }} title="Edit"><Pencil size={13} /></button>
                      <button className="btn btn-danger btn-icon" onClick={() => { setDeletingId(item.id); setConfirmOpen(true); }} title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? 'Edit Education' : 'New Education'}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={() => document.getElementById('edu-form')?.requestSubmit()} disabled={submitting}>
            {submitting ? 'Saving...' : (editing ? 'Save Changes' : 'Add Education')}
          </button>
        </>}
      >
        {drawerOpen && <EducationForm key={editing?.id ?? 'new'} initialData={editing} onSubmit={handleSubmit} />}
      </Drawer>

      <ConfirmDialog isOpen={confirmOpen} title="Delete education?" message="This will permanently remove this education entry." onConfirm={handleDelete} onCancel={() => { setConfirmOpen(false); setDeletingId(null); }} />
    </div>
  );
}
