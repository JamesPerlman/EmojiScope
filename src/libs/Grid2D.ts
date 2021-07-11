import { Index2D } from './OffsetGrid/types/2DTypes';

/*
 * GRID RULES

 * Grid starts at (0,0)
 * Rows with odd-numbered y-values have their x-values offset by +0.5 units
 * Consecutive nodes form hexagonal rings
 * Rings of consecutive nodes are constructed in a counterclockwise fashion
 * In the UI, +x is intended to be right, and +y is intended to be up
*/




// Another magical O(1) function that gets the index of a node at an input coordinate (x,y)
export function coordinateToIndex(coordinate: Index2D): number {
  // TODO: lots.
  return 0;
}