import { PAPER_SIZES_BY_ID } from '../data/paperSizes.js';

export function getPaperDimensions(paperSize, orientation = 'portrait') {
  const paper = PAPER_SIZES_BY_ID[paperSize] || PAPER_SIZES_BY_ID.A4;
  const isLandscape = orientation === 'landscape';

  return isLandscape
    ? { ...paper, width: paper.height, height: paper.width }
    : paper;
}