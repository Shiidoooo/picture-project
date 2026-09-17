import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

const NOTICE_ICONS = {
  error: AlertTriangle,
  success: CheckCircle2,
  warning: AlertTriangle,
};

export default function ErrorAlert({ message, variant = 'error', onDismiss }) {
  if (!message) return null;

  const Icon = NOTICE_ICONS[variant] || Info;

  return (
    <div className={`error-alert notice-${variant}`} role="status" aria-live="polite">
      <Icon className="error-alert-icon" size={22} aria-hidden="true" />
      <p>{message}</p>
      <button className="error-alert-dismiss" type="button" onClick={onDismiss} aria-label="Dismiss notification">
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}