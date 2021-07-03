import { Point2D } from './Point2D';
import { MathUtil } from '../utils';

export type GridPositionFunction = (xIndex: number, yIndex: number) => Point2D;

// TODO: refactor to module pattern, it will be faster.
// TODO: magRadius -> effectRadius ?
export class ReactiveGridDescription {
  readonly itemRadius: number;
  readonly itemSpacing: number;
  readonly maxScale: number;
  readonly magRadius: number;

  private readonly slotRadius: number;

  constructor(itemRadius: number, itemSpacing: number, maxScale: number, magRadius: number) {
    this.itemRadius = itemRadius;
    this.itemSpacing = itemSpacing;
    this.maxScale = maxScale;
    this.magRadius = magRadius;

    // calculate some helper variables
    this.slotRadius = itemRadius + itemSpacing;
  }

  getItemPosition: GridPositionFunction = (xIndex, yIndex) => ({
    x: (2.0 * xIndex + MathUtil.modulo(yIndex, 2)) * this.slotRadius,
    y: MathUtil.SQRT3 * yIndex * this.slotRadius,
  });

  /** HELPER FUNCTIONS */
  // TODO: clean these up and generate them in the constructor
  // scale helper function
  private cosineScale = (t: number, p: number): number => {
    return 1.0 + 0.5 * this.maxScale * (Math.cos((Math.PI / this.magRadius) * (t - p)) + 1.0);
  };

  // displacement helper function (the integral of the scale helper function)
  private sineDisplacement = (t: number, p: number): number => {
    return (
      0.5 * (2.0 + this.maxScale) * t +
      ((this.magRadius * this.maxScale) / (2.0 * Math.PI)) *
        Math.sin((Math.PI / this.magRadius) * (t - p))
    );
  };

  /**
   * PRIVATE PARAMETRIC SCALE / DISPLACEMENT GETTERS
   * ONE DIMENSION ONLY
   */

  /**
   * Gets scale along a single axis
   * @param {number} t - a variable value along the axis of interest
   * @param {number} p - a fixed value (point of interest) at which the scale is maximum
   * @return {number}
   */
  private getParametricScale = (t: number, p: number): number => {
    return Math.abs(t - p) < this.magRadius ? this.cosineScale(t, p) : 1.0;
  };

  /**
   * Gets displacement along a single axis
   * @param {number} t - a variable value along the axis of interest
   * @param {number} p - a fixed value (point of interest) at which the displacement is maximum
   * @return {number}
   */
  private getParametricDisplacement = (t: number, p: number): number => {
    if (t < p - this.magRadius) {
      return t - (p - this.magRadius) + this.sineDisplacement(p - this.magRadius, p);
    }
    if (t > p + this.magRadius) {
      return t - (p + this.magRadius) + this.sineDisplacement(p + this.magRadius, p);
    }
    return this.sineDisplacement(t, p) - this.sineDisplacement(p, p);
  };

  /**
   * PUBLIC SCALE / DISPLACEMENT GETTERS
   * TWO DIMENSIONS
   */

  public getItemScale = (itemPosition: Point2D, pointOfInterest?: Point2D): number => {
    if (pointOfInterest === undefined) {
      return 1;
    }

    // scale should be minimum of parametric scale for x and y
    const xScale = this.getParametricScale(itemPosition.x, pointOfInterest.x);
    const yScale = this.getParametricScale(itemPosition.y, pointOfInterest.y);

    return Math.min(xScale, yScale);
  };

  public getItemDisplacement = (itemPosition: Point2D, pointOfInterest?: Point2D): Point2D => {
    if (pointOfInterest === undefined) {
      return { x: 0, y: 0 };
    }

    return {
      x: this.getParametricDisplacement(itemPosition.x, pointOfInterest.x),
      y: this.getParametricDisplacement(itemPosition.y, pointOfInterest.y),
    };
  };
}
