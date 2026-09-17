export function calculateLayout(photos, paper, { spacing = 2, margin = 0 } = {}) {
  if (!paper) return { fits: false, placements: [] };

  const normalizedSpacing = Math.max(0, Number(spacing) || 0);
  const normalizedMargin = Math.max(0, Number(margin) || 0);
  const printableWidth = paper.width - (normalizedMargin * 2);
  const printableHeight = paper.height - (normalizedMargin * 2);

  if (printableWidth <= 0 || printableHeight <= 0) return { fits: false, placements: [] };

  const photosToPlace = [];
  const freeRectangles = [{
    x: normalizedMargin,
    y: normalizedMargin,
    width: printableWidth + normalizedSpacing,
    height: printableHeight + normalizedSpacing,
  }];
  const placements = [];

  photos.forEach((photo, photoIndex) => {
    const quantity = Math.max(0, Number(photo.quantity) || 0);
    const width = Number(photo.width);
    const height = Number(photo.height);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return;
    }

    for (let index = 0; index < quantity; index += 1) {
      photosToPlace.push({ width, height, photoIndex, index });
    }
  });

  if (photosToPlace.length !== photos.reduce((total, photo) => total + Math.max(0, Number(photo.quantity) || 0), 0)) {
    return { fits: false, placements };
  }

  photosToPlace.sort((firstPhoto, secondPhoto) => {
    const areaDifference = (secondPhoto.width * secondPhoto.height) - (firstPhoto.width * firstPhoto.height);
    if (areaDifference !== 0) return areaDifference;

    const longestSideDifference = Math.max(secondPhoto.width, secondPhoto.height) - Math.max(firstPhoto.width, firstPhoto.height);
    if (longestSideDifference !== 0) return longestSideDifference;

    return firstPhoto.photoIndex - secondPhoto.photoIndex || firstPhoto.index - secondPhoto.index;
  });

  for (const photo of photosToPlace) {
    const paddedWidth = photo.width + normalizedSpacing;
    const paddedHeight = photo.height + normalizedSpacing;
    let bestRectangleIndex = -1;
    let bestShortSideFit = Number.POSITIVE_INFINITY;
    let bestLongSideFit = Number.POSITIVE_INFINITY;

    freeRectangles.forEach((rectangle, rectangleIndex) => {
      if (paddedWidth > rectangle.width || paddedHeight > rectangle.height) return;

      const leftoverWidth = rectangle.width - paddedWidth;
      const leftoverHeight = rectangle.height - paddedHeight;
      const shortSideFit = Math.min(leftoverWidth, leftoverHeight);
      const longSideFit = Math.max(leftoverWidth, leftoverHeight);
      const isBetterFit = shortSideFit < bestShortSideFit
        || (shortSideFit === bestShortSideFit && longSideFit < bestLongSideFit);

      if (isBetterFit) {
        bestRectangleIndex = rectangleIndex;
        bestShortSideFit = shortSideFit;
        bestLongSideFit = longSideFit;
      }
    });

    if (bestRectangleIndex === -1) {
      return { fits: false, placements };
    }

    const bestRectangle = freeRectangles[bestRectangleIndex];
    const usedRectangle = {
      x: bestRectangle.x,
      y: bestRectangle.y,
      width: paddedWidth,
      height: paddedHeight,
    };

    placements.push({
      x: usedRectangle.x,
      y: usedRectangle.y,
      width: photo.width,
      height: photo.height,
      photoId: photos[photo.photoIndex].id,
      imageId: photos[photo.photoIndex].imageId,
    });

    const splitRectangles = [];
    freeRectangles.forEach((rectangle) => {
      const intersects = usedRectangle.x < rectangle.x + rectangle.width
        && usedRectangle.x + usedRectangle.width > rectangle.x
        && usedRectangle.y < rectangle.y + rectangle.height
        && usedRectangle.y + usedRectangle.height > rectangle.y;

      if (!intersects) {
        splitRectangles.push(rectangle);
        return;
      }

      if (usedRectangle.x > rectangle.x) {
        splitRectangles.push({
          x: rectangle.x,
          y: rectangle.y,
          width: usedRectangle.x - rectangle.x,
          height: rectangle.height,
        });
      }

      if (usedRectangle.x + usedRectangle.width < rectangle.x + rectangle.width) {
        splitRectangles.push({
          x: usedRectangle.x + usedRectangle.width,
          y: rectangle.y,
          width: rectangle.x + rectangle.width - (usedRectangle.x + usedRectangle.width),
          height: rectangle.height,
        });
      }

      if (usedRectangle.y > rectangle.y) {
        splitRectangles.push({
          x: rectangle.x,
          y: rectangle.y,
          width: rectangle.width,
          height: usedRectangle.y - rectangle.y,
        });
      }

      if (usedRectangle.y + usedRectangle.height < rectangle.y + rectangle.height) {
        splitRectangles.push({
          x: rectangle.x,
          y: usedRectangle.y + usedRectangle.height,
          width: rectangle.width,
          height: rectangle.y + rectangle.height - (usedRectangle.y + usedRectangle.height),
        });
      }
    });

    const remainingRectangles = splitRectangles.filter((rectangle, rectangleIndex) => (
      rectangle.width > 0
      && rectangle.height > 0
      && !splitRectangles.some((otherRectangle, otherRectangleIndex) => (
        rectangleIndex !== otherRectangleIndex
        && rectangle.x >= otherRectangle.x
        && rectangle.y >= otherRectangle.y
        && rectangle.x + rectangle.width <= otherRectangle.x + otherRectangle.width
        && rectangle.y + rectangle.height <= otherRectangle.y + otherRectangle.height
      ))
    ));

    freeRectangles.splice(0, freeRectangles.length, ...remainingRectangles);
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