import {
  add2D,
  DirectionFromCenterToCorner,
  GridDirection,
  Index2D,
  Point2D,
  RingCorner,
  RingCornerIndices,
} from '../types';

import {
  areGridCoordsColinear,
  getGridDistanceBetween,
  isCoordBetween,
  traverseGrid,
  unreliableGridDistanceBetween,
} from './ArithmeticUtil';
import { isIndexEven } from './ArrayUtil';
import { cartToGrid } from './CartesianUtil';
import { objectMin } from './CompareUtil';
import { createGridRay } from './GridRayUtil';
import { getLineIntersection } from './LineUtil';
import {
  getFirstNodeIndexInRing,
  getLeadingRingCorner,
  getRingCornerIndex,
  getRingCornerOfCornerCoord,
  getRingCornerCoord,
  getRingCornerSubIndex,
  getRingIndex,
} from './RingUtil';

// The magical O(1) function that returns an Index2D given a single nodeIndex
export const indexToCoordinate = (function () {
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
    return traverseGrid(cornerPosition, traversalDirections[leadingCorner], traversalDistance);
  };
})();

// Another magical O(1) function which takes in a grid coordinate (Index2D) and outputs a 1D index following the spiral pattern.
export const coordinateToIndex = (function () {
  // Here we shall prepare some private scoped variables to help us with our calculations.
  const origin: Index2D = { x: 0, y: 0 };

  // Let's create 6 GridRays that pass through all corners of all rings in our ShiftedGrid
  const originRays = RingCornerIndices.slice(0, 5).map((corner) =>
    createGridRay(origin, DirectionFromCenterToCorner[corner]),
  );

  // The ray for corner 5 is special, because the ray that passes through these corners starts at (1, 0)
  const corner5Ray = createGridRay({ x: 1, y: 0 }, DirectionFromCenterToCorner[5]);

  // Now we can create an array of GridRays that pass through every corner of every ring
  const centerRays = [...originRays, corner5Ray];

  // Let's also get an array of 3 lines representing these 6 rays
  // Remember that 2 rays would produce the same line because lines don't care about direction.
  const centerLines = centerRays.filter(isIndexEven).map((gridRay) => gridRay.asLine());

  // We will need this highly-specialized function here later, and here alone
  /* Once we find the intersection points between the center rays and the targetCoord rays,
       We must find the 2 points which are:
        1) colinear with each other
        2) on either side of the input targetCoord

      So that's what this function is for.
    */
  function getRelevantIntersectionCoords(
    targetCoord: Index2D,
    gridIntersections: Index2D[],
  ): [Index2D, Index2D] {
    for (const [i, a] of gridIntersections.entries()) {
      for (const [j, b] of gridIntersections.entries()) {
        // don't compare the same two gridIntersections
        if (i !== j) {
          if (areGridCoordsColinear(a, b) && isCoordBetween(targetCoord, a, b)) {
            // ding ding ding!
            return [a, b];
          }
        }
      }
    }
    // This should never ever happen, but if we get to this point we will just return the origin for both points
    return [origin, origin];
  }

  /*
    AND NOW, the moment we've all been waiting for...
    Here's the actual function that returns the index given a targetCoord
  */
  return function (targetCoord: Index2D, referenceIndex: number): number {
    // First let's test to see if our targetCoord is contained within any of the centerRays
    // centerRays.find((ray) => ray.contains(targetCoord));
    for (const [i, ray] of centerRays.entries()) {
      if (ray.contains(targetCoord)) {
        // looks like targetCoord is a corner point! easy peasy.

        // check out unreliableGridDistanceBetween to see why I named it that... It's reliable in this case, I promise!
        const ringIndex = unreliableGridDistanceBetween(ray.startCoord, targetCoord);

        return getRingCornerIndex(ringIndex, i as RingCorner);
      }
    }

    // If we have made it to this point, we must call upon our good friend "added complexity" to figure out which index this gridCoord represents.

    // Let's create 3 lines intersecting gridCoord
    const targetLines = RingCornerIndices.filter(isIndexEven).map((corner) =>
      createGridRay(targetCoord, DirectionFromCenterToCorner[corner]).asLine(),
    );

    // Now we must check for check for intersections between targetRays and centerRays
    // There should always be six intersections in total
    const gridIntersections: Index2D[] = [];
    for (const [centerLineIndex, centerLine] of centerLines.entries()) {
      for (const targetLine of targetLines) {
        // Find the cartesian intersection of these lines
        const cartIntersection = getLineIntersection(centerLine, targetLine);
        if (cartIntersection !== undefined) {
          // Now we need to convert this cartesian point back to ShiftedGrid space
          const gridIntersection = cartToGrid(cartIntersection);

          // If the intersection point *should be* with centerRay[5] we need to adjust it by adding 1 to the x-component
          // centerRay[5] is the part of centerLine[2] whose range is y > 0
          if (centerLineIndex === 2 && gridIntersection.y > 0) {
            gridIntersection.x += 1;
          }

          // collect the intersection points in our array
          gridIntersections.push(gridIntersection);
        }
      }
    }

    // Find the two ring corner coords that targetCoord is between
    const [cornerCoordA, cornerCoordB] = getRelevantIntersectionCoords(
      targetCoord,
      gridIntersections,
    );

    // Now we can get the ringIndex for either one of these cornerCoords
    // Again we can use the unreliableGridDistance function since if something goes wrong it will just return 0
    // But nothing should go wrong because these cornerCoords should definitely be ring corners.
    const ringIndex = unreliableGridDistanceBetween(origin, cornerCoordA);

    // We need to figure out which of these ringCorners has a lower RingCorner value
    const ringCornerA = getRingCornerOfCornerCoord(cornerCoordA);
    const ringCornerB = getRingCornerOfCornerCoord(cornerCoordB);
    const leadingRingCorner = Math.min(ringCornerA, ringCornerB) as RingCorner;

    // Determine its grid coordinates
    const leadingCornerCoord = getRingCornerCoord(ringIndex, leadingRingCorner);

    // And now, the grand finale...
    // The index of targetCoord can be calculated by adding its grid-distance to the index of the RingCorner right before it!

    // unreliableGridDistanceBetween is OK to use here since we have already verified that ringIndex and leadingRingCorner
    const distanceToLeadingCorner = unreliableGridDistanceBetween(leadingCornerCoord, targetCoord);
    const firstIndexInTargetRing = getFirstNodeIndexInRing(ringIndex);

    const retVal = firstIndexInTargetRing + distanceToLeadingCorner;
    return retVal;
  };
})();
