/*
The way we will be using the ShiftedGrid and laying out nodes within it will rely heavily on the idea that a grid is a series of connected hexagonal spirals.
Here are some useful functions for various properties of Rings within an ShiftedGrid
*/

import { add2D, DirectionFromCenterToCorner, GridDirection, Index2D, RingCorner } from '../types';
import { traverseGrid } from './ArithmeticUtil';

// Returns the count of all nodes up to and including a ring specified by index
export function getSumOfAllNodesIncluding(ringIndex: number) {
  return (ringIndex + 1) * (3 * ringIndex + 1);
}

// Returns the first index in the given ring
export function getFirstNodeIndexInRing(ringIndex: number) {
  return (ringIndex) * (3 * ringIndex - 2);
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
  // look ma, no branches!
  return ringCorner * ringIndex + Math.max(0, ringCorner - 4);
}

// Returns the grid index of the given RingCorner within the full spiral
export function getRingCornerIndex(ringIndex: number, ringCorner: RingCorner): number {
  // this result is equivalent to: firstNodeIndexOfPreviousRing + ringCornerSubIndex
  // aka: getFirstNodeIndexInRing(ringIndex) + getRingCornerSubIndex(ringIndex, ringCorner);
  // let's optimize this into an algebraic expression now:
  // (((ringIndex - 1) + 1) * (3 * (ringIndex - 1) + 1) + (ringCorner * ringIndex + Math.max(0, ringCorner - 4));
  return ringIndex * (3 * ringIndex + ringCorner - 2) + Math.max(0, ringCorner - 4);
}

// Returns the Index2D coord of a corner of a ring
export const getRingCornerCoord = (function () {
  // This is just the grid's origin
  const origin: Index2D = { x: 0, y: 0 };

  return function (ringIndex: number, ringCorner: RingCorner): Index2D {
    let cornerPoint = traverseGrid(origin, DirectionFromCenterToCorner[ringCorner], ringIndex);

    // special case for corner 5, we need to add 1 to the x-value
    if (ringCorner === 5) {
      cornerPoint = add2D(cornerPoint, { x: 1, y: 0 });
    }

    return cornerPoint;
  };
})();


// Returns the RingCorner value of a coord in a ring.  Fast, too!
// input coord MUST be a CornerPoint, otherwise this result is not valid.

export function getRingCornerOfCornerCoord({ x: cx, y: cy }: Index2D): RingCorner {
  if (cy === 0) {
    return (cx < 0) ? 3 : 0;
  } else if (cy > 0) {
    return (cx > 0) ? 1 : 2;
  } else {
    return (cx > 0) ? 5 : 4;
  }
}