type XYNumeric = {
  x: number,
  y: number
}

// I wish there was a way to statically enforce x and y to be integers.
// (without using io-ts runtime validation)

// Basically the names for these types are just hints to the developer and make the code more readable in my opinion
export type Index2D = XYNumeric;
export type Point2D = XYNumeric;

// TODO: look for a better way to do this...
export function add<T extends XYNumeric>(a: T, b: T): T {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  } as T;
}
