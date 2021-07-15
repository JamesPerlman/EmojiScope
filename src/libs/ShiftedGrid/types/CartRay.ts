import { Point2D } from './2DTypes';

export type CartRay = {
  startPoint: Point2D;
  directionPoint: Point2D;
  contains: (point: Point2D) => boolean;
  intersectionPoint: (ray: CartRay) => Point2D | undefined;
};
