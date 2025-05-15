export function getRotationQuaternion(x: number, y: number, z: number) {
  const cx = Math.cos(-0.5 * x);
  const sx = Math.sin(-0.5 * x);
  const cy = Math.cos(-0.5 * y);
  const sy = Math.sin(-0.5 * y);
  const cz = Math.cos(-0.5 * z);
  const sz = Math.sin(-0.5 * z);

  const qw = cx * cy * cz + sx * sy * sz;
  const qx = cx * sy * sz + sx * cy * cz;
  const qy = cx * sy * cz - sx * cy * sz;
  const qz = cx * cy * sz - sx * sy * cz;

  return { qw, qx, qy, qz };
}
