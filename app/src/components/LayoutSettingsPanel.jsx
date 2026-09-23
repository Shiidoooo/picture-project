import { Ruler, Scissors, Settings, FileWarning } from 'lucide-react';
import { PAPER_SIZE_GROUPS } from '../data/paperSizes';

export default function LayoutSettingsPanel({ layout, onPaperSizeChange, onOrientationChange, onSettingsChange, onOpenDisclaimer }) {
  const { settings } = layout;

  return (
    <div className="control-group">
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

      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--surface-border)' }}>
        <button 
          onClick={onOpenDisclaimer} 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
          onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
          type="button"
        >
          <FileWarning size={14} />
          Privacy & Terms of Use
        </button>
      </div>
    </div>
  );
}