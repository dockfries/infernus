import { DynamicActor } from "@infernus/core";
import { vectorSize } from "./math";

export function getDynActorDistanceToPoint2D(
  actor: DynamicActor,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = actor.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, 0);
  }
  return Number.NaN;
}

export function isDynActorInRangeOfPoint2D(
  actor: DynamicActor,
  range: number,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = actor.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, 0) <= range);
}

export function getDynActorDistanceToPoint3D(
  actor: DynamicActor,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = actor.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, z - z2);
  }
  return Number.NaN;
}

export function isDynActorInRangeOfPoint3D(
  actor: DynamicActor,
  range: number,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = actor.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, z - z2) <= range);
}

export function getDynActorDistanceToDynActor(
  actor: DynamicActor,
  target: DynamicActor,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynActorInRangeOfDynActor(
  actor: DynamicActor,
  target: DynamicActor,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestDynActorToDynActor(
  actor: DynamicActor,
): DynamicActor | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: DynamicActor | null = null;
  let distance2 = 0;
  DynamicActor.getInstances().forEach((i) => {
    if (
      i !== actor &&
      (distance2 = getDynActorDistanceToPoint3D(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getDynActorDistanceToPoint(
  actor: DynamicActor,
  x: number,
  y: number,
): number;
export function getDynActorDistanceToPoint(
  actor: DynamicActor,
  x: number,
  y: number,
  z: number,
): number;
export function getDynActorDistanceToPoint(
  actor: DynamicActor,
  ...args: [number, number] | [number, number, number]
): number {
  return args.length === 2
    ? getDynActorDistanceToPoint2D(actor, ...args)
    : getDynActorDistanceToPoint3D(actor, ...args);
}

export function isDynActorInRangeOfPoint(
  actor: DynamicActor,
  range: number,
  x: number,
  y: number,
): boolean;
export function isDynActorInRangeOfPoint(
  actor: DynamicActor,
  range: number,
  x: number,
  y: number,
  z: number,
): boolean;
export function isDynActorInRangeOfPoint(
  actor: DynamicActor,
  range: number,
  ...args: [number, number] | [number, number, number]
): boolean {
  return args.length === 2
    ? isDynActorInRangeOfPoint2D(actor, range, ...args)
    : isDynActorInRangeOfPoint3D(actor, range, ...args);
}
