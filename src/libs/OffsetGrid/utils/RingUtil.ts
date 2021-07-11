/*
The way we will be using the OffsetGrid and laying out nodes within it will rely heavily on the idea that a grid is a series of connected hexagonal spirals.
Here are some useful functions for various properties of Rings within an OffsetGrid
*/

import { add, GridDirection, Index2D, RingCorner } from '../types';
import { traverseGrid } from './ArithmeticUtil';

// Returns the count of all nodes up to and including a ring specified by index
export function sumOfAllNodesIncluding(ringIndex: number) {
  return (ringIndex + 1) * (3 * ringIndex + 1);
}

// Returns the index of the ring that contains the nodeIndex
export function getRingIndex(nodeIndex: number): number {
  return Math.floor((-2 + Math.sqrt(4 - 3 * (1 - nodeIndex))) / 3) + 1;
}

// Returns the RingCorner whose subIndex is less than or equal to the given nodeSubIndex
export function getLeadingRingCorner(ringIndex: number, nodeSubIndex: number): RingCorner {
  if (nodeSubIndex < 5 * ringIndex + 1) {
    return Math.min(4, Math.floor(nodeSubIndex / Math.max(1, ringIndex))) as RingCorner;
  } else {
    return 5;
  }
}

// Returns the subIndex of the given RingCorner within a ring
export function getRingCornerSubIndex(ringIndex: number, ringCorner: RingCorner): number {
  if (ringCorner === 5) {
    return 5 * ringIndex + 1;
  } else {
    return ringCorner * ringIndex;
  }
}

// Returns the Index2D position of a corner of a ring
export const getRingCornerPosition = (function () {
  // This is just the grid's origin
  const origin: Index2D = { x: 0, y: 0 };

  // This is a mapping of the Direction one must traverse from the origin to reach a specific RingCorner
  // The index is inferred to be a RingCorner value in the range [0, 5]
  const directionToCorner: GridDirection[] = [
    GridDirection.PX, // center -> p0
    GridDirection.PXPY, // center -> p1
    GridDirection.NXPY, // center -> p2
    GridDirection.NX, //  center -> p3
    GridDirection.NXNY, // center -> p4
    GridDirection.PXNY, // center -> p5
  ];

  return function (ringIndex: number, ringCorner: RingCorner): Index2D {
    let cornerPoint = traverseGrid(origin, directionToCorner[ringCorner], ringIndex);

    // special case for corner 5, we need to add 1 to the x-value
    if (ringCorner === 5) {
      cornerPoint = add(cornerPoint, { x: 1, y: 0 });
    }

    return cornerPoint;
  };
})();
