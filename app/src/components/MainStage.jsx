import { useMemo, useState, useEffect } from 'react';
import { ImagePlus } from 'lucide-react';
import { calculateLayout } from '../utils/calculateLayout';
import { getPaperDimensions } from '../utils/paperDimensions';
import PhotoCell from './PhotoCell';

export default function MainStage({ layout, sourceImages, onOpenUpload }) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const paper = getPaperDimensions(layout.paperSize, layout.orientation);
  const isMobile = windowSize.width <= 760;
  const maxWidth = isMobile ? windowSize.width - 32 : 560;
  const maxHeight = isMobile ? (windowSize.height * 0.6) - 32 : 620;
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
      {sourceImages.length === 0 ? (
        <div className="empty-stage-message" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <button className="btn" onClick={onOpenUpload} style={{ fontSize: '1.1rem', padding: '16px 32px', borderRadius: '12px', width: 'auto', background: 'var(--accent-color)', whiteSpace: 'nowrap' }}>
            <ImagePlus size={22} style={{ marginRight: '8px' }} />
            Upload Image to Start
          </button>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '300px', textAlign: 'center', fontWeight: 400 }}>
            Upload a portrait photo. You can crop it and arrange multiple copies on this sheet.
          </p>
        </div>
      ) : (
        <div className="canvas-wrapper" style={{ width: `${paperWidth}px`, height: `${paperHeight}px` }}>
          {calculatedLayout.placements.length === 0 ? (
            <div className="empty-stage-message">Increase at least one quantity to see the layout.</div>
          ) : !calculatedLayout.fits ? (
            <div className="empty-stage-message is-error">The current layout does not fit on this paper.</div>
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
      )}
    </main>
  );
}
