import { GridDirection, Index2D } from '../types';
import { traverseGrid } from './ArithmeticUtil';
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
  return function (coordinate: Index2D) {
    // TODO: lots...
    
  };
})();
