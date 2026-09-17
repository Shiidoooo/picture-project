import { AlertTriangle, Image, Minus, Plus, Trash2 } from 'lucide-react';
import { getPrintQuality } from '../utils/printQuality';

export default function PhotoList({ photos, sourceImages, targetDpi, onPhotoSourceChange, onUpdateQuantity, onRemovePhoto }) {
  const sourcesById = new Map(sourceImages.map((source) => [source.id, source]));

  return (
    <div className="photo-list">
      {photos.map((photo) => {
        const source = sourcesById.get(photo.imageId);
        const quality = getPrintQuality(photo, source, targetDpi);

        return (
          <div key={photo.id} className="photo-item-card">
            <div className="photo-item-header">
              <div className="photo-item-info">
                <span className="photo-item-title">{photo.type}</span>
                <span className="photo-item-subtitle">{photo.width} x {photo.height} mm</span>
              </div>
              <button className="delete-btn" type="button" title="Remove size" aria-label={`Remove ${photo.type}`} onClick={() => onRemovePhoto(photo.id)}>
                <Trash2 size={16} />
              </button>
            </div>

            <label className="source-select">
              <Image size={15} />
              <span>Source</span>
              <select aria-label={`Source image for ${photo.type}`} value={photo.imageId || ''} onChange={(event) => onPhotoSourceChange(photo.id, event.target.value || null)}>
                <option value="">Assign source image</option>
                {sourceImages.map((imageSource) => <option key={imageSource.id} value={imageSource.id}>{imageSource.name}</option>)}
              </select>
            </label>

            {quality && (
              <span className={`quality-badge quality-${quality.level}`} title={`Available print resolution: ${quality.dpi} DPI`}>
                {quality.level !== 'good' && <AlertTriangle size={13} />}
                {quality.label}
              </span>
            )}

            <div className="quantity-control">
              <button className="quantity-btn" type="button" aria-label={`Remove one ${photo.type}`} onClick={() => onUpdateQuantity(photo.id, -1)}>
                <Minus size={14} />
              </button>
              <span className="quantity-display">{photo.quantity}</span>
              <button className="quantity-btn" type="button" aria-label={`Add one ${photo.type}`} onClick={() => onUpdateQuantity(photo.id, 1)}>
                <Plus size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}