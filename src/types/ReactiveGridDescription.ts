import { Point2D } from './Point2D';
import { MathUtil } from '../utils';

export type GridPositionFunction = (xIndex: number, yIndex: number) => Point2D;

export type GridDisplacementFunction = (
  xIndex: number,
  yIndex: number,
  pointOfInterest?: Point2D,
) => Point2D;

export class ReactiveGridDescription {
  readonly itemRadius: number;
  readonly itemSpacing: number;
  readonly slotRadius: number;

  constructor(itemRadius: number, itemSpacing: number) {
    this.itemRadius = itemRadius;
    this.itemSpacing = itemSpacing;
    this.slotRadius = itemRadius + itemSpacing;
  }

  getItemPosition: GridPositionFunction = (xIndex, yIndex) => ({
    x: (2.0 * xIndex + MathUtil.modulo(yIndex, 2)) * this.slotRadius,
    y: MathUtil.SQRT3 * yIndex * this.slotRadius,
  });
}
