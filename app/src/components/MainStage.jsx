import { useMemo, useState, useEffect } from 'react';
import { calculateLayout } from '../utils/calculateLayout';
import { getPaperDimensions } from '../utils/paperDimensions';
import PhotoCell from './PhotoCell';

export default function MainStage({ layout, sourceImages, onOpenUpload, isImageMinimized }) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const paper = getPaperDimensions(layout.paperSize, layout.orientation);
  const isMobile = windowSize.width <= 760;
  const maxWidth = isMobile ? windowSize.width - 32 : 560;
  const stageHeight = isImageMinimized ? (windowSize.height * 0.15) : (windowSize.height * 0.6);
  const maxHeight = isMobile ? stageHeight - 32 : 620;
  const scale = Math.min(isMobile ? 1.2 : 1.75, maxWidth / paper.width, maxHeight / paper.height);
  
  const paperWidth = paper.width * scale;
  const paperHeight = paper.height * scale;
  const calculatedLayout = useMemo(
    () => calculateLayout(layout.photos, paper, layout.settings),
    [layout.photos, layout.settings, paper],
  );
  const sourcesById = new Map(sourceImages.map((source) => [source.id, source]));
  const margin = layout.settings.margin * scale;

  return (
    <main className="main-stage">
      <div className="canvas-wrapper" style={{ width: `${paperWidth}px`, height: `${paperHeight}px` }}>
        {sourceImages.length === 0 ? (
          <div className="empty-stage-message">{!isImageMinimized && "Please add an image from the sidebar to begin."}</div>
        ) : calculatedLayout.placements.length === 0 ? (
          <div className="empty-stage-message">{!isImageMinimized && "Increase at least one quantity to see the layout."}</div>
        ) : !calculatedLayout.fits ? (
          <div className="empty-stage-message is-error">{!isImageMinimized && "The current layout does not fit on this paper."}</div>
        ) : (
          <>
            {layout.settings.showMarginGuide && (
              <div className="margin-guide" style={{ left: `${margin}px`, top: `${margin}px`, width: `${paperWidth - (margin * 2)}px`, height: `${paperHeight - (margin * 2)}px` }} />
            )}
            {calculatedLayout.placements.map((box, i) => (
              <PhotoCell
                key={`${box.photoId}-${i}`}
                placement={box}
                source={sourcesById.get(box.imageId)}
                scale={scale}
                showCutGuides={layout.settings.showCutGuides}
              />
            ))}
          </>
        )}
      </div>
    </main>
  );
}
