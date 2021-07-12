import {
  directionFromCenterToCorner,
  GridDirection,
  Index2D,
  RingCorner,
  RingCornerIndices,
} from '../types';

import { traverseGrid, unreliableGridDistanceBetween } from './ArithmeticUtil';
import { createGridRay } from './GridRayUtil';
import {
  getLeadingRingCorner,
  getRingCornerPosition,
  getRingCornerSubIndex,
  getRingIndex,
  sumOfAllNodesIncluding,
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
    const nodeSubIndex = nodeIndex - sumOfAllNodesIncluding(ringIndex - 1);

    // get the corner point ID of this ring closest to nodeSubIndex, but whose subIndex within the ring is less than nodeSubIndex.
    const leadingCorner = getLeadingRingCorner(ringIndex, nodeSubIndex);

    // get the subIndex of the RingCorner we just calculated
    const cornerSubIndex = getRingCornerSubIndex(ringIndex, leadingCorner);

    // get the Index2D position of the RingCorner
    const cornerPosition = getRingCornerPosition(ringIndex, leadingCorner);

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
    createGridRay(origin, directionFromCenterToCorner[corner]),
  );

  // The ray for corner 5 is special, because the ray that passes through these corners starts at (1, 0)
  const corner5Ray = createGridRay({ x: 1, y: 0 }, directionFromCenterToCorner[5]);

  // Now we can create an array of GridRays that pass through every corner of every ring
  const centerRays = [...originRays, corner5Ray];

  return function (targetCoord: Index2D) {
    // First let's test to see if our targetCoord is contained within any of the centerRays
    centerRays.find((ray) => ray.contains(targetCoord));
    for (const [i, ray] of centerRays.entries()) {
      if (ray.contains(targetCoord)) {
        // looks like targetCoord is a corner point! easy peasy.

        // check out unreliableGridDistanceBetween to see why I named it that... It's reliable in this case, I promise!
        const ringIndex =
          unreliableGridDistanceBetween(ray.startCoord, targetCoord) + (i % 5 === 0 ? 1 : 0);

        // the (i as RingCorner) cast is safe because centerRays has 6 items and thus i will always be in the range [0, 5]
        return getRingCornerPosition(ringIndex, i as RingCorner);
      }
    }

    // If we have made it to this point, we must call upon our good friend "added complexity" to figure out which index this gridCoord represents.

    // Let's create 6 more rays starting from gridCoord and heading in each GridDirection
    const targetRays = RingCornerIndices.map((corner) =>
      createGridRay(targetCoord, directionFromCenterToCorner[corner]),
    );

    // Now we must check for check for intersections between targetRays and centerRays
    // There should always be six intersections in total
  };
})();
