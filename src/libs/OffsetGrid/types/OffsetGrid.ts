import { MathUtil } from '../../../utils';
import { GridConstants } from '../constants';
import { indexToCoordinate } from '../utils';
import { Point2D, Scale2D } from './2DTypes';
/**
 * @description
 * The OffsetGrid itself just allows you to do two things:
 * 1. Get the 2D coordinate of an item by its index,
 * 2. Get the index of an item given a 2D coordinate.
 *
 * This is a type because we want it to be ultra-lightweight and optimize the functions it contains
 *
 */

export type OffsetGrid = {
  itemRadius: number;
  itemSpacing: number;
  gridSpaceSize: number;
  getPositionFromGridIndex: (index: number) => Point2D;
  getGridIndexFromPosition: (position: Point2D) => number;
};

export const createOffsetGrid = (function () {
  const defaultStretchXY = { x: 1.0, y: GridConstants.yAxisCompression };
  const origin: Point2D = { x: 0, y: 0 };

  return function (
    itemRadius: number,
    itemSpacing: number,
    offsetXY: Point2D = origin,
    stretchXY = defaultStretchXY,
  ): OffsetGrid {
    const { x: ox, y: oy } = offsetXY;
    const { x: sx, y: sy } = stretchXY;

    const gridSpaceSize = 2 * itemRadius + itemSpacing;

    return {
      itemRadius,
      itemSpacing,
      gridSpaceSize,

      getPositionFromGridIndex: function (index: number): Point2D {
        const baseCoord = indexToCoordinate(index);
        const retval = {
          x: ox + sx * gridSpaceSize * (baseCoord.x + 0.5 * MathUtil.modulo(baseCoord.y, 2)),
          y: oy + sy * gridSpaceSize * baseCoord.y,
        };
        console.log(retval);
        return retval;
      },
      getGridIndexFromPosition: function (position: Point2D): number {
        return 0;
      },
    };
  };
})();