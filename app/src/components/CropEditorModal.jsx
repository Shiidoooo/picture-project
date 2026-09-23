import { useRef, useState } from 'react';
import { Check, Maximize, Maximize2, Minimize, Minimize2, RotateCcw, X } from 'lucide-react';
import { DEFAULT_CROP, getImageDrawRect, normalizeCrop } from '../utils/imageCrop';

const PREVIEW_SIZE = { width: 260, height: 340 };

export default function CropEditorModal({ source, onClose, onSave }) {
  const [crop, setCrop] = useState(() => normalizeCrop(source?.crop));
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const dragStart = useRef(null);

  if (!source) return null;

  const imageRect = getImageDrawRect(source.width, source.height, { x: 0, y: 0, ...PREVIEW_SIZE }, crop);
  const updateCrop = (changes) => setCrop((currentCrop) => normalizeCrop({ ...currentCrop, ...changes }));

  const startDrag = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      positionX: crop.positionX,
      positionY: crop.positionY,
    };
  };

  const moveDrag = (event) => {
    if (!dragStart.current) return;

    const positionWidth = PREVIEW_SIZE.width - imageRect.width;
    const positionHeight = PREVIEW_SIZE.height - imageRect.height;
    const positionX = positionWidth ? dragStart.current.positionX + ((event.clientX - dragStart.current.clientX) * 100 / positionWidth) : crop.positionX;
    const positionY = positionHeight ? dragStart.current.positionY + ((event.clientY - dragStart.current.clientY) * 100 / positionHeight) : crop.positionY;

    updateCrop({ positionX, positionY });
  };

  const endDrag = (event) => {
    dragStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content crop-modal">
        <div className="modal-header">
          <div>
            <h2>Position Image</h2>
            <p className="modal-subtitle">{source.name}</p>
          </div>
          <button className="close-btn" type="button" aria-label="Close crop editor" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={`crop-editor-body ${previewExpanded ? 'is-preview-expanded' : ''}`}>
          <div
            className="crop-preview"
            style={PREVIEW_SIZE}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <img
              src={source.url}
              alt="Crop preview"
              style={{
                left: `${imageRect.x}px`,
                top: `${imageRect.y}px`,
                width: `${imageRect.width}px`,
                height: `${imageRect.height}px`,
              }}
            />
            <button 
              className="preview-expand-btn" 
              type="button" 
              onClick={(e) => { e.stopPropagation(); setPreviewExpanded(!previewExpanded); }}
              aria-label={previewExpanded ? "Minimize preview" : "Expand preview"}
            >
              {previewExpanded ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>

          <div className="crop-controls">
            <div className="control-group">
              <span className="control-label">Image Fit</span>
              <div className="segmented-control" role="group" aria-label="Image fit">
                <button className={crop.mode === 'cover' ? 'is-selected' : ''} type="button" onClick={() => updateCrop({ mode: 'cover' })}>
                  <Maximize2 size={16} />
                  Fill
                </button>
                <button className={crop.mode === 'contain' ? 'is-selected' : ''} type="button" onClick={() => updateCrop({ mode: 'contain' })}>
                  <Minimize2 size={16} />
                  Fit
                </button>
              </div>
            </div>

            <label className="range-control">
              <span>Zoom <output>{crop.zoom.toFixed(2)}x</output></span>
              <input type="range" min={crop.mode === 'cover' ? '1.1' : '1'} max="3" step="0.05" value={crop.zoom} onChange={(event) => updateCrop({ zoom: event.target.value })} />
            </label>
            <label className="range-control">
              <span>Horizontal Position</span>
              <input type="range" min="0" max="100" value={crop.positionX} onChange={(event) => updateCrop({ positionX: event.target.value })} />
            </label>
            <label className="range-control">
              <span>Vertical Position</span>
              <input type="range" min="0" max="100" value={crop.positionY} onChange={(event) => updateCrop({ positionY: event.target.value })} />
            </label>
            <button className="btn btn-secondary crop-reset-button" type="button" onClick={() => setCrop(DEFAULT_CROP)}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="btn" type="button" onClick={() => onSave(crop)}>
            <Check size={18} />
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}