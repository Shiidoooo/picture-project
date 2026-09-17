import { FolderOpen, LayoutTemplate, Redo2, Save, Undo2 } from 'lucide-react';
import { PHOTO_PRESETS } from '../data/photoPresets';
import AddPhotoSizeForm from './AddPhotoSizeForm';
import ErrorAlert from './ErrorAlert';
import ExportControls from './ExportControls';
import LayoutSettingsPanel from './LayoutSettingsPanel';
import PhotoList from './PhotoList';
import SourceImagePanel from './SourceImagePanel';
import TemplatePicker from './TemplatePicker';

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
}) {
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

      <div className="sidebar-content">
        <SourceImagePanel sourceImages={sourceImages} onOpenUpload={onOpenUpload} onEditCrop={onEditCrop} onRemoveSource={onRemoveSource} onAssignSourceToAll={onAssignSourceToAll} />
        <LayoutSettingsPanel layout={layout} onPaperSizeChange={onPaperSizeChange} onOrientationChange={onOrientationChange} onSettingsChange={onSettingsChange} />
        <TemplatePicker activeTemplateId={layout.activeTemplateId} unavailableTemplateIds={unavailableTemplateIds} onApplyTemplate={onApplyTemplate} />
        <div className="control-group">
          <h2 className="section-title">
            <LayoutTemplate size={16} />
            Photo Quantities
          </h2>
          <PhotoList photos={layout.photos} sourceImages={sourceImages} targetDpi={layout.settings.exportDpi} onPhotoSourceChange={onPhotoSourceChange} onUpdateQuantity={onUpdateQuantity} onRemovePhoto={onRemovePhoto} />
          <AddPhotoSizeForm presets={PHOTO_PRESETS} onAddPhotoSize={onAddPhotoSize} />
        </div>
      </div>

      <div className="sidebar-footer">
        <ErrorAlert message={notification?.message} variant={notification?.variant} onDismiss={onDismissNotification} />
        <ExportControls isExporting={isExporting} onExport={onExport} />
      </div>
    </aside>
  );
}
