/*
  Each point in an ShiftedGrid has six adjacent points.
  Thus, there are six directions one can move in to reach an adajcent point.
*/

export enum GridDirection {
  NX, // negative x
  PX, // positive x
  NXNY, // negative x, negative y
  NXPY, // negative x, positive y
  PXNY, // positive x, negative y
  PXPY, // positive x, positive y
}

// This is a map of GridDirections to y=mx+b line slopes in Cartesian coords

export const CartesianSlope: { [K in GridDirection]: number } = {
  [GridDirection.NX]: 0,
  [GridDirection.PX]: 0,
  [GridDirection.NXNY]: -2,
  [GridDirection.NXPY]: -2,
  [GridDirection.PXNY]: 2,
  [GridDirection.PXPY]: 2,
};

// This is a mapping of the Direction one must traverse from the origin to reach a specific RingCorner
// The index is inferred to be a RingCorner value in the range [0, 5]
export const directionFromCenterToCorner: GridDirection[] = [
  GridDirection.PX, // center -> p0
  GridDirection.PXPY, // center -> p1
  GridDirection.NXPY, // center -> p2
  GridDirection.NX, //  center -> p3
  GridDirection.NXNY, // center -> p4
  GridDirection.PXNY, // center -> p5 (actually not entirely accurate, you have to add (1, 0) to get to the corner at p5)
];
