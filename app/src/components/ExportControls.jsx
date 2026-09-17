import { FileDown, FileImage, FileType2 } from 'lucide-react';

export default function ExportControls({ isExporting, onExport }) {
  return (
    <div className="export-controls">
      <button className="btn" type="button" disabled={isExporting} onClick={() => onExport('pdf')}>
        <FileType2 size={18} />
        {isExporting ? 'Exporting...' : 'Export PDF'}
      </button>
      <div className="export-raster-actions">
        <button className="btn btn-secondary" type="button" disabled={isExporting} onClick={() => onExport('png')}>
          <FileImage size={16} />
          PNG
        </button>
        <button className="btn btn-secondary" type="button" disabled={isExporting} onClick={() => onExport('jpeg')}>
          <FileDown size={16} />
          JPEG
        </button>
      </div>
    </div>
  );
}