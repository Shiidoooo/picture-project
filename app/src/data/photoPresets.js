export const PHOTO_PRESETS = [
  { key: '1x1', type: '1\u00d71 inch', width: 25.4, height: 25.4 },
  { key: '2x2', type: '2\u00d72 inch', width: 50.8, height: 50.8 },
  { key: '1.5x1.5', type: '1.5\u00d71.5 inch', width: 38.1, height: 38.1 },
  { key: 'passport', type: 'Passport', width: 35, height: 45 },
  { key: 'wallet', type: 'Wallet Size', width: 63.5, height: 88.9 },
  { key: '3R', type: '3R Photo', width: 89, height: 127 },
  { key: '4R', type: '4R Photo', width: 102, height: 152 },
  { key: 'custom', type: 'Custom...', width: null, height: null },
];

const findPreset = (key) => PHOTO_PRESETS.find((preset) => preset.key === key);

export const LAYOUT_TEMPLATES = [
  {
    id: 'one-inch-grid',
    name: '1 x 1 Grid',
    description: 'Fill the page with 1 x 1 inch photos.',
    photo: findPreset('1x1'),
  },
  {
    id: 'one-and-half-grid',
    name: '1.5 x 1.5 Grid',
    description: 'Fill the page with 1.5 x 1.5 inch photos.',
    photo: findPreset('1.5x1.5'),
  },
  {
    id: 'two-inch-grid',
    name: '2 x 2 Grid',
    description: 'Fill the page with 2 x 2 inch photos.',
    photo: findPreset('2x2'),
  },
  {
    id: 'passport-copies',
    name: 'Passport Copies',
    description: 'Fill the page with 35 x 45 mm photos.',
    photo: findPreset('passport'),
  },
  {
    id: 'wallet-print',
    name: 'Wallet Print',
    description: 'Fill the page with wallet-size photos.',
    photo: findPreset('wallet'),
  },
];