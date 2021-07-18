/*

This file contains operations that transform between cartesian space and ShiftedGrid space

It also includes convenient classes related to general cartesian geometry

*/
import { MathUtil } from '../../../utils';
import { Index2D, Point2D } from '../types/2DTypes';

// Given a cartesian coordinate, find the nearest coordinate on the ShiftedGrid
export function gridToCart({ x: cx, y: cy }: Index2D): Point2D {
  const ry = Math.round(cy);
  const k = 0.5 * MathUtil.modulo(ry, 2);
  return {
    x: Math.round(cx - k) + k,
    y: ry,
  };
}

// Given a grid ShiftedGrid coordinate, return the corresponding cartesian coordinate
export function cartToGrid({ x: gx, y: gy }: Point2D): Index2D {
  return {
    x: Math.floor(gx),
    y: Math.floor(gy),
  };
}

// Get linear cartesian distance between points a and b
// check this out btw https://jsben.ch/stsBd
export function getCartesianDistance(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
