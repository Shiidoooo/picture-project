import { calculateLayout } from './calculateLayout.js';

export function createTemplateLayout(template, paper, settings, imageId = null) {
  const photo = template.photo;
  let quantity = 0;

  while (calculateLayout([{ ...photo, id: 1, imageId, quantity: quantity + 1 }], paper, settings).fits) {
    quantity += 1;
  }

  return quantity > 0 ? [{ ...photo, id: 1, imageId, quantity }] : [];
}