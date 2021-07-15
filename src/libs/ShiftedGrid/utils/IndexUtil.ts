import {
  CornerDirectionForQuadrant,
  GridDirection,
  GridQuadrant,
  Index2D,
  IntersectorDirectionForQuadrant,
  origin2D,
} from '../types';

import { traverseGrid, unreliableGridDistanceBetween } from './ArithmeticUtil';
import { cartToGrid } from './CartesianUtil';
import { createGridRay } from './GridRayUtil';
import { getLineIntersection } from './LineUtil';
import { getGridQuadrant } from './QuadrantUtil';
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
  const cornerRay5Origin: Index2D = { x: 1, y: 0 };
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
    const cornerRayStartCoord = targetQuadrant === GridQuadrant.PXNY ? cornerRay5Origin : origin2D;

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
    const targetRingIndex = unreliableGridDistanceBetween(
      cornerRayStartCoord,
      leadingRingCornerCoord,
    );

    // Get the RingCorner that leadingRingConerCoord represents
    const leadingRingCorner = getRingCornerOfCornerCoord(leadingRingCornerCoord);

    // Get the index of leadingRingCorner
    const leadingRingCornerIndex = getRingCornerIndex(targetRingIndex, leadingRingCorner);

    // Get distance between targetCoord and leadingRingCornerCoord
    const distToLeadingRingCorner = unreliableGridDistanceBetween(
      targetCoord,
      leadingRingCornerCoord,
    );

    // The result index should just be leadingRingCornerIndex + distToLeadingRingCorner!
    return leadingRingCornerIndex + distToLeadingRingCorner;
  };
})();
