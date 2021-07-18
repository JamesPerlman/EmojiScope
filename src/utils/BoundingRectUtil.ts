import { BoundingRect } from 'react-measure';
import { Point2D, Scale2D, Size2D } from '../libs';

export const BoundingRectUtil = (function () {
  function getCenter(rect: BoundingRect): Point2D {
    return {
      x: 0.5 * (rect.left + rect.right),
      y: 0.5 * (rect.top + rect.bottom),
    };
  }

  function getScaled(rect: BoundingRect, scale: Scale2D): BoundingRect {
    const center = getCenter(rect);
    return {
      width: scale.x * rect.width,
      height: scale.y * rect.height,
      top: scale.y * (rect.top - center.y),
      left: scale.x * (rect.left - center.x),
      bottom: scale.y * (rect.bottom - center.y),
      right: scale.x * (rect.right - center.x),
    };
  }

  function getNormalized(rect: BoundingRect, gridSize: Size2D): BoundingRect {
    const inverseScale: Scale2D = {
      x: 1 / gridSize.width,
      y: 1 / gridSize.height,
    };
    return getScaled(rect, inverseScale);
  }

  const emptyBoundingRect: BoundingRect = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
  };

  return {
    getCenter,
    getScaled,
    getNormalized,
    emptyBoundingRect,
  };
})(); // End anonymous function for BoundingRectUtil
