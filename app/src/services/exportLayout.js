import { jsPDF } from 'jspdf';
import { calculateLayout } from '../utils/calculateLayout';
import { getImageDrawRect } from '../utils/imageCrop';

const MM_PER_INCH = 25.4;
const MAX_RASTER_PIXELS = 80_000_000;

const loadImage = (source) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error(`Could not load ${source.name || 'an assigned image'} for export.`));
  image.src = source.url;
});

const getExportLayout = (layout, paper, sourceImages) => {
  const calculatedLayout = calculateLayout(layout.photos, paper, layout.settings);

  if (!calculatedLayout.fits) {
    throw new Error('The current photo quantities do not fit on this paper size.');
  }

  if (calculatedLayout.placements.length === 0) {
    throw new Error('Increase at least one photo quantity before exporting.');
  }

  const sourcesById = new Map(sourceImages.map((source) => [source.id, source]));
  const unassignedPlacement = calculatedLayout.placements.find(({ imageId }) => !sourcesById.has(imageId));

  if (unassignedPlacement) {
    throw new Error('Assign an image to every photo size before exporting.');
  }

  return { placements: calculatedLayout.placements, sourcesById };
};

const drawCutMarks = (drawLine, placements, distance) => {
  const markLength = 2.5 * distance;
  const gap = 0.4 * distance;

  placements.forEach((placement) => {
    const left = placement.x * distance;
    const top = placement.y * distance;
    const right = (placement.x + placement.width) * distance;
    const bottom = (placement.y + placement.height) * distance;

    drawLine(left - markLength, top, left - gap, top);
    drawLine(left, top - markLength, left, top - gap);
    drawLine(right + gap, top, right + markLength, top);
    drawLine(right, top - markLength, right, top - gap);
    drawLine(left - markLength, bottom, left - gap, bottom);
    drawLine(left, bottom + gap, left, bottom + markLength);
    drawLine(right + gap, bottom, right + markLength, bottom);
    drawLine(right, bottom + gap, right, bottom + markLength);
  });
};

const drawRasterPhoto = (context, image, placement, crop, pixelsPerMm) => {
  const target = {
    x: placement.x * pixelsPerMm,
    y: placement.y * pixelsPerMm,
    width: placement.width * pixelsPerMm,
    height: placement.height * pixelsPerMm,
  };
  const imageRect = getImageDrawRect(image.naturalWidth, image.naturalHeight, target, crop);

  context.save();
  context.beginPath();
  context.rect(target.x, target.y, target.width, target.height);
  context.clip();
  context.drawImage(image, imageRect.x, imageRect.y, imageRect.width, imageRect.height);
  context.restore();
};

const createRasterSheet = async ({ layout, paper, sourceImages }) => {
  const pixelsPerMm = layout.settings.exportDpi / MM_PER_INCH;
  const width = Math.round(paper.width * pixelsPerMm);
  const height = Math.round(paper.height * pixelsPerMm);

  if (width * height > MAX_RASTER_PIXELS) {
    throw new Error('This paper size is too large for a raster export at the selected DPI. Choose 150 DPI or export PDF.');
  }

  const { placements, sourcesById } = getExportLayout(layout, paper, sourceImages);
  const imagesBySourceId = new Map(await Promise.all(sourceImages.map(async (source) => [source.id, await loadImage(source)])));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);

  placements.forEach((placement) => {
    const source = sourcesById.get(placement.imageId);
    drawRasterPhoto(context, imagesBySourceId.get(source.id), placement, source.crop, pixelsPerMm);
  });

  if (layout.settings.showMarginGuide) {
    const margin = layout.settings.margin * pixelsPerMm;
    context.strokeStyle = '#64748b';
    context.lineWidth = Math.max(1, pixelsPerMm * 0.15);
    context.setLineDash([pixelsPerMm, pixelsPerMm]);
    context.strokeRect(margin, margin, width - (margin * 2), height - (margin * 2));
    context.setLineDash([]);
  }

  if (layout.settings.showCutGuides) {
    context.strokeStyle = '#334155';
    context.lineWidth = Math.max(1, pixelsPerMm * 0.15);
    drawCutMarks((x1, y1, x2, y2) => {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }, placements, pixelsPerMm);
  }

  return canvas;
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export async function exportPdf({ layout, paper, sourceImages }) {
  const canvas = await createRasterSheet({ layout, paper, sourceImages });
  const pdf = new jsPDF({
    orientation: paper.width > paper.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [paper.width, paper.height],
    compress: true,
  });

  pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, paper.width, paper.height);

  pdf.save(`photo-layout-${layout.paperSize.toLowerCase()}.pdf`);
}

export async function exportRasterSheet({ format, layout, paper, sourceImages }) {
  const canvas = await createRasterSheet({ layout, paper, sourceImages });
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const quality = format === 'jpeg' ? 0.95 : undefined;

  await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('The image sheet could not be created.'));
        return;
      }

      downloadBlob(blob, `photo-layout-${layout.paperSize.toLowerCase()}.${extension}`);
      resolve();
    }, mimeType, quality);
  });
}