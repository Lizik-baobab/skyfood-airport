export default function Toast({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className="toast-icon" aria-hidden="true">{type === 'success' ? '✓' : '!'}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Закрыть уведомление">×</button>
    </div>
  );
}
