import { GridDirection } from './GridDirection';

// A GridQuadrant is one of six sections of the grid.

export enum GridQuadrant {
  PXPY = 0,
  PY = 1,
  NXPY = 2,
  NXNY = 3,
  NY = 4,
  PXNY = 5,
}

// Map of GridQuadrant to the GridDirection from the origin to the corner of a hexagonal ring

export const CornerDirectionForQuadrant: { [K in GridQuadrant]: GridDirection } = {
  [GridQuadrant.PXPY]: GridDirection.PX,
  [GridQuadrant.PY]: GridDirection.PXPY,
  [GridQuadrant.NXPY]: GridDirection.NXPY,
  [GridQuadrant.NXNY]: GridDirection.NX,
  [GridQuadrant.NY]: GridDirection.NXNY,
  [GridQuadrant.PXNY]: GridDirection.PXNY,
};

// Map of GridQuadrants to their associated intersector line GridDirection

export const IntersectorDirectionForQuadrant: { [K in GridQuadrant]: GridDirection } = {
  [GridQuadrant.PXPY]: GridDirection.PXNY,
  [GridQuadrant.PY]: GridDirection.PX,
  [GridQuadrant.NXPY]: GridDirection.PXPY,
  [GridQuadrant.NXNY]: GridDirection.NXPY,
  [GridQuadrant.NY]: GridDirection.NX,
  [GridQuadrant.PXNY]: GridDirection.NXNY,
};
