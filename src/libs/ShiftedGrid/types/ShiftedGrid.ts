/**
 * @description
 * The ShiftedGrid itself just allows you to do two things:
 * 1. Get the 2D coordinate of an item by its index,
 * 2. Get the index of an item given a 2D coordinate.
 *
 * This is a type because we want it to be ultra-lightweight and optimize the functions it contains
 *
 */

import { Index2D, Point2D } from './2DTypes';

export type ShiftedGrid = {
  itemRadius: number;
  itemSpacing: number;
  spaceSize: number;
  indexToGridCoord: (index: number) => Index2D;
  gridCoordToIndex: (coord: Index2D) => number;
  gridCoordToScreenPoint: (coord: Index2D) => Point2D;
  screenPointToGridCoord: (point: Point2D) => Index2D;
};
