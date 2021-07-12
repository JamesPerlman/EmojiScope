import { Index2D } from './2DTypes';
import { GridDirection } from './GridDirection';
import { SlopeInterceptLine } from './SlopeInterceptLine';

export type GridRay = {
  startCoord: Index2D;
  direction: GridDirection;
  contains: (coord: Index2D) => boolean;
  asLine: () => SlopeInterceptLine;
};
