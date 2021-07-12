import { Point2D } from '../../libs';
import { ItemStyleEffect } from './ItemStyleEffect';

/*
This magnification effect was pretty fun to figure out.  We could split it into two effects; one for scale and one for position,
however they are mathematically related quite intimately, and it improves the program's efficiency to keep them together too!
*/

export const createMagnificationEffect = (function () {
  // OK, so first we define our mathematical helper functions

  /**
   * @description A factory which creates an optimized and efficient magnification scaling function
   * @param {number} r - Effect radius
   * @param {number} s - Maximum scale
   * @return {number} - The magnified scale
   */
  function createScaleFunction(r: number, s: number) {
    // define some convenient vars

    const a = 0.5 * s;
    const b = Math.PI / r;

    // scale helper function (the curve portion, single-dimension, unbounded, non-piecewise)
    function fScale(t: number, p: number): number {
      return 1.0 + a * (Math.cos(b * (t - p)) + 1.0);
    }

    /*
     * Now we can construct the parametric (single-dimension only) piecewise versions of these functions
     * This function's value follows the fScale curve when t is within the effect range, otherwise returns 1
     */

    function pScale(t: number, p: number): number {
      return Math.abs(t - p) < r ? fScale(t, p) : 1;
    }

    /*
     * Now that we have all the pieces we can return the two-dimensional scale function
     */

    return function (itemPosition: Point2D, effectPosition: Point2D): number {
      // scale should be minimum of parametric scale for x and y
      return Math.min(
        pScale(itemPosition.x, effectPosition.x),
        pScale(itemPosition.y, effectPosition.y),
      );
    };
  }

  /**
   * @description A factory which creates an optimized and efficient magnification displacement function
   * @param {number} r - Effect radius
   * @param {number} s - Maximum scale
   * @return {Point2D} - The displaced point
   */
  function createDisplacementFunction(r: number, s: number) {
    // define some convenient vars

    const a = (2.0 + s) / 2.0;
    const b = (r * s) / (2.0 * Math.PI);
    const c = Math.PI / r;

    const r1a = r * (1 - a);
    const bsincr = b * Math.sin(c * r);

    /*
     * Construct the piecewise displacement function - see Desmos graph in research folder for how this was calculated
     */
    function pDisp(t: number, p: number) {
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
    }

    /*
     * Now we can return the two-dimensional displacement function
     */

    return function (itemPosition: Point2D, effectPosition: Point2D): Point2D {
      return {
        x: pDisp(itemPosition.x, effectPosition.x),
        y: pDisp(itemPosition.y, effectPosition.y),
      };
    };
  }

  /**
   * HERE IT IS!
   * The actual factory function which creates the ItemStyleEffect
   */

  return function (effectRadius: number, maximumScale: number): ItemStyleEffect {
    const getTranslation = createDisplacementFunction(effectRadius, maximumScale);
    const getScale = createScaleFunction(effectRadius, maximumScale);

    return {
      getStyle: function (itemPosition: Point2D, effectPosition: Point2D) {
        const { x, y } = getTranslation(itemPosition, effectPosition);
        const s = getScale(itemPosition, effectPosition);

        return {
          transform: `translate(${x}px, ${y}px) scale(${s}, ${s})`,
        };
      }, // end of getStyle func
    }; // end of return object
  }; // end of factory function
})();
