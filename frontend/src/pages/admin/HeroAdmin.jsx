import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Plus, Pencil, Trash2, Save, ImageOff, GripVertical, Info, 
  CheckCircle, Award, Briefcase, Code, Star, Heart, Zap, Coffee, Globe, Users, TrendingUp, Lightbulb, Monitor, Smartphone, PenTool,
  Database, Server, Terminal, Cpu, Layers, Shield, Activity, Cloud, Settings, Compass, PieChart, BarChart, Box, Camera, Edit, FileCode, FileText, Image, Search, Wifi, Layout, GitBranch, Command, Key, Lock, Book, Link, MapPin, Mail, Calendar, Clock,
  Calculator, Receipt, Banknote, Wallet, Coins, CreditCard, Landmark, Building, FileSpreadsheet, LineChart, Percent, Scale, ClipboardList, Folder, HardDrive, Network, BookOpen, ScrollText
} from 'lucide-react';

const BADGE_ICONS = [
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
  { name: 'ScrollText', icon: ScrollText }
];
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
import { headlineService, statService, badgeService, settingsService } from '../../services/contentService.js';
import { Drawer } from '../../components/admin/Drawer.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import '../../components/admin/admin.css';

/* ─── Sortable Item ─── */
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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
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
            <SortableItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              renderContent={renderContent}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/* ─── Form Components ─── */
function HeadlineForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({ text: initialData?.text || '' });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <form id="headline-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form }); }}>
      <div className="form-field">
        <label className="form-label">Text <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.text} onChange={set('text')} required placeholder="e.g. Accounting Specialist" maxLength={25} />
        <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right' }}>{form.text.length}/25</div>
      </div>
    </form>
  );
}

function StatForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({ value: initialData?.value || '', label: initialData?.label || '' });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <form id="stat-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form }); }}>
      <div className="form-field">
        <label className="form-label">Value <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.value} onChange={set('value')} required placeholder="e.g. 3+" maxLength={5} />
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'right', marginTop: 4 }}>{form.value.length}/5</div>
      </div>
      <div className="form-field">
        <label className="form-label">Label <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.label} onChange={set('label')} required placeholder="e.g. Years Experience" maxLength={30} />
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'right', marginTop: 4 }}>{form.label.length}/30</div>
      </div>
    </form>
  );
}

function BadgeForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({ icon: initialData?.icon || '', text: initialData?.text || '' });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  return (
    <form id="badge-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form }); }}>
      <div className="form-field">
        <label className="form-label">Icon <span className="form-label-required">*</span></label>
        <div className="custom-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))', gap: 8, marginTop: 8, padding: 12, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, maxHeight: 300, overflowY: 'auto' }}>
          {BADGE_ICONS.map((b) => {
            const IconComp = b.icon;
            const isSelected = form.icon === b.name;
            return (
              <button
                type="button"
                key={b.name}
                onClick={() => setForm(p => ({ ...p, icon: b.name }))}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', aspectRatio: '1/1', borderRadius: 8,
                  border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--surface-hover)' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                title={b.name}
              >
                <IconComp size={20} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">Text <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.text} onChange={set('text')} required placeholder="e.g. Detail Oriented" maxLength={25} />
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'right', marginTop: 4 }}>{form.text.length}/25</div>
      </div>
    </form>
  );
}

/* ─── Main Page ─── */
export function HeroAdmin() {
  const [headlines, setHeadlines] = useState([]);
  const [stats, setStats] = useState([]);
  const [badges, setBadges] = useState([]);
  const [settings, setSettings] = useState({ hero_description: '', portrait: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeDrawer, setActiveDrawer] = useState(null); // 'headline' | 'stat' | 'badge' | null
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activeDeleteType, setActiveDeleteType] = useState(null);
  const [alert, setAlert] = useState(null);
  const [savingOverview, setSavingOverview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmRemovePortrait, setConfirmRemovePortrait] = useState(false);

  const fileInputRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [hl, st, bd, set] = await Promise.all([
        headlineService.getAll(),
        statService.getAll(),
        badgeService.getAll(),
        settingsService.get()
      ]);
      setHeadlines(hl.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      setStats(st.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      setBadges(bd.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      if (set) setSettings((prev) => ({ ...prev, ...set }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showAlert = (type, message) => { setAlert({ type, message }); setTimeout(() => setAlert(null), 3500); };

  const serviceFor = (type) => ({ headline: headlineService, stat: statService, badge: badgeService }[type]);

  const handleOverviewSubmit = async (e) => {
    e.preventDefault();
    setSavingOverview(true);
    try {
      await settingsService.update({ hero_description: settings.hero_description, portrait: settings.portrait });
      showAlert('success', 'Hero text saved successfully.');
    } catch (err) { showAlert('error', err.message); }
    finally { setSavingOverview(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'images');
    formData.append('path', 'portraits');
    if (settings.portrait) {
      formData.append('oldUrl', settings.portrait);
    }
    try {
      setUploading(true);
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Upload failed');
      const newUrl = data.data.url;
      setSettings(prev => ({ ...prev, portrait: newUrl }));
      await settingsService.update({ portrait: newUrl });
      showAlert('success', 'Portrait updated successfully.');
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePortrait = async () => {
    if (!settings.portrait) return;
    try {
      setUploading(true);
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: settings.portrait, bucket: 'images' }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success && res.status !== 404) {
        console.warn('Failed to delete from storage, but removing from DB anyway', data);
      }
      setSettings(prev => ({ ...prev, portrait: '' }));
      await settingsService.update({ portrait: '' });
      showAlert('success', 'Portrait removed successfully.');
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const svc = serviceFor(activeDrawer);
      const currentList = activeDrawer === 'headline' ? headlines : activeDrawer === 'stat' ? stats : badges;
      if (editing) {
        await svc.update(editing.id, data);
      } else {
        const sortOrder = currentList.length > 0 ? Math.max(...currentList.map(i => i.sortOrder || 0)) + 1 : 0;
        await svc.create({ ...data, sortOrder });
      }
      showAlert('success', 'Saved successfully.');
      setActiveDrawer(null); fetchData();
    } catch (err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await serviceFor(activeDeleteType).delete(deletingId);
      showAlert('success', 'Deleted.');
      setConfirmOpen(false); setDeletingId(null); setActiveDeleteType(null);
      fetchData();
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

  if (loading) return <LoadingState message="Loading hero content..." />;
  if (error) return <div className="alert alert-error">Failed to load: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Hero</h1>
          <p className="page-description">Manage the landing page hero section content.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout">
        {/* LEFT COLUMN: Texts and Draggables */}
        <div className="hero-left-col">

          {/* Headlines Section */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Headlines</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Drag to reorder (Max 3)</p>
              </div>
              {headlines.length < 3 && (
                <button className="btn btn-secondary" onClick={() => { setEditing(null); setActiveDrawer('headline'); }} title="Add Headline"><Plus size={14} /> Add</button>
              )}
            </div>
            <div style={{ padding: 16, background: 'var(--bg)' }}>
              <DraggableList
                items={headlines}
                onReorder={setHeadlines}
                onSaveOrder={(newItems) => handleSaveOrder('headline', newItems)}
                onEdit={(item) => { setEditing(item); setActiveDrawer('headline'); }}
                onDelete={(id) => openDelete('headline', id)}
                renderContent={(item) => item.text}
              />
            </div>
          </div>

          {/* Subheadline Section */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Sub Headline</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Appears under the headline.</p>
            </div>
            <div style={{ padding: 20 }}>
              <form onSubmit={handleOverviewSubmit}>
                <textarea className="form-textarea" rows={4} value={settings.hero_description} onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })} placeholder="Write a brief introduction..." maxLength={120} />
                <div style={{ fontSize: 11, color: 'var(--text-disabled)', textAlign: 'right', marginTop: 4 }}>
                  {(settings.hero_description || '').length}/120
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="submit" className="btn btn-primary" disabled={savingOverview}>
                    <Save size={13} /> {savingOverview ? 'Saving...' : 'Save Text'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Portrait Preview */}
        <div className="hero-right-col">
          <div className="portrait-preview-box">
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>Portrait Image</p>

            {settings.portrait ? (
              <img src={settings.portrait} alt="Portrait preview" className="portrait-image-large" />
            ) : (
              <div className="portrait-placeholder-large">
                <ImageOff size={32} />
              </div>
            )}

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 200 }}>
              This image will be displayed prominently on the right side of the hero section.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button
                className="btn btn-secondary"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                style={{ flex: 1 }}
              >
                {uploading ? 'Uploading...' : (settings.portrait ? 'Change' : 'Upload Portrait')}
              </button>
              {settings.portrait && (
                <button
                  className="btn btn-secondary"
                  style={{ color: 'var(--destructive)' }}
                  disabled={uploading}
                  onClick={() => setConfirmRemovePortrait(true)}
                >
                  Remove
                </button>
              )}
            </div>

            <div style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--surface-hover)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              width: '100%',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Info size={16} color="var(--accent)" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Tips Foto Terbaik</span>
              </div>
              <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Gunakan foto dengan <strong>latar belakang transparan</strong> atau warna solid.</li>
                <li>Rasio ideal adalah portrait (vertikal).</li>
                <li>Ukuran file maksimal <strong>5 MB</strong>.</li>
                <li>Format yang didukung: JPG, PNG, WEBP.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' }} />

      {/* Stats and Badges Grid */}
      <div className="form-row form-row-2">
        {/* Stats */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Statistics</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Drag to reorder (Max 3)</p>
            </div>
            {stats.length < 3 && (
              <button className="btn btn-secondary" onClick={() => { setEditing(null); setActiveDrawer('stat'); }}><Plus size={14} /> Add</button>
            )}
          </div>
          <div style={{ padding: 16, background: 'var(--bg)' }}>
            <DraggableList
              items={stats}
              onReorder={setStats}
              onSaveOrder={(newItems) => handleSaveOrder('stat', newItems)}
              onEdit={(item) => { setEditing(item); setActiveDrawer('stat'); }}
              onDelete={(id) => openDelete('stat', id)}
              renderContent={(item) => <><span style={{ fontWeight: 600 }}>{item.value}</span> - {item.label}</>}
            />
          </div>
        </div>

        {/* Badges */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Floating Badges</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Drag to reorder (Max 4)</p>
            </div>
            {badges.length < 4 && (
              <button className="btn btn-secondary" onClick={() => { setEditing(null); setActiveDrawer('badge'); }}><Plus size={14} /> Add</button>
            )}
          </div>
          <div style={{ padding: 16, background: 'var(--bg)' }}>
            <DraggableList
              items={badges}
              onReorder={setBadges}
              onSaveOrder={(newItems) => handleSaveOrder('badge', newItems)}
              onEdit={(item) => { setEditing(item); setActiveDrawer('badge'); }}
              onDelete={(id) => openDelete('badge', id)}
              renderContent={(item) => {
                const badgeIcon = BADGE_ICONS.find(b => b.name === item.icon);
                const IconComp = badgeIcon ? badgeIcon.icon : Star;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', color: 'var(--accent)' }}><IconComp size={18} /></span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.text}</span>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* Drawers */}
      <Drawer isOpen={!!activeDrawer} onClose={() => setActiveDrawer(null)} title={editing ? `Edit` : `New`}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setActiveDrawer(null)} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={() => document.getElementById(`${activeDrawer}-form`)?.requestSubmit()} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </>}
      >
        {activeDrawer === 'headline' && <HeadlineForm key={editing?.id ?? 'new'} initialData={editing} onSubmit={handleSubmit} />}
        {activeDrawer === 'stat' && <StatForm key={editing?.id ?? 'new'} initialData={editing} onSubmit={handleSubmit} />}
        {activeDrawer === 'badge' && <BadgeForm key={editing?.id ?? 'new'} initialData={editing} onSubmit={handleSubmit} />}
      </Drawer>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete item?"
        message="This will permanently remove this item. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingId(null); setActiveDeleteType(null); }}
      />

      <ConfirmDialog
        isOpen={confirmRemovePortrait}
        title="Remove portrait?"
        message="This will permanently delete the portrait image. This action cannot be undone."
        onConfirm={() => { setConfirmRemovePortrait(false); handleRemovePortrait(); }}
        onCancel={() => setConfirmRemovePortrait(false)}
      />
    </div>
  );
}
