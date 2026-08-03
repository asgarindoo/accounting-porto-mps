import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, Info, GripVertical, Save,
  Mail, MessageCircle, Linkedin, MapPin, Phone, Globe, Twitter, Github,
  Instagram, Facebook, Youtube, Twitch, Send, CheckCircle, Heart, Star, Briefcase
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
import { contactService, settingsService } from '../../services/contentService.js';
import { Drawer } from '../../components/admin/Drawer.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';
import { LoadingState } from '../../components/admin/LoadingState.jsx';
import { EmptyState } from '../../components/admin/EmptyState.jsx';
import '../../components/admin/admin.css';

/* ─── Icon List ─── */
const CONTACT_ICONS = [
  { name: 'Mail', icon: Mail },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'Phone', icon: Phone },
  { name: 'Linkedin', icon: Linkedin },
  { name: 'Github', icon: Github },
  { name: 'Twitter', icon: Twitter },
  { name: 'Instagram', icon: Instagram },
  { name: 'Facebook', icon: Facebook },
  { name: 'Youtube', icon: Youtube },
  { name: 'Twitch', icon: Twitch },
  { name: 'Send', icon: Send },
  { name: 'MapPin', icon: MapPin },
  { name: 'Globe', icon: Globe },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Info', icon: Info },
];

function getIconComp(name) {
  return CONTACT_ICONS.find(i => i.name === name)?.icon || Info;
}

/* ─── Sortable Contact Card ─── */
function SortableContactCard({ item, onEdit, onDelete }) {
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
      <div
        className="skill-admin-drag-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        <GripVertical size={20} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <div className="skill-admin-card-icon">
          <IconComp size={18} />
        </div>
        <div className="skill-admin-card-info">
          <h3 className="skill-admin-card-title">{item.label}</h3>
          <p className="skill-admin-card-subtitle">{item.value}</p>
          {item.link && (
            <p style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.link}
            </p>
          )}
        </div>
      </div>

      <div className="skill-admin-card-actions">
        <button type="button" className="btn btn-ghost btn-icon" onClick={() => onEdit(item)} title="Edit">
          <Pencil size={13} />
        </button>
        <button type="button" className="btn btn-danger btn-icon" onClick={() => onDelete(item.id)} title="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─── Draggable Contact Grid ─── */
function DraggableContactGrid({ items, onReorder, onSaveOrder, onEdit, onDelete }) {
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
            <SortableContactCard
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

/* ─── Contact Form ─── */
function ContactForm({ initialData, onSubmit }) {
  const DEFAULTS = { icon: 'Mail', label: '', value: '', link: '' };
  const [form, setForm] = useState(initialData ? { ...DEFAULTS, ...initialData } : DEFAULTS);
  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <form id="contact-form" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="form-field">
        <label className="form-label">Icon <span className="form-label-required">*</span></label>
        <div className="custom-scrollbar" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))', gap: 8,
          marginTop: 8, padding: 12, background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 8, maxHeight: 180, overflowY: 'auto',
        }}>
          {CONTACT_ICONS.map((b) => {
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
        <input type="text" required value={form.icon} onChange={() => { }} style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} tabIndex={-1} />
      </div>

      <div className="form-field">
        <label className="form-label">Label <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.label} onChange={set('label')} required placeholder="e.g. Email" maxLength={50} />
      </div>

      <div className="form-field">
        <label className="form-label">Value <span className="form-label-required">*</span></label>
        <input className="form-input" value={form.value} onChange={set('value')} required placeholder="e.g. hello@example.com" maxLength={150} />
      </div>

      <div className="form-field">
        <label className="form-label">Link (Optional)</label>
        <input className="form-input" value={form.link || ''} onChange={set('link')} placeholder="e.g. mailto:hello@example.com" maxLength={250} />
        <p style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 4 }}>Add a URL or mailto link if you want it to be clickable.</p>
      </div>
    </form>
  );
}

/* ─── Main Page ─── */
export function ContactAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const [settings, setSettings] = useState({ contact_title: '', contact_subtitle: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const [contactsData, set] = await Promise.all([
        contactService.getAll(),
        settingsService.get()
      ]);
      setItems(contactsData);
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
      await settingsService.update({ contact_title: settings.contact_title, contact_subtitle: settings.contact_subtitle });
      showAlert('success', 'Contact title and subtitle saved.');
    } catch (err) { showAlert('error', err.message); }
    finally { setSavingSettings(false); }
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await contactService.update(editing.id, data);
        showAlert('success', 'Contact updated.');
      } else {
        if (items.length >= 6) {
          throw new Error('Maximum of 6 contacts allowed.');
        }
        await contactService.create({ ...data, sortOrder: items.length });
        showAlert('success', 'Contact added.');
      }
      setDrawerOpen(false); fetchItems();
    } catch (err) { showAlert('error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleSaveOrder = async (newItems) => {
    try {
      await Promise.all(newItems.map((item, idx) => {
        if (item.sortOrder !== idx) {
          return contactService.update(item.id, { ...item, sortOrder: idx });
        }
        return Promise.resolve();
      }));
      showAlert('success', 'Contacts order saved.');
    } catch (err) {
      showAlert('error', 'Failed to save order: ' + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await contactService.delete(deletingId);
      showAlert('success', 'Contact deleted.');
      setConfirmOpen(false); setDeletingId(null); fetchItems();
    } catch (err) { showAlert('error', err.message); }
  };

  const maxContactsReached = items.length >= 6;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Contact</h1>
          <p className="page-description">Manage contact section subtitle and details (max 6).</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="hero-split-layout">
        <div className="hero-left-col" style={{ gridColumn: '1 / -1' }}>
          
          {/* Settings Card */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Title & Subtitle</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Main content for the Contact section on the homepage.</p>
            </div>
            <div style={{ padding: 20 }}>
              <form onSubmit={handleSettingsSubmit}>
                <div className="form-field">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Contact Title</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.contact_title || '').length} / 60</span>
                  </div>
                  <input className="form-input" value={settings.contact_title || ''} onChange={(e) => setSettings({ ...settings, contact_title: e.target.value })} maxLength={60} placeholder="e.g. Let's build something together..." />
                </div>
                <div className="form-field" style={{ marginBottom: 16 }}>
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span>Contact Subtitle</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-disabled)', textTransform: 'none' }}>{(settings.contact_subtitle || '').length} / 250</span>
                  </div>
                  <textarea className="form-input form-textarea" rows={3} value={settings.contact_subtitle || ''} onChange={(e) => setSettings({ ...settings, contact_subtitle: e.target.value })} maxLength={250} placeholder="Brief description for the contact section..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                  <Save size={13} /> {savingSettings ? 'Saving...' : 'Save Title & Subtitle'}
                </button>
              </form>
            </div>
          </div>

          <div style={{ padding: '16px 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Contact List</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                {!loading && `${items.length}/6 contact${items.length !== 1 ? 's' : ''} added`}
              </p>
            </div>
            <button
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: 13 }}
              onClick={() => { setEditing(null); setDrawerOpen(true); }}
              disabled={maxContactsReached}
              title={maxContactsReached ? 'Maximum of 6 contacts reached' : 'Add new contact'}
            >
              <Plus size={14} /> Add Contact
            </button>
          </div>

          {loading ? (
            <LoadingState message="Loading contacts..." />
          ) : error ? (
            <div className="alert alert-error">Failed to load: {error}</div>
          ) : items.length === 0 ? (
            <EmptyState title="No contacts yet" message="Add your first contact detail." action={{ label: 'Add Contact', onClick: () => { setEditing(null); setDrawerOpen(true); } }} />
          ) : (
            <DraggableContactGrid
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
        title={editing ? 'Edit Contact' : 'New Contact'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDrawerOpen(false)} disabled={submitting}>Cancel</button>
            <button className="btn btn-primary" onClick={() => document.getElementById('contact-form')?.requestSubmit()} disabled={submitting}>
              {submitting ? 'Saving...' : (editing ? 'Save Changes' : 'Add Contact')}
            </button>
          </>
        }
      >
        {drawerOpen && <ContactForm key={editing?.id ?? 'new'} initialData={editing} onSubmit={handleFormSubmit} />}
      </Drawer>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete contact?"
        message="This will permanently remove this contact. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingId(null); }}
      />
    </div>
  );
}
