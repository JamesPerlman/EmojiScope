import { GridConstants } from '../constants';
import { Point2D, SlopeInterceptLine } from '../types';

const { EPSILON } = GridConstants;

export function getLineIntersection(
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
}
