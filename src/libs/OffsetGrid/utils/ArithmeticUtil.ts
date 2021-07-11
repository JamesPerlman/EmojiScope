import { GridConstants } from '../constants';
import { GridDirection, Index2D, Point2D, subtract2D } from '../types';
import { getCartesianPosition, getCartesianDistanceBetween } from './CartesianUtil';

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

// distanceBetween is kind of the inverse of traverseGrid.  It returns the distance between two points in an OffsetGrid if they are colinear.
// If the points are not colinear the distance function returns undefined.
// This is by design.  We only want to count the nodes in a single GridDirection.

export const getGridDistanceBetween = (function () {
  // Define some convenience vars
  const EPSILON = GridConstants.epsilon;
  const distBetweenAdjacentDiagonalNodes = GridConstants.diagonallyAdjacentNodeDistance;

  return function (gridCoordA: Index2D, gridCoordB: Index2D): number | undefined {
    // Let's cover the simplest case first.
    if (gridCoordA.y === gridCoordB.y) {
      // distance between points with the same y-value is just the difference in x-value
      return Math.abs(gridCoordA.x - gridCoordB.x);
    }

    // Now that that's out of the way...

    // We can easily test if 2 points are colinear in our OffsetGrid by determining if the slope between the two points matches up with one of the cartesian versions of our GridDirections
    // We use this cartesian trick because otherwise we'd have to set up an algebraic inequality and solve for variables inside ceil and floor functions and that's pretty difficult...
    // I may take a crack at that someday...

    const cartPointA: Point2D = getCartesianPosition(gridCoordA);
    const cartPointB: Point2D = getCartesianPosition(gridCoordB);

    // Since we already covered the case where the points have the same y-value, we are just looking to see if the slope between the points is within EPSILON of ±2.0
    // If so, then we can consider the points to be colinear and calculate their distance

    const { x: dx, y: dy } = subtract2D(cartPointA, cartPointB);

    // if dx is 0 or close enough, we can return early
    if (Math.abs(dx) < EPSILON) {
      // OffsetGrid does not allow adjacent nodes to be directly above or below each other, so we return undefined by design.
      return undefined;
    }

    // Now we check if the slope is too far away from the sacred value `2.0`
    if (Math.abs(2.0 - dy / dx) > EPSILON) {
      // It's too far.  Return early, undefined. :(
      return undefined;
    }

    // If we've made it to this point, it means the points are diagonally colinear and now we need to figure out the distance between them.
    // AKA how many steps must we traverse to get from gridCoordA to gridCoordB?

    // This is a bit of a dirty hack, but basically all diagonally-adjacent grid points have a constant cartesian distance between them which is about 1.11803398875
    // So we just take the total cartesian distance and divide it by this constant value and then round it to the nearest integer.
    // It's dirty because the larger the distance, the larger the error will be.
    // But for our use case in this EmojiScope project I highly doubt we will ever come across this problem, so I'm gonna just go for it because time is of the essence.

    return Math.round(
      getCartesianDistanceBetween(cartPointA, cartPointB) / distBetweenAdjacentDiagonalNodes,
    );

    // There is absolutely a much more correct way to rewrite this entire function to be completely robust to all inputs, and perhaps someday it may be worth exploring.
  };
})();
