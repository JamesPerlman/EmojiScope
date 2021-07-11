import { GridDirection, Index2D } from '../types';

/**
 * Translates a point along the grid by a magnitude in a direction
 * @param {Index2D} p - The starting indices to translate from
 * @param {Direction} axis - The axis along which to move
 * @param {number} m - The magnitude along the axis to translate by
 *
 * @return {Index2D} - The resulting position after traversal
 *
 */
export const traverseGrid = (function () {
  // This little function determines a horizontal offset, which changes based on the y-value of the row we're moving from
  function dx(py: number, m: number): number {
    if (py % 2 === 0) {
      // For diagonal moves, if p.y is even we use Math.ceil...
      return Math.ceil(m / 2);
    } else {
      // ...and if p.y is odd we use Math.floor
      return Math.floor(m / 2);
    }
  }

  // The actual traverse function...
  return function (p: Index2D, direction: GridDirection, m: number): Index2D {
    switch (direction) {
      case GridDirection.NX:
        return { x: p.x - m, y: p.y };
      case GridDirection.PX:
        return { x: p.x + m, y: p.y };
      case GridDirection.NXNY:
        return { x: p.x - dx(p.y, m), y: p.y - m };
      case GridDirection.NXPY:
        return { x: p.x - dx(p.y, m), y: p.y + m };
      case GridDirection.PXNY:
        return { x: p.x + m - dx(p.y, m), y: p.y - m };
      case GridDirection.PXPY:
        return { x: p.x + m - dx(p.y, m), y: p.y + m };
    }
  };
})();


// distance is kind of the inverse of traverse.  It returns the distance between two points in an OffsetGrid if they are colinear.
// If the points are not colinear the distance function returns undefined.
// This is by design.  We only want to count the nodes in a single GridDirection.