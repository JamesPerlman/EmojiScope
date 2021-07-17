/*

This file contains operations that transform between cartesian space and ShiftedGrid space

It also includes convenient classes related to general cartesian geometry

*/
import { MathUtil } from '../../../utils';
import { Index2D, Point2D } from '../types/2DTypes';

const f_c2gOdd_x = (x: number): number => Math.round(x - 0.5) + 0.5;
const f_c2gOdd_y = (y: number): number => Math.round(y);

const f_c2gEven_x = (x: number): number => Math.round(x);
const f_c2gEven_y = (y: number): number => Math.round(y);

const f_c2gy = (x: number, y: number): number => {
  if (MathUtil.modulo(Math.round(y), 2) === 1) {
    return f_c2gOdd_y(y);
  } else {
    // if (MathUtil.modulo(Math.round(y), 2) === 0) {
    return f_c2gEven_y(y);
  }
};

const f_c2gx = (x: number, y: number): number => {
  if (MathUtil.modulo(Math.round(y), 2) === 1) {
    return f_c2gOdd_x(x);
  } else {
    // if (MathUtil.modulo(Math.round(y), 2) === 0) {
    return f_c2gEven_x(x);
  }
};
// Given a cartesian coordinate, find the nearest coordinate on the ShiftedGrid
export function gridToCart({ x: cx, y: cy }: Index2D): Point2D {
  return {
    x: f_c2gx(cx, cy),
    y: f_c2gy(cx, cy),
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
export function getCartesianDistance(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const a1 = { x: 0, y: 1 };
const a2 = { x: 0, y: 2 };
const a3 = { x: 0, y: 3 };
const a4 = { x: 0, y: 4 };
const a5 = { x: 0, y: 5 };
const a6 = { x: 0, y: 6 };

const c1 = { x: 0, y: 1 };
const c2 = { x: 0, y: 2 };
const c3 = { x: 0, y: 3 };
const c4 = { x: 0, y: 4 };
const c5 = { x: 0, y: 5 };
const c6 = { x: 0, y: 6 };

const d1 = gridToCart(a1);
const d2 = gridToCart(a2);
const d3 = gridToCart(a3);
const d4 = gridToCart(a4);
const d5 = gridToCart(a5);
const d6 = gridToCart(a6);

const g1 = cartToGrid(d1);
const g2 = cartToGrid(d2);
const g3 = cartToGrid(d3);
const g4 = cartToGrid(d4);
const g5 = cartToGrid(d5);
const g6 = cartToGrid(d6);

console.log('hey!');
