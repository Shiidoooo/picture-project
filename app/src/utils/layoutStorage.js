const STORAGE_KEY = 'picture-project-layout';

export function saveLayout(layout) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    return true;
  } catch {
    return false;
  }
}

export function loadLayout() {
  try {
    const savedLayout = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return savedLayout && Array.isArray(savedLayout.photos) ? savedLayout : null;
  } catch {
    return null;
  }
}