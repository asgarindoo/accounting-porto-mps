import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Save, GripVertical, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { bioService, softskillService, settingsService, educationService } from '../../services/contentService.js';
import { Drawer } from '../../components/admin/Drawer.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import '../../components/admin/admin.css';

/* ─── Sortable Item (Education) ─── */
function SortableItem({ item, onEdit, onDelete, renderContent }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className={`draggable-item ${isDragging ? 'dragging' : ''}`}>
      <div className="drag-handle" {...attributes} {...listeners}>
        <GripVertical size={20} />
      </div>
      <div className="draggable-item-content">
        {renderContent(item)}
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button type="button" className="btn btn-ghost btn-icon" onClick={() => onEdit(item)} title="Edit"><Pencil size={13} /></button>
        <button type="button" className="btn btn-danger btn-icon" onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={13} /></button>
      </div>
    </div>
  );
}

/* ─── Draggable List Component ─── */
function DraggableList({ items, onReorder, onSaveOrder, onEdit, onDelete, renderContent }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
      setTimeout(() => onSaveOrder(newItems), 0);
    }
  };

  if (items.length === 0) return <div className="form-helper" style={{ padding: '20px 0', textAlign: 'center' }}>No items yet. Click Add to create one.</div>;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="draggable-list">
          {items.map((item) => (
            <SortableItem key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} renderContent={renderContent} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/* ─── Education Form Component ─── */
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
      </div>
    </form>
  );
}

export function AboutAdmin() {
  const [bios, setBios] = useState([]);
  const [softskills, setSoftskills] = useState([]);
  const [educations, setEducations] = useState([]);
  const [settings, setSettings] = useState({ about_title: '' });
  
  // States for forms
  const [bioText, setBioText] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeDrawer, setActiveDrawer] = useState(null);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activeDeleteType, setActiveDeleteType] = useState(null);
  const [alert, setAlert] = useState(null);
  const [savingMain, setSavingMain] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const [bi, ss, ed, st] = await Promise.all([
        bioService.getAll(), 
        softskillService.getAll(), 
        educationService.getAll(),
        settingsService.get()
      ]);
      setBios(bi); 
      setSoftskills(ss);
      setEducations(ed);
      if (st) setSettings((prev) => ({ ...prev, ...st }));
      
      // Initialize bio text
      setBioText(bi.map(b => b.text).join('\n\n'));
    } catch (err) { setError(err.message); }
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showAlert = (type, message) => { setAlert({ type, message }); setTimeout(() => setAlert(null), 3500); };
  const serviceFor = (type) => ({ education: educationService, softskill: softskillService }[type]);

  const handleMainSubmit = async (e) => {
    e.preventDefault();
    setSavingMain(true);
    try {
      // Save Title
      await settingsService.update({ about_title: settings.about_title });
      
      // Save Bio
      const newParagraphs = bioText.split(/\n+/).map(t => t.trim()).filter(t => t);
      
      // We will delete all existing bios and recreate them to simplify updating.
      await Promise.all(bios.map(b => bioService.delete(b.id)));
      await Promise.all(newParagraphs.map((p, i) => bioService.create({ text: p, sortOrder: i })));
      
      showAlert('success', 'Title & Biography saved.');
      fetchData(true);
    } catch (err) { showAlert('error', err.message); }
    finally { setSavingMain(false); }
  };
  
  const handleAddSoftSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim() || softskills.length >= 10) return;
    setSubmitting(true);
    try {
      await softskillService.create({ name: newSkill.trim(), sortOrder: softskills.length });
      setNewSkill('');
      fetchData(true);
    } catch(err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleEducationSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await educationService.update(editing.id, data);
      } else {
        const sortOrder = educations.length > 0 ? Math.max(...educations.map(i => i.sortOrder || 0)) + 1 : 0;
        await educationService.create({ ...data, sortOrder });
      }
      showAlert('success', 'Education saved.');
      setActiveDrawer(null); fetchData(true);
    } catch (err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await serviceFor(activeDeleteType).delete(deletingId);
      showAlert('success', 'Deleted.');
      setConfirmOpen(false); setDeletingId(null); setActiveDeleteType(null); fetchData(true);
    } catch (err) { showAlert('error', err.message); }
  };

  const openDelete = (type, id) => { setActiveDeleteType(type); setDeletingId(id); setConfirmOpen(true); };

  const handleSaveOrder = async (type, itemsList) => {
    const svc = serviceFor(type);
    try {
      await Promise.all(itemsList.map((item, idx) => {
        if (item.sortOrder !== idx) {
          return svc.update(item.id, { sortOrder: idx });
        }
        return Promise.resolve();
      }));
    } catch (err) {
      showAlert('error', 'Failed to save order: ' + err.message);
    }
  };

  if (loading) return <LoadingState message="Loading about content..." />;
  if (error) return <div className="alert alert-error">Failed to load: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">About & Education</h1>
          <p className="page-description">Manage biography, soft skills, and educational background.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout">
        {/* LEFT COLUMN: Section Content & Soft Skills */}
        <div className="hero-left-col">
          
          {/* Main Content Form */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Title & Biography</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Main content for the About section.</p>
            </div>
            <div style={{ padding: 20 }}>
              <form onSubmit={handleMainSubmit}>
                <div className="form-field">
                  <label className="form-label">About Title</label>
                  <input className="form-input" value={settings.about_title} onChange={(e) => setSettings({ ...settings, about_title: e.target.value })} placeholder="e.g. A precise mind for numbers..." maxLength={60} />
                  <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right', marginTop: 4 }}>
                    {(settings.about_title || '').length}/60
                  </div>
                </div>
                
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <label className="form-label">Biography</label>
                  <textarea className="form-textarea custom-scrollbar" style={{ minHeight: 180 }} value={bioText} onChange={(e) => setBioText(e.target.value)} placeholder="Write your biography here. Press Enter to create new paragraphs." maxLength={1500} />
                  <div style={{ fontSize: 11, color: 'var(--text-disabled)', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span>Press Enter for new paragraphs</span>
                    <span>{(bioText || '').length}/1500</span>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={savingMain}>
                  <Save size={13} /> {savingMain ? 'Saving...' : 'Save Title & Bio'}
                </button>
              </form>
            </div>
          </div>

          {/* Soft Skills Inline Form */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Soft Skills</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Inline tags (Max 10)</p>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: softskills.length > 0 ? 16 : 0 }}>
                {softskills.map(s => (
                  <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12, color: 'var(--text-primary)' }}>
                    {s.name}
                    <button type="button" onClick={() => openDelete('softskill', s.id)} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-disabled)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {softskills.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-disabled)' }}>No soft skills added yet.</span>}
              </div>
              
              {softskills.length < 10 && (
                <form onSubmit={handleAddSoftSkill} style={{ display: 'flex', gap: 8 }}>
                  <input className="form-input" style={{ flex: 1 }} value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="e.g. Leadership" maxLength={30} required />
                  <button type="submit" className="btn btn-secondary" disabled={submitting || !newSkill.trim()}>
                    <Plus size={13} /> Add
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Education Draggable */}
        <div className="hero-right-col">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Education</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Drag to reorder (Max 4)</p>
              </div>
              {educations.length < 4 && (
                <button className="btn btn-secondary" onClick={() => { setEditing(null); setActiveDrawer('education'); }} title="Add Education"><Plus size={14} /> Add</button>
              )}
            </div>
            <div style={{ padding: 16, background: 'var(--bg)' }}>
              <DraggableList
                items={educations}
                onReorder={setEducations}
                onSaveOrder={(newItems) => handleSaveOrder('education', newItems)}
                onEdit={(item) => { setEditing(item); setActiveDrawer('education'); }}
                onDelete={(id) => openDelete('education', id)}
                renderContent={(item) => (
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 14 }}>{item.degree}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{item.institution} &middot; {item.period}</div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Education Drawer */}
      <Drawer isOpen={activeDrawer === 'education'} onClose={() => setActiveDrawer(null)} title={editing ? 'Edit Education' : 'New Education'}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setActiveDrawer(null)} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={() => document.getElementById('edu-form')?.requestSubmit()} disabled={submitting}>
            {submitting ? 'Saving...' : (editing ? 'Save Changes' : 'Add Education')}
          </button>
        </>}
      >
        {activeDrawer === 'education' && <EducationForm key={editing?.id ?? 'new'} initialData={editing} onSubmit={handleEducationSubmit} />}
      </Drawer>

      <ConfirmDialog isOpen={confirmOpen} title="Delete item?" message="This will permanently remove this entry." onConfirm={handleDelete} onCancel={() => { setConfirmOpen(false); setDeletingId(null); setActiveDeleteType(null); }} />
    </div>
  );
}
