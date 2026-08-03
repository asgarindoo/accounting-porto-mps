import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './admin.css';

/**
 * Drawer — renders via React Portal to document.body
 * so position:fixed always works regardless of parent stacking context.
 * Right-side panel on desktop, bottom sheet on mobile.
 */
export function Drawer({ isOpen, onClose, title, children, footer }) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Always render — CSS handles visibility/transform
  const drawer = (
    <div
      className={`drawer-overlay${isOpen ? ' open' : ''}`}
      onClick={onClose}
    >
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Mobile drag handle */}
        <div className="drawer-handle" />

        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">{title}</h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="drawer-body">
          {children}
        </div>

        {/* Sticky footer */}
        {footer && (
          <div className="drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Portal to document.body — escapes any parent stacking context
  return createPortal(drawer, document.body);
}
