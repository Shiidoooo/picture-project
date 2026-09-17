import { useState } from 'react';
import { FolderOpen, ImagePlus, Layers, LayoutTemplate, Redo2, Save, Settings, Undo2, FileWarning, Download } from 'lucide-react';
import { PHOTO_PRESETS } from '../data/photoPresets';
import AddPhotoSizeForm from './AddPhotoSizeForm';
import ErrorAlert from './ErrorAlert';
import ExportControls from './ExportControls';
import LayoutSettingsPanel from './LayoutSettingsPanel';
import PhotoList from './PhotoList';
import SourceImagePanel from './SourceImagePanel';
import TemplatePicker from './TemplatePicker';

const TABS = [
  { id: 'source', label: 'Images', icon: <ImagePlus size={20} /> },
  { id: 'settings', label: 'Sheet', icon: <Settings size={20} /> },
  { id: 'layout', label: 'Layout', icon: <Layers size={20} /> },
  { id: 'export', label: 'Export', icon: <Download size={20} /> }
];

export default function Sidebar({
  layout,
  sourceImages,
  unavailableTemplateIds,
  onOpenUpload,
  onEditCrop,
  onRemoveSource,
  onAssignSourceToAll,
  onPaperSizeChange,
  onOrientationChange,
  onSettingsChange,
  onApplyTemplate,
  onPhotoSourceChange,
  onUpdateQuantity,
  onRemovePhoto,
  onAddPhotoSize,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSaveLayout,
  onLoadLayout,
  onExport,
  isExporting,
  notification,
  onDismissNotification,
  onOpenDisclaimer,
}) {
  const [activeTab, setActiveTab] = useState('source');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>
          <LayoutTemplate size={24} color="var(--accent-color)" />
          Print Layout
        </h1>
        <div className="header-actions">
          <button className="icon-button" type="button" title="Undo" aria-label="Undo" disabled={!canUndo} onClick={onUndo}><Undo2 size={17} /></button>
          <button className="icon-button" type="button" title="Redo" aria-label="Redo" disabled={!canRedo} onClick={onRedo}><Redo2 size={17} /></button>
          <button className="icon-button" type="button" title="Save layout" aria-label="Save layout" onClick={onSaveLayout}><Save size={17} /></button>
          <button className="icon-button" type="button" title="Restore saved layout" aria-label="Restore saved layout" onClick={onLoadLayout}><FolderOpen size={17} /></button>
        </div>
      </div>

      <div className="sidebar-tabs">
        {TABS.map(tab => (
          <button 
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-content">
        {activeTab === 'source' && (
          <SourceImagePanel sourceImages={sourceImages} onOpenUpload={onOpenUpload} onEditCrop={onEditCrop} onRemoveSource={onRemoveSource} onAssignSourceToAll={onAssignSourceToAll} />
        )}

        {activeTab === 'settings' && (
          <LayoutSettingsPanel layout={layout} onPaperSizeChange={onPaperSizeChange} onOrientationChange={onOrientationChange} onSettingsChange={onSettingsChange} />
        )}

        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <TemplatePicker activeTemplateId={layout.activeTemplateId} unavailableTemplateIds={unavailableTemplateIds} onApplyTemplate={onApplyTemplate} />
            <div className="control-group">
              <PhotoList photos={layout.photos} sourceImages={sourceImages} targetDpi={layout.settings.exportDpi} onPhotoSourceChange={onPhotoSourceChange} onUpdateQuantity={onUpdateQuantity} onRemovePhoto={onRemovePhoto} />
              <AddPhotoSizeForm presets={PHOTO_PRESETS} onAddPhotoSize={onAddPhotoSize} />
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ExportControls isExporting={isExporting} onExport={onExport} />
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        {notification && (
          <ErrorAlert message={notification.message} variant={notification.variant} onDismiss={onDismissNotification} />
        )}
        <button 
          onClick={onOpenDisclaimer} 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
          onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          <FileWarning size={14} />
          Privacy & Terms of Use
        </button>
      </div>
    </aside>
  );
}
