import React, { useEffect, useState } from 'react';
import { origin2D, Point2D } from '../libs';

export const useMousePosition = (function () {
  function createMouseMoveEventListener(
    setCoords: React.Dispatch<React.SetStateAction<Point2D>>,
  ): (event: MouseEvent) => void {
    return function (event: MouseEvent) {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
  }

  return function (): Point2D {
    const [coords, setCoords] = useState<Point2D>(origin2D);

    useEffect(() => {
      const mouseMoveEventListener = createMouseMoveEventListener(setCoords);

      window.addEventListener('mousemove', mouseMoveEventListener);

      return () => window.removeEventListener('mousemove', mouseMoveEventListener);
    }, []);

    return coords;
  };
})();
