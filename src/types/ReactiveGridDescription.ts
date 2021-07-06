import { Point2D } from './Point2D';
import {
  GridUtil,
  GridItemPositionFunction,
  GridPointDisplacementFunction,
  GridPointScaleFunction,
} from '../utils';

/*
 * ReactiveGridDescription generates geometric functions that allow elements to be magnified and displaced around a focus point
 */
export class ReactiveGridDescription {
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

  // TODO: these factory functions could probably exist in a util
}
