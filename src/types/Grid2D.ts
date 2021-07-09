import { Point2D } from './Point2D';
import { Index2D } from './Index2D';

import {
  GridUtil,
  GridItemPositionFunction,
  GridPointDisplacementFunction,
  GridPointScaleFunction,
  GridAxis,
} from '../utils';

/*
 * Grid2D generates geometric functions that allow elements to be magnified and displaced around a focus point
 */
export class Grid2D {
  /*
   * informational props
   */
  public readonly center: Point2D;
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
    center: Point2D,
    itemRadius: number,
    itemSpacing: number,
    maxScale: number,
    effectRadius: number,
  ) {
    this.center = center;
    this.itemRadius = itemRadius;
    this.itemSpacing = itemSpacing;
    this.maxScale = maxScale;
    this.effectRadius = effectRadius;

    this.getScale = GridUtil.createScaleFunction(effectRadius, maxScale);
    this.getDisplacement = GridUtil.createDisplacementFunction(effectRadius, maxScale);
    this.getItemPosition = GridUtil.createItemPositionFunction(center, itemRadius, itemSpacing);
  }

  indexToXY = (function () {
    const ringNumNodes = (n: number): number => 6 * n + 1;
    const ringStartPoint = (n: number): Index2D => ({ x: n, y: 0 });
    const ringEndPoint = (n: number): Index2D => ({ x: n + 1, y: 0 });

    return (index: number): Index2D => {
      let p: Index2D = { x: 0, y: 0 };
      if (index === 0) {
        return p;
      }

      let n = 1; // ring index
      let i = 1;
      // iterate through rings
      while (true) {
        // make the appropriate pattern of moves until index is reached

        // walk NXPY n times
        for (let j = 1; j < n; ++j) {
          p = GridUtil.walk(p, GridAxis.NXPY);
          if (++i > index) return p;
        }

        // walk NX n times
        for (let j = 1; j < n; ++j) {
          p = GridUtil.walk(p, GridAxis.NX);
          if (++i > index) return p;
        }

        // walk NXNY n times
        for (let j = 1; j < n; ++j) {
          p = GridUtil.walk(p, GridAxis.NXNY);
          if (++i > index) return p;
        }

        // walk PXNY n times
        for (let j = 1; j < n; ++j) {
          p = GridUtil.walk(p, GridAxis.PXNY);
          if (++i > index) return p;
        }

        // walk PX n+1 times
        for (let j = 1; j < n + 1; ++j) {
          p = GridUtil.walk(p, GridAxis.PX);
          if (++i > index) return p;
        }

        // walk PXPY n items
        for (let j = 1; j < n; ++j) {
          p = GridUtil.walk(p, GridAxis.PXPY);
          if (++i > index) return p;
        }

        // increment ring index
        ++n;
        // walk over to start of next ring
      }
    };
  })();
}
