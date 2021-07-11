/*

This file contains operations that transform between cartesian space and OffsetGrid space

It also includes convenient classes related to general cartesian geometry

*/

import { MathUtil } from '../../../utils';
import { Index2D, Point2D } from '../types/2DTypes';

// This function defines the basic rule of an OffsetGrid:
// Every odd-numbered row is offset by half a unit

// squish y axis by a factor such that diagonally adjacent items are exactly 1 unit apart

export function getCartesianPosition(gridCoordinates: Index2D): Point2D {
  return {
    x: gridCoordinates.x + 0.5 * MathUtil.modulo(gridCoordinates.y, 2),
    y: gridCoordinates.y,
  };
}

export function getCartesianDistanceBetween(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
