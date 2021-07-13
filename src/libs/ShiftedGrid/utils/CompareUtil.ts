export function objectMin<T>(a: T, b: T, getComparisonValue: (o: T) => number): T {
  if (getComparisonValue(a) < getComparisonValue(b)) {
    return a;
  } else {
    return b;
  }
}
