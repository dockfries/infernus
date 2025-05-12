export function floatFraction(num: number) {
  return num > 0 ? num - Math.floor(num) : num - Math.ceil(num);
}
