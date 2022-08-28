// Reference to Peter Szombati's samp-node-lib

export const rgba = (value: string): number => {
  if (value.charAt(0) === "#") {
    if (value.length === 4) {
      return parseInt(
        value.charAt(1) +
          value.charAt(1) +
          value.charAt(2) +
          value.charAt(2) +
          value.charAt(3) +
          value.charAt(3) +
          "FF",
        16
      );
    } else if (value.length === 7) {
      return parseInt(value.slice(1, value.length) + "FF", 16);
    } else if (value.length === 9) {
      return parseInt(value.slice(1, value.length), 16);
    }
    return 255;
  }
  const values: number[] = (value.match(/([0-9])+/g) || []).map((v) =>
    parseInt(v, 10)
  );
  if (values.length !== 4 && values.length !== 3) {
    return 255;
  }
  if (values.length === 3) {
    values.push(255);
  } else {
    values[3] = values[3] < 1 ? Math.floor(values[3] * 255) : 255;
  }
  let n = 0;
  values.reverse().forEach((n2, i) => {
    if (n2 !== 0) {
      n += Math.pow(16, i * 2) * n2;
    }
  });
  return n;
};
