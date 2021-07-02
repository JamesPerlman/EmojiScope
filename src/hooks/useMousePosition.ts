import { useState, useEffect, useCallback } from 'react';

import { Point2D } from '../types';

export const useMousePosition = (): Point2D | undefined => {
  const [coords, setCoords] = useState<Point2D | undefined>();

  const mouseMoveEventListener = useCallback((event: MouseEvent) => {
    setCoords({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', mouseMoveEventListener);

    return () => window.removeEventListener('mousemove', mouseMoveEventListener);
  });

  return coords;
};
