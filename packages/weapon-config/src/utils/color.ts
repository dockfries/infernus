export function darkenRGBA(color: number) {
  const r = ((color >>> 24) & 0xff) / 2;
  const g = ((color >>> 16) & 0xff) / 2;
  const b = ((color >>> 8) & 0xff) / 2;
  const a = color & 0xff;
  return (r << 24) | (g << 16) | (b << 8) | a;
}
