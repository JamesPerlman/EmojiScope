import { MathUtil } from '../../../utils';
import { GridConstants } from '../constants';
import { indexToCoordinate } from '.';
import { Index2D, Point2D, ShiftedGrid } from '../types';
import { coordinateToIndex } from './IndexUtil';

export const createShiftedGrid = (function () {
  const defaultStretchXY = { x: 1.0, y: GridConstants.yAxisCompression };
  const origin: Point2D = { x: 0, y: 0 };

  return function (
    itemRadius: number,
    itemSpacing: number,
    offsetXY: Point2D = origin,
    stretchXY = defaultStretchXY,
  ): ShiftedGrid {
    const { x: ox, y: oy } = offsetXY;
    const { x: sx, y: sy } = stretchXY;

    const spaceSize = 2 * itemRadius + itemSpacing;

    return {
      itemRadius,
      itemSpacing,

      unitSize: {
        width: sx * spaceSize,
        height: sy * spaceSize,
      },

      indexToGridCoord: function (index: number): Index2D {
        const { x: bx, y: by } = indexToCoordinate(index);
        return {
          x: spaceSize * (bx + 0.5 * MathUtil.modulo(by, 2)),
          y: spaceSize * by,
        };
      },

      gridCoordToIndex: coordinateToIndex,

      gridCoordToScreenPoint: function ({ x, y }): Point2D {
        return {
          x: ox + sx * x,
          y: oy + sy * y,
        };
      },

      screenPointToGridCoord: function ({ x, y }): Index2D {
        return {
          x: (x - ox) / sx,
          y: (y - oy) / sy,
        };
      },
    };
  };
})();
