import { Index2D } from './2DTypes';
import { GridDirection } from './GridDirection';

export type GridRay = {
  startCoord: Index2D;
  direction: GridDirection;
};
