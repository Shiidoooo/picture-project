import { Crop, Trash2, Upload } from 'lucide-react';

export default function SourceImagePanel({ sourceImages, onOpenUpload, onEditCrop, onRemoveSource, onAssignSourceToAll }) {
  return (
    <div className="control-group">
      {sourceImages.length === 0 ? (
        <button className="upload-area" type="button" onClick={onOpenUpload}>
          <Upload size={28} />
          <span>Add source image</span>
        </button>
      ) : (
        <div className="source-image-list">
          {sourceImages.map((source) => (
            <div key={source.id} className="source-image-item">
              <img src={source.url} alt={source.name} />
              <div className="source-image-details">
                <span title={source.name}>{source.name}</span>
                <small>{source.width} x {source.height} px</small>
              </div>
              <div className="source-image-actions">
                <button className="icon-button" type="button" title="Crop image" aria-label="Crop image" onClick={() => onEditCrop(source.id)}>
                  <Crop size={16} />
                </button>
                <button className="icon-button icon-button-danger" type="button" title="Remove image" aria-label="Remove image" onClick={() => onRemoveSource(source.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
