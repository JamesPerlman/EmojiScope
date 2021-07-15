import { Index2D } from '../types';

export enum GridQuadrant {
  PXPY = 0,
  PY = 1,
  NXPY = 2,
  NXNY = 3,
  NY = 4,
  PXNY = 5,
  Unknown = 6,
}

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

    if (y < d(x + 1) && y < d(-x) - 1) {
      return GridQuadrant.NY;
    }

    return GridQuadrant.PXNY;
  };
})();
