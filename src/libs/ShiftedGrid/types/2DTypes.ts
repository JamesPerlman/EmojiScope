export type XYNumeric = {
  x: number;
  y: number;
};

// I wish there was a way to statically enforce x and y to be integers.
// (without using io-ts runtime validation)

// Basically the names for these types are just hints to the developer and make the code more readable in my opinion
export type Index2D = XYNumeric;
export type Point2D = XYNumeric;
export type Vector2D = XYNumeric;
export type Scale2D = XYNumeric;

export const origin2D: XYNumeric = { x: 0, y: 0 };

export type Size2D = {
  width: number;
  height: number;
};

// TODO: look for a better way to do this...
export function add2D<T extends XYNumeric>(a: T, b: T): T {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  } as T;
}

export function subtract2D<T extends XYNumeric>(a: T, b: T): T {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  } as T;
}

// returns { -x, -y } for a given XYNumeric
export function negate2D<T extends XYNumeric>(a: T): T {
  return {
    x: -a.x,
    y: -a.y,
  } as T;
}

// Normalizes a given XYNumeric by a Size2D

export function normalize2D<T extends XYNumeric>(a: T, s: Size2D): T {
  return {
    x: a.x / s.width,
    y: a.y / s.height,
  } as T;
}
