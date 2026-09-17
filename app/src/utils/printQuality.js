export function getPrintQuality(photo, source, targetDpi) {
  if (!source?.width || !source?.height) return null;

  const widthInches = photo.width / 25.4;
  const heightInches = photo.height / 25.4;
  const availableDpi = Math.floor(Math.min(source.width / widthInches, source.height / heightInches));

  if (availableDpi >= targetDpi) {
    return { level: 'good', dpi: availableDpi, label: `${availableDpi} DPI` };
  }

  if (availableDpi >= 150) {
    return { level: 'fair', dpi: availableDpi, label: `${availableDpi} DPI` };
  }

  return { level: 'low', dpi: availableDpi, label: `${availableDpi} DPI` };
}