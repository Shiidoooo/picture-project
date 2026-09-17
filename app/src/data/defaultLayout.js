export const DEFAULT_LAYOUT_SETTINGS = {
  margin: 5,
  spacing: 2,
  showCutGuides: false,
  showMarginGuide: false,
  exportDpi: 300,
};

export const DEFAULT_LAYOUT = {
  paperSize: 'A4',
  orientation: 'portrait',
  activeTemplateId: null,
  settings: DEFAULT_LAYOUT_SETTINGS,
  photos: [
    { id: 1, type: '2x2 inch', width: 50.8, height: 50.8, quantity: 6, imageId: null },
  ],
};