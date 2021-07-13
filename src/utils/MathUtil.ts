export const MathUtil = {
  SQRT3: Math.sqrt(3.0),
  ISQRT3: 1.0 / Math.sqrt(3.0),
  modulo: function (a: number, b: number) {
    return ((a % b) + b) % b;
  },
};
