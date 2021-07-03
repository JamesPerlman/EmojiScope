export type Point2D = {
  x: number;
  y: number;
};

export function add(a: Point2D, b: Point2D): Point2D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}
