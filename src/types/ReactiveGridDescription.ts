import { Point2D } from './Point2D';
import { MathUtil } from '../utils';
import { ReactiveGrid } from '../components';

/*
 * Some useful types
 */
export type Index2D = { x: number; y: number };

export type GridItemPositionFunction = (indices: Index2D) => Point2D;
export type GridPointScaleFunction = (point: Point2D, effectCenter?: Point2D) => number;
export type GridPointDisplacementFunction = (point: Point2D, effectCenter?: Point2D) => Point2D;

/*
 * ReactiveGridDescription generates geometric functions that allow elements to be magnified and displaced around a focus point
 */
export class ReactiveGridDescription {
  /*
   * informational props
   */
  public readonly itemRadius: number;
  public readonly itemSpacing: number;
  public readonly maxScale: number;
  public readonly effectRadius: number;

  /*
   * grid geometry functions that will be generated in the constructor
   */
  public readonly getScale: GridPointScaleFunction;
  public readonly getDisplacement: GridPointDisplacementFunction;
  public readonly getItemPosition: GridItemPositionFunction;

  /*
   * What a beautiful constructor this is.
   */

  public constructor(
    itemRadius: number,
    itemSpacing: number,
    maxScale: number,
    effectRadius: number,
  ) {
    this.itemRadius = itemRadius;
    this.itemSpacing = itemSpacing;
    this.maxScale = maxScale;
    this.effectRadius = effectRadius;

    this.getScale = ReactiveGridDescription.createScaleFunction(effectRadius, maxScale);

    this.getDisplacement = ReactiveGridDescription.createDisplacementFunction(
      effectRadius,
      maxScale,
    );

    this.getItemPosition = ReactiveGridDescription.createItemPositionFunction(
      itemRadius,
      itemSpacing,
    );
  }

  // TODO: these factory functions could probably exist in a util
  /*
   * getScale function factory
   */

  private static createScaleFunction(
    effectRadius: number,
    maxScale: number,
  ): GridPointScaleFunction {
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
  }

  /*
   * Displacement function factory
   * creates an optimized and efficient displacement function
   */

  private static createDisplacementFunction(
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
     * Now that we have all the pieces we can return the two-dimensional displacement function
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
  }

  /*
   * Item Position Function Factory
   */
  private static createItemPositionFunction(
    itemRadius: number,
    itemSpacing: number,
  ): GridItemPositionFunction {
    const slotRadius = itemRadius + itemSpacing;

    return (indices) => ({
      x: (2.0 * indices.x + MathUtil.modulo(indices.y, 2)) * slotRadius,
      y: MathUtil.SQRT3 * indices.y * slotRadius,
    });
  }
}
