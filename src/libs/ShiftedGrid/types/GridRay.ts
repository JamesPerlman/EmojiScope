import { Index2D } from './2DTypes';
import { GridDirection } from './GridDirection';
import { SlopeInterceptLine } from './SlopeInterceptLine';

export type GridRay = {
  startCoord: Index2D;
  direction: GridDirection;
  // TODO: these should be utility functions, not instance methods
  contains: (coord: Index2D) => boolean;
  asCartLine: () => SlopeInterceptLine;
};
