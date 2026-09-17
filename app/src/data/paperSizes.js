export const PAPER_SIZES = [
  { id: 'A1', label: 'A1', width: 594, height: 841, group: 'ISO A' },
  { id: 'A2', label: 'A2', width: 420, height: 594, group: 'ISO A' },
  { id: 'A3', label: 'A3', width: 297, height: 420, group: 'ISO A' },
  { id: 'A4', label: 'A4', width: 210, height: 297, group: 'ISO A' },
  { id: 'A5', label: 'A5', width: 148, height: 210, group: 'ISO A' },
  { id: 'A6', label: 'A6', width: 105, height: 148, group: 'ISO A' },
  { id: 'short-bond', label: 'Short Bond', width: 215.9, height: 279.4, group: 'Bond paper' },
  { id: 'long-bond', label: 'Long Bond', width: 215.9, height: 330.2, group: 'Bond paper' },
  { id: 'Letter', label: 'US Letter', width: 215.9, height: 279.4, group: 'US' },
  { id: 'Legal', label: 'US Legal', width: 215.9, height: 355.6, group: 'US' },
  { id: 'Tabloid', label: 'Tabloid', width: 279.4, height: 431.8, group: 'US' },
  { id: '3R', label: '3R', width: 89, height: 127, group: 'Photo paper' },
  { id: '4R', label: '4R', width: 102, height: 152, group: 'Photo paper' },
  { id: '5R', label: '5R', width: 127, height: 178, group: 'Photo paper' },
  { id: '6R', label: '6R', width: 152, height: 203, group: 'Photo paper' },
  { id: '8R', label: '8R', width: 203, height: 254, group: 'Photo paper' },
];

export const PAPER_SIZES_BY_ID = Object.fromEntries(
  PAPER_SIZES.map((paper) => [paper.id, paper]),
);

export const PAPER_SIZE_GROUPS = PAPER_SIZES.reduce((groups, paper) => {
  if (!groups[paper.group]) groups[paper.group] = [];
  groups[paper.group].push(paper);
  return groups;
}, {});