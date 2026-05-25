// Reference to Peter Szombati's samp-node-lib

export function rgba(value: string | number): number {
  if (typeof value === "number") return value;
  if (typeof +value === "number" && !isNaN(+value)) return +value;
  if (value.charAt(0) === "#") {
    const hex = value.slice(1);
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hex)) return 255;
    if (hex.length === 3) {
      return parseInt(
        hex.charAt(0) +
          hex.charAt(0) +
          hex.charAt(1) +
          hex.charAt(1) +
          hex.charAt(2) +
          hex.charAt(2) +
          "FF",
        16,
      );
    }
    if (hex.length === 6) return parseInt(hex + "FF", 16);
    return parseInt(hex, 16);
  }
  const values: number[] = (value.match(/(-?[0-9]+(?:\.[0-9]+)?)/g) || []).map((v) =>
    parseFloat(v),
  );
  if (values.length !== 4 && values.length !== 3) {
    return 255;
  }
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  if (values.length === 3) {
    values.push(255);
  } else {
    values[3] =
      values[3] >= 0 && values[3] <= 1 ? Math.floor(values[3] * 255) : clamp(Math.floor(values[3]));
  }
  let n = 0;
  values.reverse().forEach((n2, i) => {
    n += Math.pow(16, i * 2) * clamp(Math.floor(n2));
  });
  return Math.floor(n);
}
