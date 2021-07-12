/**
 * @description
 * The ShiftedGrid itself just allows you to do two things:
 * 1. Get the 2D coordinate of an item by its index,
 * 2. Get the index of an item given a 2D coordinate.
 *
 * This is a type because we want it to be ultra-lightweight and optimize the functions it contains
 *
 */

import { Point2D } from './2DTypes';

export type ShiftedGrid = {
  itemRadius: number;
  itemSpacing: number;
  gridSpaceSize: number;
  getPositionFromGridIndex: (index: number) => Point2D;
  getGridIndexFromPosition: (position: Point2D) => number;
};
