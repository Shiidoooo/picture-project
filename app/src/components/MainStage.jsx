import { useMemo } from 'react';
import { calculateLayout } from '../utils/calculateLayout';
import { getPaperDimensions } from '../utils/paperDimensions';
import PhotoCell from './PhotoCell';

export default function MainStage({ layout, sourceImages }) {
  const paper = getPaperDimensions(layout.paperSize, layout.orientation);
  const scale = Math.min(1.75, 560 / paper.width, 620 / paper.height);
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
          <div className="empty-stage-message">Add one or more source images to begin.</div>
        ) : calculatedLayout.placements.length === 0 ? (
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
    </main>
  );
}
