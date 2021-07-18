import { GridConstants } from '../constants';
import {
  CornerDirectionForQuadrant,
  GridDirection,
  GridQuadrant,
  Index2D,
  IntersectorDirectionForQuadrant,
  origin2D,
  Point2D,
  Scale2D,
  ShiftedGrid,
  subtract2D,
} from '../types';
import { cartToGrid, getCartesianDistance, gridToCart } from './CartesianUtil';
import { createGridRay } from './GridRayUtil';
import { getLineIntersection } from './LineUtil';
import { getGridQuadrant } from './QuadrantUtil';
import {
  getFirstNodeIndexInRing,
  getLeadingRingCorner,
  getRingCornerCoord,
  getRingCornerIndex,
  getRingCornerOfCornerCoord,
  getRingCornerSubIndex,
  getRingIndex,
} from './RingUtil';

const { EPSILON, diagonallyAdjacentNodeDistance } = GridConstants;

/**
 * @name xComponentAdjustment
 * @description This is a helper function which 'corrects' the x value of the point being traversed to, depending on the y-value of the point being traversed from
 * @param {number} fromPointY - The y-value of the point being traversed from
 * @param {number} traversalMagnitude - The distance over which we are traversing
 * @return {number}
 */
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
 * @name GridUtil
 * @description - A collection of helper functions for working with a ShiftedGrid
 */

export const GridUtil = (function () {
  /**
   * @name createShiftedGrid
   * @description Creates a ShiftedGrid object
   *
   * @param {number} itemRadius - The radius of each item in the grid
   * @param {number} itemSpacing - The spacing between two adjacent items in the grid
   * @param {Point2D} offsetXY - The offset of the grid center
   * @param {Scale2D} stretchXY - Scaling factors for the grid axes
   *
   * @return {ShiftedGrid}
   */

  const createShiftedGrid = (function () {
    const defaultStretchXY: Scale2D = { x: 1.0, y: GridConstants.yAxisCompression };
    const origin: Point2D = { x: 0, y: 0 };

    return function (
      itemRadius: number,
      itemSpacing: number,
      offsetXY: Point2D = origin,
      stretchXY: Scale2D = defaultStretchXY,
    ): ShiftedGrid {
      const { x: ox, y: oy } = offsetXY;
      const { x: sx, y: sy } = stretchXY;

      const spaceSize = 2 * itemRadius + itemSpacing;

      const unitSize = {
        width: sx * spaceSize,
        height: sy * spaceSize,
      };

      return {
        itemRadius,
        itemSpacing,
        unitSize,

        gridCoordToScreenPoint: function (coord): Point2D {
          const { x: cx, y: cy } = gridToCart(coord);
          return {
            x: ox + unitSize.width * cx,
            y: oy + unitSize.height * cy,
          };
        },

        screenPointToGridCoord: function ({ x: gx, y: gy }): Index2D {
          const cartPoint = {
            x: (gx - ox) / unitSize.width,
            y: (gy - oy) / unitSize.height,
          };
          return cartToGrid(cartPoint);
        },
      };
    };
  })();

  /**
   * @description Translates a point along the grid by a magnitude in a direction
   * @param {Index2D} p - The starting indices to translate from
   * @param {Direction} direction - The axis along which to move
   * @param {number} m - The magnitude along the axis to translate by
   *
   * @return {Index2D} - The resulting position after traversal
   *
   */
  function traverse(p: Index2D, direction: GridDirection, m: number): Index2D {
    switch (direction) {
      case GridDirection.NX:
        return { x: p.x - m, y: p.y };
      case GridDirection.PX:
        return { x: p.x + m, y: p.y };
      case GridDirection.NXNY:
        return { x: p.x - xComponentAdjustment(p.y, m), y: p.y - m };
      case GridDirection.NXPY:
        return { x: p.x - xComponentAdjustment(p.y, m), y: p.y + m };
      case GridDirection.PXNY:
        return { x: p.x + m - xComponentAdjustment(p.y, m), y: p.y - m };
      case GridDirection.PXPY:
        return { x: p.x + m - xComponentAdjustment(p.y, m), y: p.y + m };
    }
  }

  /**
   * @name getDistanceBetween
   *
   * @param {Index2D} coordA - Coord A
   * @param {Index2D} coordB - Coord B
   * @return {number | undefined} - the distance between two points in a ShiftedGrid if they are colinear.  Otherwise returns undefined.
   */
  function getDistanceBetween(coordA: Index2D, coordB: Index2D): number | undefined {
    // Let's cover the simplest case first.
    if (Math.abs(coordA.y - coordB.y) < EPSILON) {
      // distance between points with the same y-value is just the difference in x-value
      return Math.abs(coordA.x - coordB.x);
    }

    // Now that that's out of the way...

    // We can easily test if 2 points are colinear in our ShiftedGrid by determining if the slope between the two points matches up with one of the cartesian versions of our GridDirections
    // We use this cartesian trick because otherwise we'd have to set up an algebraic inequality and solve for variables inside ceil and floor functions and that's pretty difficult...
    // I may take a crack at that someday...

    const cartPointA: Point2D = gridToCart(coordA);
    const cartPointB: Point2D = gridToCart(coordB);

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

    return Math.round(
      getCartesianDistance(cartPointA, cartPointB) / diagonallyAdjacentNodeDistance,
    );

    // There is absolutely a much more correct way to rewrite this entire function to be completely robust to all inputs, and perhaps someday it may be worth exploring.
  }

  /**
   * @description Gets distance between two coordinates, and always returns a number even if they are non-colinear.  Please, read on...
   * In cases where we are 100% sure that getDistanceBetween will always return a number, here is a convenience function that returns 0 instead of undefined so the return type is always number.
   * Only use it if you're 100% confident that using getDistanceBetween won't return undefined.
   * ...because it WILL HIDE LOGIC BUGS\
   *
   * Please, please, please... use it wisely.
   * @param {Index2D} gridCoordA
   * @param {Inndex2D} gridCoordB
   *
   * @return {number} a number representing the distance between gridCoordA and gridCoordB, or potentially just 0 if something went wrong
   */
  function unreliableDistanceBetween(gridCoordA: Index2D, gridCoordB: Index2D): number {
    return getDistanceBetween(gridCoordA, gridCoordB) ?? 0;
  }

  /**
   * @name areCoordsColinear
   * @description - Tests to see if two grid points are colinear, that is, they exist on the same line along a valid GridDirection
   * It's mainly just a cut-down version of the above function getGridDistanceBetween where instead of returning a distance we just want to know if two points are colinear
   *
   * @param {Index2D} coordA - Coordinate A
   * @param {Index2D} coordB - Coordinate B
   * @return {boolean} - Whether or not the coords are colinear
   */
  function areCoordsColinear(coordA: Index2D, coordB: Index2D): boolean {
    // Let's cover the simplest case first.
    if (Math.abs(coordA.y - coordB.y) < EPSILON) {
      // coords with same y-value are always colinear
      return true;
    }

    const cartPointA: Point2D = gridToCart(coordA);
    const cartPointB: Point2D = gridToCart(coordB);

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
   * @name isCoordBetween
   * @param {Index2D} p - The coordinate to test and find out if it's between the rectangle formed by coords a and b
   * @param {Index2D} a - Coord A
   * @param {Index2D} b - Coord B
   * @return {boolean} - Whether or not p is within the rectangle formed by coords a and b
   */
  function isCoordBetween(p: Index2D, a: Index2D, b: Index2D): boolean {
    const xMin = Math.min(a.x, b.x);
    const xMax = Math.max(a.x, b.x);
    const yMin = Math.min(a.y, b.y);
    const yMax = Math.max(a.y, b.y);

    return p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax;
  }

  /**
   * @name indexToCoord
   * @description A magical O(1) function that returns an Index2D given a single numeric nodeIndex
   *
   * @param {number} nodeIndex - The index of the node whose coord we need
   *
   * @return {Index2D} - The grid coord representing the node at the given index
   */
  const indexToCoord = (function () {
    // This is an array of directions to traverse from one RingCorner to the next one
    const traversalDirections: GridDirection[] = [
      GridDirection.NXPY, // from p0 -> p1
      GridDirection.NX, // from p1 -> p2
      GridDirection.NXNY, // from p2 -> p3
      GridDirection.PXNY, // from p3 -> p4
      GridDirection.PX, // from p4 -> p5
      GridDirection.PXPY, // from p4 -> p0 of next ring
      // ^ this is here for completeness, and to prevent traversalDirection[5] from being undefined
    ];

    // This is the actual function :)
    return function (nodeIndex: number): Index2D {
      // get the index of the ring that contains the node at nodeIndex
      const ringIndex = getRingIndex(nodeIndex);

      // get the sub-index of the node in its ring
      const nodeSubIndex = nodeIndex - getFirstNodeIndexInRing(ringIndex);

      // get the corner point ID of this ring closest to nodeSubIndex, but whose subIndex within the ring is less than nodeSubIndex.
      const leadingCorner = getLeadingRingCorner(ringIndex, nodeSubIndex);

      // get the subIndex of the RingCorner we just calculated
      const cornerSubIndex = getRingCornerSubIndex(ringIndex, leadingCorner);

      // get the Index2D position of the RingCorner
      const cornerPosition = getRingCornerCoord(ringIndex, leadingCorner);

      // calculate the distance we need to traverse from cornerSubIndex to nodeSubIndex
      const traversalDistance = nodeSubIndex - cornerSubIndex;

      // now we just traverse from cornerPosition by traversalDistance in the correct direction!
      return traverse(cornerPosition, traversalDirections[leadingCorner], traversalDistance);
    };
  })();

  // Function is defined in anonymous scope because of specialized constants we will need during its execution
  const coordToIndex = (function () {
    const cornerRay5Origin: Index2D = { x: 1, y: 0 };

    /**
     * @name coordToIndex
     * @description Another magical O(1) function which takes in a grid coordinate (Index2D) and outputs a 1D index following the spiral pattern.
     * @param {Index2D} targetCoord - The grid coord whose index we want
     * @return {number} - The index of this targetCoord, following i spiral-shape.
     */
    return function (targetCoord: Index2D): number {
      // We need to find which GridQuadrant the targetCoord is in
      const targetQuadrant = getGridQuadrant(targetCoord);

      // We also need to find the intersector direction for this quadrant
      const intersectorDirection = IntersectorDirectionForQuadrant[targetQuadrant];

      // Let's create a GridRay that starts at targetCoord and goes in the direction of intersectorDirection
      const targetIntersectorRay = createGridRay(targetCoord, intersectorDirection);

      // We need to get the direction of the leading corner for this quadrant
      const leadingCornerDirection = CornerDirectionForQuadrant[targetQuadrant];

      // Define our cornerRay startCoord. Ray 5 has a special startCoord.
      const cornerRayStartCoord =
        targetQuadrant === GridQuadrant.PXNY ? cornerRay5Origin : origin2D;

      // Define a GridRay that starts at the cornerRayStartCoord and goes in the direction of the leading corner
      const cornerRay = createGridRay(cornerRayStartCoord, leadingCornerDirection);

      // Now we need to find the intersection point between targetIntersectorRay and originToCornerRay
      const intersectionPoint = getLineIntersection(
        targetIntersectorRay.asCartLine(),
        cornerRay.asCartLine(),
      );

      if (intersectionPoint === undefined) {
        // this should never happen, if it does then something is extremely wrong
        return 0;
      }

      // Get intersectionPoint as grid coordinate
      const leadingRingCornerCoord = cartToGrid(intersectionPoint);

      // leadingRingConerCoord should always be on a ring corner.
      // TODO: For direction PXNY we need to add 1 to the x-coordinate
      // Get ring index of this targetCoord using the distance between center and leadingRingConerCoord
      const targetRingIndex = unreliableDistanceBetween(
        cornerRayStartCoord,
        leadingRingCornerCoord,
      );

      // Get the RingCorner that leadingRingConerCoord represents
      const leadingRingCorner = getRingCornerOfCornerCoord(leadingRingCornerCoord);

      // Get the index of leadingRingCorner
      const leadingRingCornerIndex = getRingCornerIndex(targetRingIndex, leadingRingCorner);

      // Get distance between targetCoord and leadingRingCornerCoord
      const distToLeadingRingCorner = unreliableDistanceBetween(
        targetCoord,
        leadingRingCornerCoord,
      );

      // The result index should just be leadingRingCornerIndex + distToLeadingRingCorner!
      return leadingRingCornerIndex + distToLeadingRingCorner;
    };
  })();

  // Return all the functions for GridUtil here
  return {
    createShiftedGrid,
    traverse,
    getDistanceBetween,
    unreliableDistanceBetween,
    areCoordsColinear,
    isCoordBetween,
    indexToCoord,
    coordToIndex,
  };
})(); // End of anonymous function returning GridUtil
