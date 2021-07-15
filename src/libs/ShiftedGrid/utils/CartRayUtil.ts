// Cartesian Ray

import { CartRay, Point2D } from '../types';

export function createCartRay(startPoint: Point2D, directionPoint: Point2D): CartRay {
  return {
    startPoint,
    directionPoint,
    contains: function (point: Point2D): boolean {
      return true;
    },
    intersectionPoint: function (ray: CartRay): Point2D {
      return startPoint;
    },
  };
}
