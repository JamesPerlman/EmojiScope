/*

This file contains operations that transform between cartesian space and ShiftedGrid space

It also includes convenient classes related to general cartesian geometry

*/

import { MathUtil } from '../../../utils';
import { Index2D, Point2D } from '../types/2DTypes';

// Given a grid ShiftedGrid coordinate, return the corresponding cartesian coordinate
export function gridToCart({ x: gx, y: gy }: Index2D): Point2D {
  return {
    x: gx + 0.5 * MathUtil.modulo(gy, 2),
    y: -gy,
  };
}

// Given a cartesian coordinate, find the nearest coordinate on the ShiftedGrid
export function cartToGrid({ x: cx, y: cy }: Point2D): Index2D {
  const ry = Math.round(cy);
  const m = MathUtil.modulo(ry, 2);
  return {
    x: m === 0 ? Math.round(cx) : Math.floor(cx) + 0.5,
    y: -cy,
  };
}

// Get linear cartesian distance between points a and b
export function getCartesianDistance(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
