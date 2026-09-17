import { useState } from 'react';

const MAX_HISTORY_ENTRIES = 40;

export function useLayoutHistory(initialLayout) {
  const [history, setHistory] = useState({ entries: [initialLayout], index: 0 });
  const layout = history.entries[history.index];

  const updateLayout = (updater) => {
    setHistory((currentHistory) => {
      const currentLayout = currentHistory.entries[currentHistory.index];
      const nextLayout = typeof updater === 'function' ? updater(currentLayout) : updater;

      if (JSON.stringify(nextLayout) === JSON.stringify(currentLayout)) return currentHistory;

      const entries = [...currentHistory.entries.slice(0, currentHistory.index + 1), nextLayout]
        .slice(-MAX_HISTORY_ENTRIES);

      return { entries, index: entries.length - 1 };
    });
  };

  const undo = () => {
    setHistory((currentHistory) => ({
      ...currentHistory,
      index: Math.max(0, currentHistory.index - 1),
    }));
  };

  const redo = () => {
    setHistory((currentHistory) => ({
      ...currentHistory,
      index: Math.min(currentHistory.entries.length - 1, currentHistory.index + 1),
    }));
  };

  return {
    layout,
    updateLayout,
    undo,
    redo,
    canUndo: history.index > 0,
    canRedo: history.index < history.entries.length - 1,
  };
}