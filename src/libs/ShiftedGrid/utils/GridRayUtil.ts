import { CartesianSlope, GridDirection, GridRay, Index2D, SlopeInterceptLine } from '../types';
import { xComponentAdjustment as dx } from '../utils';
import { gridToCart } from './CartesianUtil';

// I am making factory methods instead of classes because my research and intuition both indicate that this will be more performant and efficient when these functions are run many times
// At some point I will make the time to benchmark this and see if my hypothesis is correct.

export function createGridRay(startCoord: Index2D, direction: GridDirection): GridRay {
  const { x: p1x, y: p1y } = startCoord;

  return {
    startCoord,
    direction,
    // TODO: this should be a dedicated util function, not an instance method
    contains: function ({ x: p2x, y: p2y }: Index2D): boolean {
      switch (direction) {
        case GridDirection.NX:
          return p1y === p2y && p2x <= p1x;

        case GridDirection.PX:
          return p1y === p2y && p2x >= p1x;

        case GridDirection.NXNY:
          // { p2x: p1x - dx(p1y, m), p2y: p1y - m };
          // m = p1y - p2y
          // p2x === p1x - dx(p1y, m)

          return p2x <= p1x && p2y <= p1y && p2x === p1x - dx(p1y, p1y - p2y);

        case GridDirection.NXPY:
          // { p2x: p1x - dx(p1y, m), p2y: p1y + m };
          // m = p2y - p1y
          // p2x === p1x - dx(p1y, m)

          return p2x <= p1x && p2y >= p1y && p2x === p1x - dx(p1y, p2y - p1y);

        case GridDirection.PXNY:
          // { p2x: p1x + m - dx(p1y, m), p2y: p1y - m };
          // m = p1y - p2y
          // p2x === p1x + m - dx(p1y, m)
          return p2x >= p1x && p2y <= p1y && p2x === p1x + (p1y - p2y) - dx(p1y, p1y - p2y);

        case GridDirection.PXPY:
          // { p2x: p1x + m - dx(p1y, m), p2y: p1y + m }
          // m = p2y - p1y
          // p2x === p1x + m - dx(p1y, m)

          return p2x >= p1x && p2y >= p1y && p2x === p1x + (p2y - p1y) - dx(p1y, p2y - p1y);
      }
    },
    // TODO: this should be a dedicated util function, not an instance method
    asCartLine(): SlopeInterceptLine {
      const slope = CartesianSlope[this.direction];

      const { x: cx, y: cy } = gridToCart(startCoord);

      const intercept = cy - slope * cx;

      return { slope, intercept };
    },
  };
}
