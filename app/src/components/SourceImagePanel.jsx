import { Crop, ImagePlus, Trash2, Upload } from 'lucide-react';

export default function SourceImagePanel({ sourceImages, onOpenUpload, onEditCrop, onRemoveSource, onAssignSourceToAll }) {
  return (
    <div className="control-group">
      <div className="section-heading-row">
        <h2 className="section-title">
          <ImagePlus size={16} />
          Source Images
        </h2>
        <button className="icon-button" type="button" title="Add images" aria-label="Add images" onClick={onOpenUpload}>
          <Upload size={17} />
        </button>
      </div>

      {sourceImages.length === 0 ? (
        <button className="upload-area" type="button" onClick={onOpenUpload}>
          <Upload size={28} />
          <span>Add source images</span>
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
                <button className="icon-button" type="button" title={`Crop ${source.name}`} aria-label={`Crop ${source.name}`} onClick={() => onEditCrop(source.id)}>
                  <Crop size={16} />
                </button>
                <button className="icon-button icon-button-danger" type="button" title={`Remove ${source.name}`} aria-label={`Remove ${source.name}`} onClick={() => onRemoveSource(source.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <button className="source-use-button" type="button" onClick={() => onAssignSourceToAll(source.id)}>
                Use for all sizes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}