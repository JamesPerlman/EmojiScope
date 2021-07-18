import { getCartesianDistance, origin2D, Point2D } from '../../libs';
import { ItemStyleEffect } from './ItemStyleEffect';

// this creates an edge-fade effect which produces an opacity value that drops off from 100% -> 0% between (radius, radius + dropoff)
// please make fadeDropOffDistance a non-zero number, please.
export function createEdgeFadeEffect(startFadeOutDistance: number, fadeDropOffDistance: number): ItemStyleEffect {
  // privately-scoped getOpacity function
  function getOpacity(distToCenter: number): number {
    if (distToCenter <= startFadeOutDistance) {
      return 1;
    } else {
      return Math.max(0, 1 + (startFadeOutDistance - distToCenter) / fadeDropOffDistance);
    }
  }

  return {
    // itemPosition is intended to be the position of the ReactiveGridItem
    // effectPosition is intended to be the center of the ReactiveGrid
    getStyle: function ({ itemPosition, centerPosition }) {
      return {
        opacity: getOpacity(getCartesianDistance(itemPosition, centerPosition ?? origin2D)),
      };
    },
  };
}
