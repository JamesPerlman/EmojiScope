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

export const RingCorners = {
  first: 0,
  second: 1,
  third: 2,
  fourth: 3,
  fifth: 4,
  sixth: 5,
} as const;

export type RingCorner = typeof RingCorners[keyof typeof RingCorners];

export const RingCornerIndices = Object.values(RingCorners);
