import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, Info, GripVertical,
  CheckCircle, Award, Briefcase, Code, Star, Heart, Zap, Coffee, Globe, Users, TrendingUp, Lightbulb, Monitor, Smartphone, PenTool,
  Database, Server, Terminal, Cpu, Layers, Shield, Activity, Cloud, Settings, Compass, PieChart, BarChart, Box, Camera, Edit, FileCode, FileText, Image, Search, Wifi, Layout, GitBranch, Command, Key, Lock, Book, Link, MapPin, Mail, Calendar, Clock,
  Calculator, Receipt, Banknote, Wallet, Coins, CreditCard, Landmark, Building, FileSpreadsheet, LineChart, Percent, Scale, ClipboardList, Folder, HardDrive, Network, BookOpen, ScrollText, Save
} from 'lucide-react';
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
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { skillService } from '../../services/skillService.js';
import { Drawer } from '../../components/admin/Drawer.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import { EmptyState } from '../../components/admin/EmptyState.jsx';
import { settingsService } from '../../services/contentService.js';
import '../../components/admin/admin.css';

/* ─── Icon List ─── */
const SKILL_ICONS = [
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'Award', icon: Award },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Code', icon: Code },
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Zap', icon: Zap },
  { name: 'Coffee', icon: Coffee },
  { name: 'Globe', icon: Globe },
  { name: 'Users', icon: Users },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Monitor', icon: Monitor },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'PenTool', icon: PenTool },
  { name: 'Database', icon: Database },
  { name: 'Server', icon: Server },
  { name: 'Terminal', icon: Terminal },
  { name: 'Cpu', icon: Cpu },
  { name: 'Layers', icon: Layers },
  { name: 'Shield', icon: Shield },
  { name: 'Activity', icon: Activity },
  { name: 'Cloud', icon: Cloud },
  { name: 'Settings', icon: Settings },
  { name: 'Compass', icon: Compass },
  { name: 'PieChart', icon: PieChart },
  { name: 'BarChart', icon: BarChart },
  { name: 'Box', icon: Box },
  { name: 'Camera', icon: Camera },
  { name: 'Edit', icon: Edit },
  { name: 'FileCode', icon: FileCode },
  { name: 'FileText', icon: FileText },
  { name: 'Image', icon: Image },
  { name: 'Search', icon: Search },
  { name: 'Wifi', icon: Wifi },
  { name: 'Layout', icon: Layout },
  { name: 'GitBranch', icon: GitBranch },
  { name: 'Command', icon: Command },
  { name: 'Key', icon: Key },
  { name: 'Lock', icon: Lock },
  { name: 'Book', icon: Book },
  { name: 'Link', icon: Link },
  { name: 'MapPin', icon: MapPin },
  { name: 'Mail', icon: Mail },
  { name: 'Calendar', icon: Calendar },
  { name: 'Clock', icon: Clock },
  { name: 'Calculator', icon: Calculator },
  { name: 'Receipt', icon: Receipt },
  { name: 'Banknote', icon: Banknote },
  { name: 'Wallet', icon: Wallet },
  { name: 'Coins', icon: Coins },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Landmark', icon: Landmark },
  { name: 'Building', icon: Building },
  { name: 'FileSpreadsheet', icon: FileSpreadsheet },
  { name: 'LineChart', icon: LineChart },
  { name: 'Percent', icon: Percent },
  { name: 'Scale', icon: Scale },
  { name: 'ClipboardList', icon: ClipboardList },
  { name: 'Folder', icon: Folder },
  { name: 'HardDrive', icon: HardDrive },
  { name: 'Network', icon: Network },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'ScrollText', icon: ScrollText },
];

function getIconComp(name) {
  return SKILL_ICONS.find(i => i.name === name)?.icon || Info;
}

/* ─── Sortable Skill Card ─── */
function SortableSkillCard({ item, onEdit, onDelete }) {
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
    zIndex: isDragging ? 10 : 1,
  };

  const IconComp = getIconComp(item.icon);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`skill-admin-card ${isDragging ? 'dragging' : ''}`}
    >
      {/* Full-height Drag Handle */}
      <div
        className="skill-admin-drag-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        <GripVertical size={20} />
      </div>

      {/* Icon & Info side-by-side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <div className="skill-admin-card-icon">
          <IconComp size={18} />
        </div>
        <div className="skill-admin-card-info">
          <h3 className="skill-admin-card-title">{item.title}</h3>
          <p className="skill-admin-card-subtitle">{item.subtitle}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="skill-admin-card-actions">
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={() => onEdit(item)}
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          className="btn btn-danger btn-icon"
          onClick={() => onDelete(item.id)}
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─── Draggable Skill Grid ─── */
function DraggableSkillGrid({ items, onReorder, onSaveOrder, onEdit, onDelete }) {
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

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
        <div className="skills-admin-grid">
          {items.map((item) => (
            <SortableSkillCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/* ─── Skill Form ─── */
function SkillForm({ initialData, onSubmit }) {
  const DEFAULTS = { icon: '', title: '', subtitle: '' };
  const [form, setForm] = useState(initialData ? { ...DEFAULTS, ...initialData } : DEFAULTS);
  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <form id="skill-form" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      {/* Icon picker */}
      <div className="form-field">
        <label className="form-label">Icon <span className="form-label-required">*</span></label>
        <div className="custom-scrollbar" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))', gap: 8,
          marginTop: 8, padding: 12, background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 8, maxHeight: 240, overflowY: 'auto',
        }}>
          {SKILL_ICONS.map((b) => {
            const IconComp = b.icon;
            const isSelected = form.icon === b.name;
            return (
              <button
                type="button"
                key={b.name}
                onClick={() => setForm(p => ({ ...p, icon: b.name }))}
                title={b.name}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', aspectRatio: '1/1', borderRadius: 8,
                  border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--surface-hover)' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <IconComp size={18} />
              </button>
            );
          })}
        </div>
        {form.icon && (
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {(() => { const Ic = getIconComp(form.icon); return <Ic size={13} />; })()}
            <span>{form.icon}</span>
          </div>
        )}
        <input type="text" required value={form.icon} onChange={() => { }} style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} tabIndex={-1} />
      </div>

      <div className="form-field">
        <label className="form-label">Title <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.title} onChange={set('title')} required placeholder="e.g. Taxation & Coretax" maxLength={80} />
        <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right', marginTop: 3 }}>{form.title.length}/80</div>
      </div>

      <div className="form-field">
        <label className="form-label">Subtitle <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.subtitle} onChange={set('subtitle')} required placeholder="e.g. VAT Reconciliation & Returns" maxLength={120} />
        <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right', marginTop: 3 }}>{form.subtitle.length}/120</div>
      </div>
    </form>
  );
}

/* ─── Main Page ─── */
export function SkillsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const [settings, setSettings] = useState({ skills_title: '', skills_subtitle: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [skillsData, set] = await Promise.all([
        skillService.getAll(),
        settingsService.get()
      ]);
      setItems(skillsData);
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
      await settingsService.update({ skills_title: settings.skills_title, skills_subtitle: settings.skills_subtitle });
      showAlert('success', 'Skills content saved.');
    } catch (err) { showAlert('error', err.message); }
    finally { setSavingSettings(false); }
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) { await skillService.update(editing.id, data); showAlert('success', 'Skill updated.'); }
      else { await skillService.create(data); showAlert('success', 'Skill added.'); }
      setDrawerOpen(false); fetchItems();
    } catch (err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleSaveOrder = async (newItems) => {
    try {
      await Promise.all(newItems.map((item, idx) => {
        if (item.sortOrder !== idx) {
          return skillService.update(item.id, { ...item, sortOrder: idx });
        }
        return Promise.resolve();
      }));
      showAlert('success', 'Skills order saved.');
    } catch (err) {
      showAlert('error', 'Failed to save order: ' + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await skillService.delete(deletingId);
      showAlert('success', 'Skill deleted.');
      setConfirmOpen(false); setDeletingId(null); fetchItems();
    } catch (err) { showAlert('error', err.message); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Skills</h1>
          <p className="page-description">Manage your skills and expertise list.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout">
        <div className="hero-left-col" style={{ gridColumn: '1 / -1' }}>

          {/* Settings Card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Title & Subtitle</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Main content for the Skills section on the homepage.</p>
            </div>
            <div style={{ padding: 20 }}>
              <form onSubmit={handleSettingsSubmit}>
                <div className="form-field">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Skills Title</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.skills_title || '').length} / 60</span>
                  </div>
                  <input className="form-input" value={settings.skills_title || ''} onChange={(e) => setSettings({ ...settings, skills_title: e.target.value })} maxLength={60} placeholder="e.g. Skills & Expertise..." />
                </div>
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Skills Subtitle</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.skills_subtitle || '').length} / 250</span>
                  </div>
                  <textarea className="form-input form-textarea" rows={3} value={settings.skills_subtitle || ''} onChange={(e) => setSettings({ ...settings, skills_subtitle: e.target.value })} maxLength={250} placeholder="Brief description for the skills section..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                  <Save size={13} /> {savingSettings ? 'Saving...' : 'Save Title & Subtitle'}
                </button>
              </form>
            </div>
          </div>

          <div style={{ padding: '16px 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Skills List</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{!loading && `${items.length} skill${items.length !== 1 ? 's' : ''}`}</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => { setEditing(null); setDrawerOpen(true); }}>
              <Plus size={14} /> Add Skill
            </button>
          </div>

          {loading ? (
            <LoadingState message="Loading skills..." />
          ) : error ? (
            <div className="alert alert-error">Failed to load: {error}</div>
          ) : items.length === 0 ? (
            <EmptyState title="No skills yet" message="Add your first skill." action={{ label: 'Add Skill', onClick: () => { setEditing(null); setDrawerOpen(true); } }} />
          ) : (
            <DraggableSkillGrid
              items={items}
              onReorder={setItems}
              onSaveOrder={handleSaveOrder}
              onEdit={(item) => { setEditing(item); setDrawerOpen(true); }}
              onDelete={(id) => { setDeletingId(id); setConfirmOpen(true); }}
            />
          )}
        </div>
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit Skill' : 'New Skill'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</button>
            <button className="btn btn-primary" onClick={() => document.getElementById('skill-form')?.requestSubmit()} disabled={submitting}>
              {submitting ? 'Saving...' : (editing ? 'Save Changes' : 'Add Skill')}
            </button>
          </>
        }
      >
        {drawerOpen && <SkillForm key={editing?.id ?? 'new'} initialData={editing} onSubmit={handleFormSubmit} />}
      </Drawer>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete skill?"
        message="This will permanently remove this skill. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingId(null); }}
      />
    </div>
  );
}
