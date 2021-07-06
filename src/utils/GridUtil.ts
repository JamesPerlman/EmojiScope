import { add, Index2D, Point2D } from '../types';
import { MathUtil } from './MathUtil';

// There are six directions (pseudo-axes) a point can move along this shifted grid
export enum GridAxis {
  NX, // negative x
  PX, // positive x
  NXNY, // negative x, negative y
  NXPY, // negative x, positive y
  PXNY, // positive x, negative y
  PXPY, // positive x, positive y
}

export type GridItemPositionFunction = (indices: Index2D) => Point2D;
export type GridPointScaleFunction = (point: Point2D, effectCenter?: Point2D) => number;
export type GridPointDisplacementFunction = (point: Point2D, effectCenter?: Point2D) => Point2D;

export const GridUtil = {
  /**
   * Translates a point along the grid by a magnitude in a direction
   * @param {Index2D} p - The starting indices to translate from
   * @param {GridAxis} axis - The axis along which to move
   * @param {number} m - The magnitude along the axis to translate by
   *
   * @return {Index2D} - The translated indices
   */
  translate: (function () {
    // I like to encapsulate simple convenience functions like this because it's only used inside this translate function and it's very DRY
    // For diagonal moves, if p.y is even we use Math.ceil, and if p.y is odd we use Math.floor
    function dx(py: number, m: number): number {
      if (py % 2 === 0) {
        return Math.ceil(m / 2);
      } else {
        return Math.floor(m / 2);
      }
    }

    // The actual function...
    return (p: Index2D, axis: GridAxis, m: number): Index2D => {
      switch (axis) {
        case GridAxis.NX:
          return { x: p.x - m, y: p.y };
        case GridAxis.PX:
          return { x: p.x + m, y: p.y };
        case GridAxis.NXNY:
          return { x: p.x - dx(p.y, m), y: p.y - m };
        case GridAxis.NXPY:
          return { x: p.x - dx(p.y, m), y: p.y + m };
        case GridAxis.PXNY:
          return { x: p.x + dx(p.y, m), y: p.y - m };
        case GridAxis.PXPY:
          return { x: p.x + dx(p.y, m), y: p.y + m };
      }
    };
  })(),

  /**
   * walk along the grid by 1 position along an axis
   * @param {Index2D} p - The starting indices to translate from
   * @param {GridAxis} axis - The axis along which to move
   *
   * @return {Index2D} - The translated indices
   */

  walk: (function () {
    const dx = (py: number) => (py % 2 === 0 ? 1 : 0);

    return (p: Index2D, axis: GridAxis): Index2D => {
      switch (axis) {
        case GridAxis.NX:
          return { x: p.x - 1, y: p.y };
        case GridAxis.PX:
          return { x: p.x + 1, y: p.y };
        case GridAxis.NXNY:
          return { x: p.x - dx(p.y), y: p.y - 1 };
        case GridAxis.NXPY:
          return { x: p.x - dx(p.y), y: p.y + 1 };
        case GridAxis.PXNY:
          return { x: p.x + dx(p.y), y: p.y - 1 };
        case GridAxis.PXPY:
          return { x: p.x + dx(p.y), y: p.y + 1 };
      }
    };
  })(),

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

    return (indices) =>
      add(center, {
        x: (2.0 * indices.x + MathUtil.modulo(indices.y, 2)) * slotRadius,
        y: MathUtil.SQRT3 * indices.y * slotRadius,
      });
  },
};
