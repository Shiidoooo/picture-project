import { getImageDrawRect } from '../utils/imageCrop';

export default function PhotoCell({ placement, source, scale, showCutGuides }) {
  const target = { x: 0, y: 0, width: placement.width * scale, height: placement.height * scale };
  const imageRect = source && getImageDrawRect(source.width, source.height, target, source.crop);

  return (
    <div
      className={`layout-photo ${showCutGuides ? 'layout-photo-guided' : ''}`}
      style={{
        left: `${placement.x * scale}px`,
        top: `${placement.y * scale}px`,
        width: `${target.width}px`,
        height: `${target.height}px`,
      }}
    >
      {source ? (
        <img src={source.url} alt="" style={{ left: `${imageRect.x}px`, top: `${imageRect.y}px`, width: `${imageRect.width}px`, height: `${imageRect.height}px` }} />
      ) : (
        <span>Assign image</span>
      )}
    </div>
  );
}