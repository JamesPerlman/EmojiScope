/*

This file contains operations that transform between cartesian space and ShiftedGrid space

It also includes convenient classes related to general cartesian geometry

*/
import { MathUtil } from '../../../utils';
import { Index2D, Point2D } from '../types/2DTypes';

/**
 * @name CartesianUtil
 * @description - Contains helper functions for working with cartesian coordinates
 */
export const CartesianUtil = {
  /**
   * @name gridToCart
   * @description - Given a cartesian coordinate, find the nearest coordinate on a ShiftedGrid
   * @param {Index2D} gridCoord - The grid coordinate whose cartesian point we want to calculate
   * @return {Point2D} - The cartesian coordinate of the gridCoord
   */
  gridToCart: function ({ x: cx, y: cy }: Index2D): Point2D {
    const ry = Math.round(cy);
    const k = 0.5 * MathUtil.modulo(ry, 2);
    return {
      x: Math.round(cx - k) + k,
      y: ry,
    };
  },

  /**
   * @name cartToGrid
   * @description - Given a ShiftedGrid coordinate, calculate the corresponding cartesian point
   * @param {Point2D} cartPoint - The cartesian point whose gridCoord we want to calculate
   * @return {Index2D} - The coordinate on the ShiftedGrid closest to the input cartPoint
   */
  cartToGrid: function ({ x: gx, y: gy }: Point2D): Index2D {
    return {
      x: Math.floor(gx),
      y: Math.floor(gy),
    };
  },

  /**
   * @name getDistance
   * @param {Point2D} a - An arbitrary point in cartesian space
   * @param {Point2D} b - Another arbitrary point in cartesian space
   * @return {number} - the distance between points a and b
   *
   * check this out btw https://jsben.ch/stsBd
   */
  getDistance: function (a: Point2D, b: Point2D): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
};
