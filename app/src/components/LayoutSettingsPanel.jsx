import { Ruler, Scissors, Settings } from 'lucide-react';
import { PAPER_SIZE_GROUPS } from '../data/paperSizes';

export default function LayoutSettingsPanel({ layout, onPaperSizeChange, onOrientationChange, onSettingsChange }) {
  const { settings } = layout;

  return (
    <div className="control-group">
      <h2 className="section-title">
        <Settings size={16} />
        Sheet Settings
      </h2>
      <label className="control-group">
        <span className="control-label">Paper Size</span>
        <select className="select-input" value={layout.paperSize} onChange={(event) => onPaperSizeChange(event.target.value)}>
          {Object.entries(PAPER_SIZE_GROUPS).map(([group, papers]) => (
            <optgroup key={group} label={group}>
              {papers.map((paper) => (
                <option key={paper.id} value={paper.id}>{paper.label} ({paper.width} x {paper.height} mm)</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div className="control-group">
        <span className="control-label">Orientation</span>
        <div className="segmented-control" role="group" aria-label="Paper orientation">
          <button className={layout.orientation === 'portrait' ? 'is-selected' : ''} type="button" onClick={() => onOrientationChange('portrait')}>Portrait</button>
          <button className={layout.orientation === 'landscape' ? 'is-selected' : ''} type="button" onClick={() => onOrientationChange('landscape')}>Landscape</button>
        </div>
      </div>

      <label className="range-control">
        <span><Ruler size={15} /> Margin <output>{settings.margin} mm</output></span>
        <input type="range" min="0" max="20" step="1" value={settings.margin} onChange={(event) => onSettingsChange({ margin: Number(event.target.value) })} />
      </label>
      <label className="range-control">
        <span><Scissors size={15} /> Spacing <output>{settings.spacing} mm</output></span>
        <input type="range" min="0" max="10" step="0.5" value={settings.spacing} onChange={(event) => onSettingsChange({ spacing: Number(event.target.value) })} />
      </label>

      <div className="toggle-list">
        <label className="toggle-control">
          <input type="checkbox" checked={settings.showCutGuides} onChange={(event) => onSettingsChange({ showCutGuides: event.target.checked })} />
          <span>Show cut marks in preview and export</span>
        </label>
        <label className="toggle-control">
          <input type="checkbox" checked={settings.showMarginGuide} onChange={(event) => onSettingsChange({ showMarginGuide: event.target.checked })} />
          <span>Show printable margin in preview and export</span>
        </label>
      </div>

      <label className="control-group">
        <span className="control-label">Raster Export Quality</span>
        <select className="select-input" value={settings.exportDpi} onChange={(event) => onSettingsChange({ exportDpi: Number(event.target.value) })}>
          <option value="150">150 DPI</option>
          <option value="300">300 DPI</option>
        </select>
      </label>
    </div>
  );
}