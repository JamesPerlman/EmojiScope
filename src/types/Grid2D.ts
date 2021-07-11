import { Point2D, Index2D } from '../libs/OffsetGrid/types/2DTypes';
import { indexToCoordinate } from '../libs/OffsetGrid/utils';

import {
  GridItemPositionFunction,
  GridPointDisplacementFunction,
  GridPointScaleFunction,
  GridLayoutUtil,
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
   * Grid index transformers
   */

  public readonly indexToXY: (index: number) => Index2D;

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

    this.getScale = GridLayoutUtil.createScaleFunction(effectRadius, maxScale);
    this.getDisplacement = GridLayoutUtil.createDisplacementFunction(effectRadius, maxScale);
    this.getItemPosition = GridLayoutUtil.createItemPositionFunction(
      center,
      itemRadius,
      itemSpacing,
    );
    this.indexToXY = indexToCoordinate;
  }
}
