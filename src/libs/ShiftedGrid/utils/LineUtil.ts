import { GridConstants } from '../constants';
import { CartesianSlope, GridRay, Point2D, SlopeInterceptLine } from '../types';
import { CartesianUtil } from './CartesianUtil';

const { EPSILON } = GridConstants;
export const LineUtil = {
  getIntersection: function (
    line1: SlopeInterceptLine,
    line2: SlopeInterceptLine,
  ): Point2D | undefined {
    const slopeDifference = line1.slope - line2.slope;

    // If slopes are computationally similar enough, we assume they don't intersect.
    if (Math.abs(slopeDifference) <= EPSILON) {
      return undefined;
    }

    const x = (line2.intercept - line1.intercept) / slopeDifference;
    const y = line1.slope * x + line1.intercept;

    return { x, y };
  },
  getLineFromGridRay: function (ray: GridRay): SlopeInterceptLine {
    const slope = CartesianSlope[ray.direction];

    const { x: cx, y: cy } = CartesianUtil.gridToCart(ray.startCoord);

    const intercept = cy - slope * cx;

    return { slope, intercept };
  },
};
