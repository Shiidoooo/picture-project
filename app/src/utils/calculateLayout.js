export function calculateLayout(photos, paper, { spacing = 2, margin = 0 } = {}) {
  if (!paper) return { fits: false, placements: [] };

  const normalizedSpacing = Math.max(0, Number(spacing) || 0);
  const normalizedMargin = Math.max(0, Number(margin) || 0);
  const printableWidth = paper.width - (normalizedMargin * 2);
  const printableHeight = paper.height - (normalizedMargin * 2);

  if (printableWidth <= 0 || printableHeight <= 0) return { fits: false, placements: [] };

  // Group individual photo copies by their dimensions for organized row placement
  const sizeGroupMap = new Map();
  let expectedTotal = 0;

  for (const photo of photos) {
    const quantity = Math.max(0, Number(photo.quantity) || 0);
    const width = Number(photo.width);
    const height = Number(photo.height);
    expectedTotal += quantity;

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      if (quantity > 0) return { fits: false, placements: [] };
      continue;
    }

    const sizeKey = `${width}x${height}`;
    if (!sizeGroupMap.has(sizeKey)) {
      sizeGroupMap.set(sizeKey, { width, height, items: [] });
    }

    const group = sizeGroupMap.get(sizeKey);
    for (let i = 0; i < quantity; i++) {
      group.items.push({ photoId: photo.id, imageId: photo.imageId });
    }
  }

  // Sort groups by area descending — largest photos first for visual hierarchy
  const sizeGroups = Array.from(sizeGroupMap.values())
    .filter((group) => group.items.length > 0)
    .sort((a, b) => {
      const areaDiff = (b.width * b.height) - (a.width * a.height);
      if (areaDiff !== 0) return areaDiff;
      return Math.max(b.width, b.height) - Math.max(a.width, a.height);
    });

  // Available space includes one trailing spacing unit (the last item in each
  // row/column doesn't need trailing space, so the effective area is slightly
  // larger than the raw printable area — same convention as the original layout).
  const availableWidth = printableWidth + normalizedSpacing;
  const availableHeight = printableHeight + normalizedSpacing;
  const placements = [];
  let currentY = normalizedMargin;

  for (const group of sizeGroups) {
    const paddedWidth = group.width + normalizedSpacing;
    const paddedHeight = group.height + normalizedSpacing;

    const maxPerRow = Math.floor(availableWidth / paddedWidth);
    if (maxPerRow <= 0) return { fits: false, placements };

    let itemIndex = 0;

    while (itemIndex < group.items.length) {
      // Vertical overflow check — the photo itself must fit within the printable area
      if (currentY + group.height > normalizedMargin + printableHeight + 0.01) {
        return { fits: false, placements };
      }

      const rowCount = Math.min(maxPerRow, group.items.length - itemIndex);
      let currentX = normalizedMargin;

      for (let col = 0; col < rowCount; col++) {
        const item = group.items[itemIndex + col];
        placements.push({
          x: currentX,
          y: currentY,
          width: group.width,
          height: group.height,
          photoId: item.photoId,
          imageId: item.imageId,
        });
        currentX += paddedWidth;
      }

      itemIndex += rowCount;
      currentY += paddedHeight;
    }
  }

  // Verify every requested photo was placed
  if (placements.length !== expectedTotal) {
    return { fits: false, placements };
  }

  return { fits: true, placements };
}

export function fitPhotoQuantitiesToPaper(photos, paper, settings) {
  const fittedPhotos = photos.map((photo) => ({ ...photo, quantity: 0 }));

  photos.forEach((photo, index) => {
    const maximumQuantity = Math.max(0, Number(photo.quantity) || 0);

    while (fittedPhotos[index].quantity < maximumQuantity) {
      const nextPhotos = fittedPhotos.map((fittedPhoto, fittedIndex) => (
        fittedIndex === index
          ? { ...fittedPhoto, quantity: fittedPhoto.quantity + 1 }
          : fittedPhoto
      ));

      if (!calculateLayout(nextPhotos, paper, settings).fits) break;
      fittedPhotos[index].quantity += 1;
    }
  });

  return fittedPhotos;
}