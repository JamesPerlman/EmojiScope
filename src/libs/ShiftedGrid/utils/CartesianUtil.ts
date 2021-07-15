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
    y: gy,
  };
}

// Given a cartesian coordinate, find the nearest coordinate on the ShiftedGrid
export function cartToGrid({ x: cx, y: cy }: Point2D): Index2D {
  const rcy = Math.round(cy);
  return {
    x: (cx < 0 ? Math.floor : Math.ceil)(cx - 0.5 * MathUtil.modulo(rcy, 2)),
    y: rcy,
  };
}

// Get linear cartesian distance between points a and b
export function getCartesianDistance(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}


const gridPoint0 = { x: 23, y: 42 };
const gridPoint1 = { x: -69, y: 69 };
const gridPoint2 = { x: 1337, y: 420 };

const cartPoint0 = gridToCart(gridPoint0);
const cartPoint1 = gridToCart(gridPoint1);
const cartPoint2 = gridToCart(gridPoint2);

const p0 = cartToGrid(cartPoint0); // should = gridPoint0
const p1 = cartToGrid(cartPoint1); // should = gridPoint1
const p2 = cartToGrid(cartPoint2); // should = gridPoint2

console.log('f');