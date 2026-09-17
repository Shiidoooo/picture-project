import { DEFAULT_CROP } from './imageCrop';

const createId = () => (
  globalThis.crypto?.randomUUID?.() || `image-${Date.now()}-${Math.random().toString(16).slice(2)}`
);

const getImageDimensions = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
  image.onerror = () => reject(new Error('The selected image could not be read.'));
  image.src = url;
});

export async function createImageSources(files) {
  const sourceFiles = Array.from(files);

  return Promise.all(sourceFiles.map(async (file) => {
    const url = URL.createObjectURL(file);

    try {
      const dimensions = await getImageDimensions(url);
      return {
        id: createId(),
        name: file.name,
        url,
        ...dimensions,
        crop: DEFAULT_CROP,
      };
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
  }));
}