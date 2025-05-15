export function floatFraction(num: number) {
  return num > 0 ? num - Math.floor(num) : num - Math.ceil(num);
}

export function wc_CalculateBar(width: number, max: number, value: number) {
  return (width / max) * value;
}

export function angleBetweenPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  return -(90.0 - (Math.atan2(y1 - y2, x1 - x2) * 180) / Math.PI);
}
