const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);
const toFiniteNumber = (value, fallback) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

export const DEFAULT_CROP = {
  mode: 'cover',
  zoom: 1.1,
  positionX: 50,
  positionY: 50,
};

export function normalizeCrop(crop) {
  const mode = crop?.mode === 'contain' ? 'contain' : 'cover';

  return {
    mode,
    zoom: clamp(toFiniteNumber(crop?.zoom, DEFAULT_CROP.zoom), mode === 'cover' ? DEFAULT_CROP.zoom : 1, 3),
    positionX: clamp(toFiniteNumber(crop?.positionX, 50), 0, 100),
    positionY: clamp(toFiniteNumber(crop?.positionY, 50), 0, 100),
  };
}

export function getImageDrawRect(imageWidth, imageHeight, target, crop) {
  const normalizedCrop = normalizeCrop(crop);
  const baseScale = normalizedCrop.mode === 'contain'
    ? Math.min(target.width / imageWidth, target.height / imageHeight)
    : Math.max(target.width / imageWidth, target.height / imageHeight);
  const scale = baseScale * normalizedCrop.zoom;
  const width = imageWidth * scale;
  const height = imageHeight * scale;

  return {
    x: target.x + (target.width - width) * (normalizedCrop.positionX / 100),
    y: target.y + (target.height - height) * (normalizedCrop.positionY / 100),
    width,
    height,
  };
}