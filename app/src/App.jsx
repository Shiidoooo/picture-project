import { useEffect, useRef, useState } from 'react';
import { DEFAULT_LAYOUT } from './data/defaultLayout';
import { LAYOUT_TEMPLATES } from './data/photoPresets';
import { useLayoutHistory } from './hooks/useLayoutHistory';
import { exportPdf, exportRasterSheet } from './services/exportLayout';
import { calculateLayout, fitPhotoQuantitiesToPaper } from './utils/calculateLayout';
import { createTemplateLayout } from './utils/createTemplateLayout';
import { loadLayout, saveLayout } from './utils/layoutStorage';
import { getPaperDimensions } from './utils/paperDimensions';
import CropEditorModal from './components/CropEditorModal';
import Sidebar from './components/Sidebar';
import MainStage from './components/MainStage';
import UploadCropModal from './components/UploadCropModal';
import DisclaimerModal from './components/DisclaimerModal';

const getTemplate = (templateId) => LAYOUT_TEMPLATES.find((template) => template.id === templateId);

function App() {
  const { layout, updateLayout, undo, redo, canUndo, canRedo } = useLayoutHistory(DEFAULT_LAYOUT);
  const [sourceImages, setSourceImages] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState(null);
  const sourceImagesRef = useRef([]);

  useEffect(() => {
    sourceImagesRef.current = sourceImages;
  }, [sourceImages]);

  useEffect(() => () => {
    sourceImagesRef.current.forEach((source) => URL.revokeObjectURL(source.url));
  }, []);

  const showNotification = (message, variant = 'error') => setNotification({ message, variant });
  const paper = getPaperDimensions(layout.paperSize, layout.orientation);
  const unavailableTemplateIds = LAYOUT_TEMPLATES
    .filter((template) => !createTemplateLayout(template, paper, layout.settings).length)
    .map((template) => template.id);

  const fitLayoutToPaper = (currentLayout, changes = {}) => {
    const nextLayout = {
      ...currentLayout,
      ...changes,
      settings: changes.settings || currentLayout.settings,
    };
    const nextPaper = getPaperDimensions(nextLayout.paperSize, nextLayout.orientation);
    const template = getTemplate(nextLayout.activeTemplateId);

    if (template) {
      const imageId = currentLayout.photos[0]?.imageId || sourceImages[0]?.id || null;
      return {
        ...nextLayout,
        photos: createTemplateLayout(template, nextPaper, nextLayout.settings, imageId),
      };
    }

    if (!calculateLayout(nextLayout.photos, nextPaper, nextLayout.settings).fits) {
      return {
        ...nextLayout,
        photos: fitPhotoQuantitiesToPaper(nextLayout.photos, nextPaper, nextLayout.settings),
      };
    }

    return nextLayout;
  };

  const handlePaperSizeChange = (paperSize) => {
    updateLayout((currentLayout) => fitLayoutToPaper(currentLayout, { paperSize }));
    setNotification(null);
  };

  const handleOrientationChange = (orientation) => {
    updateLayout((currentLayout) => fitLayoutToPaper(currentLayout, { orientation }));
    setNotification(null);
  };

  const handleSettingsChange = (changes) => {
    const settings = { ...layout.settings, ...changes };

    if (!calculateLayout(layout.photos, paper, settings).fits) {
      showNotification('Those margin and spacing settings make the current layout exceed the printable area. No photos were removed.');
      return;
    }

    updateLayout({ ...layout, settings });
    setNotification(null);
  };

  const updateQuantity = (id, delta) => {
    const nextPhotos = layout.photos.map((photo) => (
      photo.id === id ? { ...photo, quantity: Math.max(0, photo.quantity + delta) } : photo
    ));

    if (delta > 0 && !calculateLayout(nextPhotos, paper, layout.settings).fits) {
      showNotification('That photo does not fit on the selected paper. Reduce another quantity or choose a larger paper.');
      return;
    }

    updateLayout({ ...layout, photos: nextPhotos, activeTemplateId: null });
    setNotification(null);
  };

  const removePhoto = (id) => {
    updateLayout({
      ...layout,
      photos: layout.photos.filter((photo) => photo.id !== id),
      activeTemplateId: null,
    });
    setNotification(null);
  };

  const assignPhotoSource = (id, imageId) => {
    updateLayout({
      ...layout,
      photos: layout.photos.map((photo) => (photo.id === id ? { ...photo, imageId } : photo)),
    });
    setNotification(null);
  };

  const assignSourceToAllPhotos = (imageId) => {
    updateLayout({
      ...layout,
      photos: layout.photos.map((photo) => ({ ...photo, imageId })),
    });
    showNotification('Source image assigned to every photo size.', 'success');
  };

  const addPhotoSize = ({ type, width, height }) => {
    const nextPhoto = {
      id: Math.max(0, ...layout.photos.map((photo) => Number(photo.id) || 0)) + 1,
      type,
      width,
      height,
      quantity: 1,
      imageId: sourceImages[0]?.id || null,
    };
    const nextPhotos = [...layout.photos, nextPhoto];

    if (!calculateLayout(nextPhotos, paper, layout.settings).fits) {
      showNotification('That photo size does not fit on the selected paper.');
      return false;
    }

    updateLayout({ ...layout, photos: nextPhotos, activeTemplateId: null });
    setNotification(null);
    return true;
  };

  const applyTemplate = (template) => {
    const photos = createTemplateLayout(template, paper, layout.settings, sourceImages[0]?.id || null);

    if (photos.length === 0) {
      showNotification('This template does not fit on the selected paper.');
      return;
    }

    updateLayout({ ...layout, photos, activeTemplateId: template.id });
    setNotification(null);
  };

  const handleUploadComplete = (newSources) => {
    setSourceImages((currentSources) => [...currentSources, ...newSources]);

    if (layout.photos.some((photo) => !photo.imageId)) {
      updateLayout({
        ...layout,
        photos: layout.photos.map((photo) => ({ ...photo, imageId: photo.imageId || newSources[0].id })),
      });
    }

    setNotification(null);
  };

  const removeSource = (sourceId) => {
    const source = sourceImages.find((imageSource) => imageSource.id === sourceId);
    if (source) URL.revokeObjectURL(source.url);

    setSourceImages((currentSources) => currentSources.filter((imageSource) => imageSource.id !== sourceId));
    updateLayout({
      ...layout,
      photos: layout.photos.map((photo) => (
        photo.imageId === sourceId ? { ...photo, imageId: null } : photo
      )),
    });
    setEditingSourceId(null);
    showNotification('The image was removed. Assign another source before exporting.', 'warning');
  };

  const saveCrop = (crop) => {
    setSourceImages((currentSources) => currentSources.map((source) => (
      source.id === editingSourceId ? { ...source, crop } : source
    )));
    setEditingSourceId(null);
    setNotification(null);
  };

  const saveCurrentLayout = () => {
    const didSave = saveLayout(layout);
    showNotification(
      didSave ? 'Layout saved in this browser.' : 'The layout could not be saved in this browser.',
      didSave ? 'success' : 'error',
    );
  };

  const restoreSavedLayout = () => {
    const savedLayout = loadLayout();

    if (!savedLayout) {
      showNotification('No saved layout was found in this browser.');
      return;
    }

    updateLayout({
      ...DEFAULT_LAYOUT,
      ...savedLayout,
      settings: { ...DEFAULT_LAYOUT.settings, ...savedLayout.settings },
      photos: savedLayout.photos.map((photo) => ({ ...photo, imageId: null })),
    });
    showNotification('Layout restored. Assign source images before exporting.', 'warning');
  };

  const exportLayout = async (format) => {
    setIsExporting(true);
    setNotification(null);

    try {
      const exportOptions = { layout, paper, sourceImages };
      if (format === 'pdf') {
        await exportPdf(exportOptions);
      } else {
        await exportRasterSheet({ ...exportOptions, format });
      }
      showNotification(`${format.toUpperCase()} export is ready.`, 'success');
    } catch (error) {
      showNotification(error.message || 'Unable to export the layout.');
    } finally {
      setIsExporting(false);
    }
  };

  const editingSource = sourceImages.find((source) => source.id === editingSourceId) || null;

  return (
    <div className="app-container">
      <Sidebar
        layout={layout}
        sourceImages={sourceImages}
        unavailableTemplateIds={unavailableTemplateIds}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onEditCrop={setEditingSourceId}
        onRemoveSource={removeSource}
        onAssignSourceToAll={assignSourceToAllPhotos}
        onPaperSizeChange={handlePaperSizeChange}
        onOrientationChange={handleOrientationChange}
        onSettingsChange={handleSettingsChange}
        onApplyTemplate={applyTemplate}
        onPhotoSourceChange={assignPhotoSource}
        onUpdateQuantity={updateQuantity}
        onRemovePhoto={removePhoto}
        onAddPhotoSize={addPhotoSize}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onSaveLayout={saveCurrentLayout}
        onLoadLayout={restoreSavedLayout}
        onExport={exportLayout}
        isExporting={isExporting}
        notification={notification}
        onDismissNotification={() => setNotification(null)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      <MainStage layout={layout} sourceImages={sourceImages} onOpenUpload={() => setIsUploadModalOpen(true)} />

      <UploadCropModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {editingSource && (
        <CropEditorModal
          key={editingSource.id}
          source={editingSource}
          onClose={() => setEditingSourceId(null)}
          onSave={saveCrop}
        />
      )}

      <DisclaimerModal 
        isOpen={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
      />
    </div>
  );
}

export default App;
