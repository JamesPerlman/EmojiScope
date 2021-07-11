/*
  Each point in an OffsetGrid has six adjacent points.
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
