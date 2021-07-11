import { add, Index2D } from '../2DTypes';

/*
 * GRID RULES

 * Grid starts at (0,0)
 * Rows with odd-numbered y-values have their x-values offset by +0.5 units
 * Consecutive nodes form hexagonal rings
 * Rings of consecutive nodes are constructed in a counterclockwise fashion
 * In the UI, +x is intended to be right, and +y is intended to be up
*/

// Some helpful types

/* There are 6 ring corners.  Corner 0 is always the start, and they increase counter-clockwisely like so:
    +y
    ^
    |      p2 . p1
    |     .       .
    |    p3       p0
    |     .         .
    |      p4 . . p5
    |
    -----------------> +x
*/

type RingCorner = 0 | 1 | 2 | 3 | 4 | 5;

/*
  Each point in the grid has six adjacent points. 
  Thus, there are six directions one can move in to reach an adajecnt point.
*/

enum Direction {
  NX, // negative x
  PX, // positive x
  NXNY, // negative x, negative y
  NXPY, // negative x, positive y
  PXNY, // positive x, negative y
  PXPY, // positive x, positive y
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
const traverse = (function () {
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
  return function (p: Index2D, direction: Direction, m: number): Index2D {
    switch (direction) {
      case Direction.NX:
        return { x: p.x - m, y: p.y };
      case Direction.PX:
        return { x: p.x + m, y: p.y };
      case Direction.NXNY:
        return { x: p.x - dx(p.y, m), y: p.y - m };
      case Direction.NXPY:
        return { x: p.x - dx(p.y, m), y: p.y + m };
      case Direction.PXNY:
        return { x: p.x + m - dx(p.y, m), y: p.y - m };
      case Direction.PXPY:
        return { x: p.x + m - dx(p.y, m), y: p.y + m };
    }
  };
})();

// Returns the count of all nodes up to and including a ring specified by index
function sumOfAllNodesIncluding(ringIndex: number) {
  return (ringIndex + 1) * (3 * ringIndex + 1);
}

// Returns the index of the ring that contains the nodeIndex
function getRingIndex(nodeIndex: number): number {
  return Math.floor((-2 + Math.sqrt(4 - 3 * (1 - nodeIndex))) / 3) + 1;
}

// Returns the RingCorner whose subIndex is less than or equal to the given nodeSubIndex
function getLeadingRingCorner(ringIndex: number, nodeSubIndex: number): RingCorner {
  if (nodeSubIndex < 5 * ringIndex + 1) {
    return Math.min(4, Math.floor(nodeSubIndex / Math.max(1, ringIndex))) as RingCorner;
  } else {
    return 5;
  }
}

// Returns the subIndex of the given RingCorner within a ring
function getRingCornerSubIndex(ringIndex: number, ringCorner: RingCorner): number {
  if (ringCorner === 5) {
    return 5 * ringIndex + 1;
  } else {
    return ringCorner * ringIndex;
  }
}

// Returns the Index2D position of a corner of a ring
const getRingCornerPosition = (function () {
  // This is just the grid's origin
  const origin: Index2D = { x: 0, y: 0 };

  // This is a mapping of the Direction one must traverse from the origin to reach a specific RingCorner
  // The index is inferred to be a RingCorner value in the range [0, 5]
  const directionToCorner: Direction[] = [
    Direction.PX, // center -> p0
    Direction.PXPY, // center -> p1
    Direction.NXPY, // center -> p2
    Direction.NX, //  center -> p3
    Direction.NXNY, // center -> p4
    Direction.PXNY, // center -> p5
  ];

  return function (ringIndex: number, ringCorner: RingCorner): Index2D {
    let cornerPoint = traverse(origin, directionToCorner[ringCorner], ringIndex);

    // special case for corner 5, we need to add 1 to the x-value
    if (ringCorner === 5) {
      cornerPoint = add(cornerPoint, { x: 1, y: 0 });
    }

    return cornerPoint;
  };
})();

// The magical O(1) function that returns an Index2D given a single nodeIndex
export const indexToCoordinate = (function () {
  // This is an array of directions to traverse from one RingCorner to the next one
  const traversalDirections: Direction[] = [
    Direction.NXPY, // from p0 -> p1
    Direction.NX, // from p1 -> p2
    Direction.NXNY, // from p2 -> p3
    Direction.PXNY, // from p3 -> p4
    Direction.PX, // from p4 -> p5
    Direction.PXPY, // from p4 -> p0 of next ring
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
    return traverse(cornerPosition, traversalDirections[leadingCorner], traversalDistance);
  };
})();
