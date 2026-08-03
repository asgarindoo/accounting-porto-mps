import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';
import './admin.css';

export function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;

  const dialog = (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-panel" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <Trash2 size={18} />
        </div>
        <h3 className="confirm-title">{title || 'Are you sure?'}</h3>
        <p className="confirm-message">{message || 'This action cannot be undone.'}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
