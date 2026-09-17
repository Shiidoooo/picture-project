import { ShieldAlert, X } from 'lucide-react';

export default function DisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>
            <ShieldAlert size={20} color="var(--accent-color)" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Privacy & Terms of Use
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body" style={{ display: 'block', padding: '24px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>1. 100% Local Processing (Privacy)</h3>
          <p style={{ marginBottom: '20px' }}>
            All image processing, cropping, and PDF generation happen <strong>entirely on your device</strong> (in your web browser). 
            Your photos are <strong>never uploaded, saved, or transmitted to any server</strong>. We do not collect or store any of your personal images or data.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>2. No Liability</h3>
          <p style={{ marginBottom: '20px' }}>
            This tool is provided "as is", without warranty of any kind. 
            The creators and host of this website are <strong>not liable for any damages, misuse, or issues</strong> arising from the use of this tool. 
            You are entirely responsible for ensuring that the photos you print meet the official requirements of the institutions you are submitting them to.
          </p>
          
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>3. Accuracy</h3>
          <p>
            While we strive for accurate print dimensions, printer settings (such as "Fit to Page") can alter the final physical size of your prints. Always print at "100% Scale" or "Actual Size" and verify dimensions with a ruler if necessary.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>I Understand</button>
        </div>
      </div>
    </div>
  );
}
