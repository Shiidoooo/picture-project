import { describe, test, expect } from 'vitest';
import { normalizeCrop, getImageDrawRect } from '../../src/utils/imageCrop';

describe('Marvin Exhaustive Tests: normalizeCrop', () => {
  // TEST MATRIX: mode and zoom boundaries
  // Rule 1: Exhaustive coverage via truth table parameterization
  const zoomTestCases = [
    // cover mode boundaries [1.1, 3]
    { mode: 'cover', zoom: undefined, expectedMode: 'cover', expectedZoom: 1.1 },
    { mode: 'cover', zoom: 0, expectedMode: 'cover', expectedZoom: 1.1 },
    { mode: 'cover', zoom: 1.0, expectedMode: 'cover', expectedZoom: 1.1 },
    { mode: 'cover', zoom: 1.1, expectedMode: 'cover', expectedZoom: 1.1 },
    { mode: 'cover', zoom: 2, expectedMode: 'cover', expectedZoom: 2 },
    { mode: 'cover', zoom: 3, expectedMode: 'cover', expectedZoom: 3 },
    { mode: 'cover', zoom: 3.1, expectedMode: 'cover', expectedZoom: 3 },
    { mode: 'cover', zoom: 999, expectedMode: 'cover', expectedZoom: 3 },
    { mode: 'cover', zoom: NaN, expectedMode: 'cover', expectedZoom: 1.1 },

    // contain mode boundaries [1, 3]
    { mode: 'contain', zoom: undefined, expectedMode: 'contain', expectedZoom: 1.1 },
    { mode: 'contain', zoom: 0, expectedMode: 'contain', expectedZoom: 1 },
    { mode: 'contain', zoom: 0.9, expectedMode: 'contain', expectedZoom: 1 },
    { mode: 'contain', zoom: 1, expectedMode: 'contain', expectedZoom: 1 },
    { mode: 'contain', zoom: 2, expectedMode: 'contain', expectedZoom: 2 },
    { mode: 'contain', zoom: 3, expectedMode: 'contain', expectedZoom: 3 },
    { mode: 'contain', zoom: 3.1, expectedMode: 'contain', expectedZoom: 3 },
    { mode: 'contain', zoom: NaN, expectedMode: 'contain', expectedZoom: 1.1 },

    // invalid mode fallbacks
    { mode: 'gibberish', zoom: 2, expectedMode: 'cover', expectedZoom: 2 },
    { mode: null, zoom: 2, expectedMode: 'cover', expectedZoom: 2 },
  ];

  test.each(zoomTestCases)(
    'Given Input - Mode: $mode, Zoom: $zoom | Expected Output - Mode: $expectedMode, Zoom: $expectedZoom',
    ({ mode, zoom, expectedMode, expectedZoom }) => {
      // Arrange (AAA Pattern)
      const input = { mode, zoom, positionX: 50, positionY: 50 };

      // Act
      const result = normalizeCrop(input);

      // Assert
      expect(result.mode).toBe(expectedMode);
      expect(result.zoom).toBe(expectedZoom);
    }
  );

  // TEST MATRIX: position boundaries
  const positionTestCases = [
    { posX: -50, posY: -50, expectedX: 0, expectedY: 0 },
    { posX: -1, posY: -1, expectedX: 0, expectedY: 0 },
    { posX: 0, posY: 0, expectedX: 0, expectedY: 0 },
    { posX: 50, posY: 50, expectedX: 50, expectedY: 50 },
    { posX: 100, posY: 100, expectedX: 100, expectedY: 100 },
    { posX: 101, posY: 101, expectedX: 100, expectedY: 100 },
    { posX: 999, posY: 999, expectedX: 100, expectedY: 100 },
    { posX: NaN, posY: undefined, expectedX: 50, expectedY: 50 },
  ];

  test.each(positionTestCases)(
    'Given Input - PosX: $posX, PosY: $posY | Expected Output - PosX: $expectedX, PosY: $expectedY',
    ({ posX, posY, expectedX, expectedY }) => {
      // Arrange
      const input = { mode: 'cover', zoom: 1.1, positionX: posX, positionY: posY };

      // Act
      const result = normalizeCrop(input);

      // Assert
      expect(result.positionX).toBe(expectedX);
      expect(result.positionY).toBe(expectedY);
    }
  );
});

describe('Marvin Exhaustive Tests: getImageDrawRect', () => {
    const rectTestCases = [
        { 
            desc: "Image matches target",
            imageWidth: 100, imageHeight: 100, target: {x: 0, y: 0, width: 100, height: 100}, crop: {mode: 'cover', zoom: 1, positionX: 50, positionY: 50},
        },
        { 
            desc: "Image is wider than target",
            imageWidth: 200, imageHeight: 100, target: {x: 0, y: 0, width: 100, height: 100}, crop: {mode: 'cover', zoom: 1.1, positionX: 50, positionY: 50},
        },
        { 
            desc: "Image is taller than target",
            imageWidth: 100, imageHeight: 200, target: {x: 0, y: 0, width: 100, height: 100}, crop: {mode: 'contain', zoom: 1, positionX: 50, positionY: 50},
        }
    ];

    test.each(rectTestCases)(
        'Given Input - $desc',
        ({ imageWidth, imageHeight, target, crop }) => {
            // Arrange & Act
            const result = getImageDrawRect(imageWidth, imageHeight, target, crop);
            // Assert
            expect(result).toBeDefined();
            expect(typeof result.x).toBe('number');
            expect(typeof result.y).toBe('number');
            expect(typeof result.width).toBe('number');
            expect(typeof result.height).toBe('number');
            expect(Number.isNaN(result.x)).toBe(false);
            expect(Number.isNaN(result.width)).toBe(false);
        }
    );
});
