export function ac_IpToInt(ip: string): number {
  const [b3, b2, b1, b0] = ip.split(".").map(Number);
  return (b3 << 24) | (b2 << 16) | (b1 << 8) | b0;
}
