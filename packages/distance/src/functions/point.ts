import { vectorSize } from "./math";

export function getPointDistanceToPoint2D(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  return vectorSize(x1 - x2, y1 - y2, 0.0);
}

export function getPointDistanceToPoint3D(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
) {
  return vectorSize(x1 - x2, y1 - y2, z1 - z2);
}

export function isPointInRangeOfPoint2D(
  range: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  return vectorSize(x1 - x2, y1 - y2, 0.0) <= range;
}

export function isPointInRangeOfPoint3D(
  range: number,
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
) {
  return vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range;
}

export function getPointDistanceToPoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number;
export function getPointDistanceToPoint(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
): number;
export function getPointDistanceToPoint(
  ...args:
    | [number, number, number, number]
    | [number, number, number, number, number, number]
): number {
  if (args.length === 4) {
    return getPointDistanceToPoint2D(...args);
  } else {
    return getPointDistanceToPoint3D(...args);
  }
}

export function isPointInRangeOfPoint(
  range: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): boolean;
export function isPointInRangeOfPoint(
  range: number,
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
): boolean;
export function isPointInRangeOfPoint(
  range: number,
  ...args:
    | [number, number, number, number]
    | [number, number, number, number, number, number]
): boolean {
  if (args.length === 4) {
    return isPointInRangeOfPoint2D(range, ...args);
  } else {
    return isPointInRangeOfPoint3D(range, ...args);
  }
}
