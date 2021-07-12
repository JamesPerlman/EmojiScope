/*
This Layout Util is for creating a custom grid with specific properties (item spacing, magnification effect amount, etc)

The functions here are to be used on a per-grid pasis and they are for determining a GridItem's position under various circumstances.

*/

import { add2D, Index2D, Point2D } from '../libs';
import { MathUtil } from './MathUtil';

export type GridItemPositionFunction = (indices: Index2D) => Point2D;
export type GridPointScaleFunction = (point: Point2D, effectCenter?: Point2D) => number;
export type GridPointDisplacementFunction = (point: Point2D, effectCenter?: Point2D) => Point2D;

export const GridLayoutUtil = {
  /*
   * getScale function factory
   */

  createScaleFunction(effectRadius: number, maxScale: number): GridPointScaleFunction {
    // define some helper coefficients

    const r = effectRadius;
    const s = maxScale;

    const a = 0.5 * s;
    const b = Math.PI / r;

    // scale helper function (the curve portion, single-dimension, unbounded, non-piecewise)
    const fScale = (t: number, p: number): number => {
      return 1.0 + a * (Math.cos(b * (t - p)) + 1.0);
    };

    /*
     * Now we can construct the parametric (single-dimension only) piecewise versions of these functions
     * This function's value follows the fScale curve when t is within the effect range, otherwise returns 1
     */

    const pScale = (t: number, p: number): number => {
      return Math.abs(t - p) < r ? fScale(t, p) : 1;
    };

    /*
     * Now that we have all the pieces we can return the two-dimensional scale function
     */

    return (point, effectCenter?) => {
      if (effectCenter === undefined) {
        // no focus point, normal scale
        return 1;
      }

      // scale should be minimum of parametric scale for x and y
      const xScale = pScale(point.x, effectCenter.x);
      const yScale = pScale(point.y, effectCenter.y);

      return Math.min(xScale, yScale);
    };
  },

  /*
   * Displacement function factory
   * creates an optimized and efficient displacement function
   */

  createDisplacementFunction(
    effectRadius: number,
    maxScale: number,
  ): GridPointDisplacementFunction {
    // convenience vars and coefficients
    const s = maxScale;
    const r = effectRadius;

    const a = (2.0 + s) / 2.0;
    const b = (r * s) / (2.0 * Math.PI);
    const c = Math.PI / r;

    const r1a = r * (1 - a);
    const bsincr = b * Math.sin(c * r);

    /*
     * Construct the piecewise displacement function - see Desmos graph in research folder for how this was calculated
     */
    const pDisp = (t: number, p: number) => {
      if (t < p - r) {
        // t is less than point of interest, out of effect range
        return t + r1a + bsincr;
      }
      if (t > p + r) {
        // t is greater than point of interest, out of effect range
        return t - r1a + bsincr;
      }
      // here we can safely assume t is within the effect range
      return a * (t - p) + b * Math.sin(c * (t - p)) + p;
    };

    /*
     * Now we can return the two-dimensional displacement function
     */

    return (point, effectCenter?) => {
      if (effectCenter === undefined) {
        // no effect center, no displacement
        return point;
      }

      return {
        x: pDisp(point.x, effectCenter.x),
        y: pDisp(point.y, effectCenter.y),
      };
    };
  },

  /*
   * Item Position Function Factory
   */
  createItemPositionFunction(
    center: Point2D,
    itemRadius: number,
    itemSpacing: number,
  ): GridItemPositionFunction {
    const slotRadius = itemRadius + itemSpacing;
    const slotWidth = 2.0 * slotRadius;

    return ({ x: ix, y: iy }) =>
      add2D(center, {
        x: ix * slotWidth + MathUtil.modulo(iy, 2) * slotRadius,
        y: -iy * slotWidth,
      });
  },
};
