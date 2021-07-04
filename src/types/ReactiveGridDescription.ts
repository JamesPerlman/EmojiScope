import { Point2D } from './Point2D';
import { MathUtil } from '../utils';

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
   * It creates all the optimized functions we need in order to calculate some really cool reactive grid effects.
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

    // convenience vars
    const s = maxScale;
    //const s_2 = 0.5 * maxScale;
    const r = effectRadius;

    /*
     * Defining geometric functions here optimizes them for speed as they will be used by many components concurrently
     */

    // scale helper function (single-dimension, unbounded, non-piecewise)
    const fScale = (t: number, p: number): number => {
      return 1.0 + 0.5 * s * (Math.cos((Math.PI / r) * (t - p)) + 1.0);
    };

    // displacement helper function is the indefinite integral of fScale (single-dimension, unbounded, non-piecewise)
    const fDisp = (t: number, p: number): number => {
      return 0.5 * (2.0 + s) * t + ((r * s) / (2.0 * Math.PI)) * Math.sin((Math.PI / r) * (t - p));
    };

    // since fDisp is an indefinite integral we need to calculate the C value so that the piecewise version of the displacement function is continuous
    // gDisp includes this necessary calculation
    const gDisp = (t: number, p: number): number => {
      return fDisp(t, p) - fDisp(p, p);
    };

    /*
     * Now we can construct the parametric (single-dimension only) piecewise versions of these functions
     */

    // piecewise scale function (scale value follows the fScale curve when t is within the effect range, otherwise scale = 1)
    const pScale = (t: number, p: number): number => {
      return Math.abs(t - p) < r ? fScale(t, p) : 1;
    };

    // piecewise displacement function (value follows the gDisp curve when t is within the effect range, otherwise it follows a linear path continuous with gDisp)
    const pDisp = (t: number, p: number): number => {
      if (t < p - r) {
        // t is less than point of interest - effect range
        return t - (p - r) + gDisp(p - r, p);
      }
      if (t > p + r) {
        // t is greater than point of interest + effect range
        return t - (p + r) + gDisp(p + r, p);
      }
      // here we can safely assume t is within the effect range
      return gDisp(t, p);
    };

    /*
     * Finally we can compose the above functions to create our full 2D scale and position calculation functions
     */

    this.getScale = (point, effectCenter?) => {
      if (effectCenter === undefined) {
        // no focus point, normal scale
        return 1;
      }

      // scale should be minimum of parametric scale for x and y
      const xScale = pScale(point.x, effectCenter.x);
      const yScale = pScale(point.y, effectCenter.y);

      return Math.min(xScale, yScale);
    };

    this.getDisplacement = (point, effectCenter?) => {
      if (effectCenter === undefined) {
        // no focus point, no displacement
        return { x: 0, y: 0 };
      }

      return {
        x: pDisp(point.x, effectCenter.x),
        y: pDisp(point.y, effectCenter.y),
      };
    };

    /*
     * And of course we need to generate a function that returns the point where an undisplaced item should be
     */

    const slotRadius = itemRadius + itemSpacing;

    this.getItemPosition = (indices) => ({
      x: (2.0 * indices.x + MathUtil.modulo(indices.y, 2)) * slotRadius,
      y: MathUtil.SQRT3 * indices.y * slotRadius,
    });
  }
}
