import { Inbox } from 'lucide-react';
import './admin.css';

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Get started by adding a new entry.',
  action
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={32} />
      </div>
      <div>
        <p className="empty-state-title">{title}</p>
        <p className="empty-state-desc">{message}</p>
      </div>
      {action && (
        <button className="btn btn-secondary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
