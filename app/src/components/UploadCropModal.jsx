import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { createImageSources } from '../utils/imageSources';

export default function UploadCropModal({ isOpen, onClose, onUploadComplete }) {
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (Array.from(files).some((file) => !file.type.startsWith('image/'))) {
      setError('Choose only image files.');
      event.target.value = '';
      return;
    }

    setIsProcessing(true);

    try {
      onUploadComplete(await createImageSources(files));
      setError('');
      event.target.value = '';
      onClose();
    } catch (uploadError) {
      setError(uploadError.message || 'The image could not be added.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload Photo</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body upload-modal-body">
          <div className="upload-modal-picker">
            <label htmlFor="file-upload" className="btn btn-secondary upload-modal-button">
              <Upload size={24} />
              {isProcessing ? 'Adding images...' : 'Select Images'}
            </label>
            <input id="file-upload" type="file" accept="image/png, image/jpeg, image/webp" multiple disabled={isProcessing} onChange={handleFileChange} style={{ display: 'none' }} />
            {error && (
              <p className="upload-error">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" style={{ width: 'auto' }} type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
