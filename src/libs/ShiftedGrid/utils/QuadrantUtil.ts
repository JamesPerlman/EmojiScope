import { GridQuadrant, Index2D } from '../types';

export const getGridQuadrant = (function () {
  function d(t: number) {
    return Math.ceil(2 * t);
  }

  return function ({ x, y }: Index2D): GridQuadrant {
    if (y < d(x) && y >= 0) {
      return GridQuadrant.PXPY;
    }

    if (y > d(-x) && y >= 0) {
      return GridQuadrant.PY;
    }

    if (y <= d(-x) && y > 0) {
      return GridQuadrant.NXPY;
    }

    if (y >= d(x + 1) && y <= 0) {
      return GridQuadrant.NXNY;
    }

    if (y < d(x + 2) && y < d(1 - x) - 1) {
      return GridQuadrant.NY;
    }

    return GridQuadrant.PXNY;
  };
})();
