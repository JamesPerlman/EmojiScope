import { MathUtil } from '../../../utils';
import { GridConstants } from '../constants';
import { indexToGridCoord } from '.';
import { Index2D, Point2D, ShiftedGrid } from '../types';
import { gridCoordToIndex } from './IndexUtil';
import { cartToGrid, gridToCart } from './CartesianUtil';

// TODO: add JSDoc
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

    const unitSize = {
      width: sx * spaceSize,
      height: sy * spaceSize,
    };

    return {
      itemRadius,
      itemSpacing,
      unitSize,

      indexToGridCoord,

      gridCoordToIndex,

      gridCoordToScreenPoint: function (coord): Point2D {
        const { x: cx, y: cy } = gridToCart(coord);
        return {
          x: ox + unitSize.width * cx,
          y: oy + unitSize.height * cy,
        };
      },

      screenPointToGridCoord: function ({ x: gx, y: gy }): Index2D {
        const cartPoint = {
          x: (gx - ox) / unitSize.width,
          y: (gy - oy) / unitSize.height,
        };
        return cartToGrid(cartPoint);
      },
    };
  };
})();
