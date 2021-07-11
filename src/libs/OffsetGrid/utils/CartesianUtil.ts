/*

This file contains operations that transform between cartesian space and OffsetGrid space

It also includes convenient classes related to Lines and their representation in OffsetGrid space.

*/

import { MathUtil } from '../../../utils';
import { Index2D, Point2D } from '../types/2DTypes';

// This function defines the basic rule of an OffsetGrid:
// Every odd-numbered row is offset by half a unit
function getCartesianCoordinates(gridCoordinates: Index2D): Point2D {
  return {
    x: gridCoordinates.x + 0.5 * MathUtil.modulo(gridCoordinates.y, 2),
    y: gridCoordinates.y,
  };
}

