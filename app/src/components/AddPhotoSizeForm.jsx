import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function AddPhotoSizeForm({ presets, onAddPhotoSize }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('2x2');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const resetAndClose = () => {
    setIsOpen(false);
    setSelectedPreset('2x2');
    setCustomWidth('');
    setCustomHeight('');
  };

  const addPhotoSize = () => {
    const preset = presets.find((item) => item.key === selectedPreset);
    if (!preset) return;

    const width = selectedPreset === 'custom' ? Number(customWidth) : preset.width;
    const height = selectedPreset === 'custom' ? Number(customHeight) : preset.height;

    if (!width || !height || width <= 0 || height <= 0) return;

    const type = selectedPreset === 'custom'
      ? `Custom (${width}x${height}mm)`
      : preset.type;

    if (onAddPhotoSize({ type, width, height })) resetAndClose();
  };

  if (!isOpen) {
    return (
      <button className="btn btn-secondary" type="button" onClick={() => setIsOpen(true)}>
        <Plus size={18} />
        Add Photo Size
      </button>
    );
  }

  return (
    <div className="add-photo-form">
      <div className="add-photo-form-heading">
        <span>Add Photo Size</span>
        <button className="icon-button" type="button" title="Close" aria-label="Close" onClick={resetAndClose}>
          <X size={16} />
        </button>
      </div>
      <label className="control-group">
        <span className="control-label">Preset</span>
        <select className="select-input" value={selectedPreset} onChange={(event) => setSelectedPreset(event.target.value)}>
          {presets.map((preset) => (
            <option key={preset.key} value={preset.key}>
              {preset.type}{preset.width ? ` (${preset.width}x${preset.height}mm)` : ''}
            </option>
          ))}
        </select>
      </label>
      {selectedPreset === 'custom' && (
        <div className="custom-size-fields">
          <label className="control-group">
            <span className="control-label">Width (mm)</span>
            <input className="text-input" type="number" min="1" step="0.1" value={customWidth} onChange={(event) => setCustomWidth(event.target.value)} />
          </label>
          <label className="control-group">
            <span className="control-label">Height (mm)</span>
            <input className="text-input" type="number" min="1" step="0.1" value={customHeight} onChange={(event) => setCustomHeight(event.target.value)} />
          </label>
        </div>
      )}
      <button className="btn" type="button" onClick={addPhotoSize}>
        <Plus size={16} />
        Add to Layout
      </button>
    </div>
  );
}