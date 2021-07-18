import { GridConstants } from '../constants';
import { GridDirection, Index2D, Point2D, subtract2D } from '../types';
import { gridToCart, getCartesianDistance } from './CartesianUtil';

const { EPSILON, diagonallyAdjacentNodeDistance } = GridConstants;

// This is a helper function which 'corrects' the x value of the point being traversed to, depending on the y value of the point being traversed from
export function xComponentAdjustment(fromPointY: number, traversalMagnitude: number): number {
  if (fromPointY % 2 === 0) {
    // For diagonal moves, if fromPointY is even we use Math.ceil...
    return Math.ceil(traversalMagnitude / 2);
  } else {
    // ...and if fromPointY is odd we use Math.floor
    return Math.floor(traversalMagnitude / 2);
  }
}

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
  const dx = xComponentAdjustment;

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

// distanceBetween is kind of the inverse of traverseGrid.  It returns the distance between two points in an ShiftedGrid if they are colinear.
// If the points are not colinear the distance function returns undefined.
// This is by design.  We only want to count the nodes in a single GridDirection.

export function getGridDistanceBetween(
  gridCoordA: Index2D,
  gridCoordB: Index2D,
): number | undefined {
  // Let's cover the simplest case first.
  if (Math.abs(gridCoordA.y - gridCoordB.y) < EPSILON) {
    // distance between points with the same y-value is just the difference in x-value
    return Math.abs(gridCoordA.x - gridCoordB.x);
  }

  // Now that that's out of the way...

  // We can easily test if 2 points are colinear in our ShiftedGrid by determining if the slope between the two points matches up with one of the cartesian versions of our GridDirections
  // We use this cartesian trick because otherwise we'd have to set up an algebraic inequality and solve for variables inside ceil and floor functions and that's pretty difficult...
  // I may take a crack at that someday...

  const cartPointA: Point2D = gridToCart(gridCoordA);
  const cartPointB: Point2D = gridToCart(gridCoordB);

  // Since we already covered the case where the points have the same y-value, we are just looking to see if the slope between the points is within EPSILON of ±2.0
  // If so, then we can consider the points to be colinear and calculate their distance

  const { x: dx, y: dy } = subtract2D(cartPointA, cartPointB);

  // if dx is 0 or close enough, we can return early
  if (Math.abs(dx) < EPSILON) {
    // ShiftedGrid does not allow adjacent nodes to be directly above or below each other, so we return undefined by design.
    return undefined;
  }

  // Now we check if the slope is too far away from the sacred values ±2.0
  if (Math.abs(2.0 - Math.abs(dy / dx)) > EPSILON) {
    // It's too far.  Return early, undefined. :(
    return undefined;
  }

  // If we've made it to this point, it means the points are diagonally colinear and now we need to figure out the distance between them.
  // AKA how many steps must we traverse to get from gridCoordA to gridCoordB?

  // This is a bit of a dirty hack, but basically all diagonally-adjacent grid points have a constant cartesian distance between them which is about 1.11803398875
  // So we just take the total cartesian distance and divide it by this constant value and then round it to the nearest integer.
  // It's dirty because the larger the distance, the larger the error will be.
  // But for our use case in this EmojiScope project I highly doubt we will ever come across this problem, so I'm gonna just go for it because time is of the essence.

  return Math.round(getCartesianDistance(cartPointA, cartPointB) / diagonallyAdjacentNodeDistance);

  // There is absolutely a much more correct way to rewrite this entire function to be completely robust to all inputs, and perhaps someday it may be worth exploring.
}

/**
 * This is just a cut-down version of the above function getGridDistanceBetween where instead of returning a distance we just want to know if two points are colinear
 */

export function areGridCoordsColinear(gridCoordA: Index2D, gridCoordB: Index2D): boolean {
  // Let's cover the simplest case first.
  if (Math.abs(gridCoordA.y - gridCoordB.y) < EPSILON) {
    // coords with same y-value are always colinear
    return true;
  }

  const cartPointA: Point2D = gridToCart(gridCoordA);
  const cartPointB: Point2D = gridToCart(gridCoordB);

  // Since we already covered the case where the points have the same y-value, we are just looking to see if the slope between the points is within EPSILON of ±2.0
  // If so, then we can consider the points to be colinear and calculate their distance

  const { x: dx, y: dy } = subtract2D(cartPointA, cartPointB);

  if (Math.abs(dx) < EPSILON) {
    // if dx is close enough to 0 so the coords aren't colinear because ShiftedGrid does not allow adjacent nodes to be directly above or below each other
    return false;
  }

  if (Math.abs(2.0 - Math.abs(dy / dx)) > EPSILON) {
    // Slope is not close enough to ±2 to be colinear
    return false;
  }

  // If we've made it here, we can safely assume the coords are colinear
  return true;
}

/**
 * This function checks to see if coord p is within a rectangular area formed by coords a and b
 */

export function isCoordBetween(p: Index2D, a: Index2D, b: Index2D) {
  const xMin = Math.min(a.x, b.x);
  const xMax = Math.max(a.x, b.x);
  const yMin = Math.min(a.y, b.y);
  const yMax = Math.max(a.y, b.y);

  return (p.x >= xMin) && (p.x <= xMax) && (p.y >= yMin) && (p.y <= yMax);
}

/**
 * @description In cases where we are 100% sure that getGridDistanceBetween will always return a number,*
 *  here is a convenience function that returns 0 instead of undefined so the return type is always number.
 * Only use it if you're 100% confident that it won't return 0 (unless the input points are the same)...
 * ...because it WILL HIDE LOGIC BUGS\
 *
 * Please, please, please... use it wisely.
 * @param {Index2D} gridCoordA
 * @param {Inndex2D} gridCoordB
 * @return {number} a number representing the distance between gridCoordA and gridCoordB, or potentially just 0 if something went wrong
 */
export function unreliableGridDistanceBetween(gridCoordA: Index2D, gridCoordB: Index2D): number {
  return getGridDistanceBetween(gridCoordA, gridCoordB) ?? 0;
}
