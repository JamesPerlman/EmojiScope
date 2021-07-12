import { Point2D, SlopeInterceptLine } from '../types';

export function getLineIntersection(
  line1: SlopeInterceptLine,
  line2: SlopeInterceptLine,
): Point2D | undefined {
  const slopeDifference = line1.slope - line2.slope;

  // Perhaps consider using an epsilon value here, for values close to zero
  if (slopeDifference === 0) {
    return undefined;
  }

  const x = (line2.intercept - line1.intercept) / slopeDifference;
  const y = line1.slope * x + line1.intercept;

  return { x, y };
}
