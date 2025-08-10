import { Vehicle } from "@infernus/core";
import { vectorSize } from "./math";
import { badGetVehicleDistanceFromPoint, setVehicleHook } from "./hook";

export function getVehicleDistanceToPoint2D(
  vehicle: Vehicle,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = vehicle.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, 0);
  }
  return Number.NaN;
}

export function isVehicleInRangeOfPoint2D(
  vehicle: Vehicle,
  range: number,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = vehicle.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, 0) <= range);
}

export function getVehicleDistanceToPoint3D(
  vehicle: Vehicle,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = vehicle.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, z - z2);
  }
  return Number.NaN;
}

export function isVehicleInRangeOfPoint3D(
  vehicle: Vehicle,
  range: number,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = vehicle.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, z - z2) <= range);
}

export function getVehicleDistanceToVehicle(vehicle: Vehicle, target: Vehicle) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isVehicleInRangeOfVehicle(
  vehicle: Vehicle,
  target: Vehicle,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || vehicle.getVirtualWorld() === target.getVirtualWorld())
  );
}

export function getClosestVehicleToVehicle(
  vehicle: Vehicle,
  ignoreVW = false,
): Vehicle | null {
  const { x, y, z, ret } = vehicle.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Vehicle | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Vehicle.getInstances().forEach((i) => {
      if (
        i !== vehicle &&
        (distance2 = badGetVehicleDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = vehicle.getVirtualWorld();
    Vehicle.getInstances().forEach((i) => {
      if (
        i !== vehicle &&
        vw === i.getVirtualWorld() &&
        (distance2 = badGetVehicleDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  }
  return closest;
}

export function getVehicleDistanceToPoint(
  vehicle: Vehicle,
  x: number,
  y: number,
): number;
export function getVehicleDistanceToPoint(
  vehicle: Vehicle,
  x: number,
  y: number,
  z: number,
): number;
export function getVehicleDistanceToPoint(
  vehicle: Vehicle,
  ...args: [number, number] | [number, number, number]
): number {
  if (args.length === 2) {
    return getVehicleDistanceToPoint2D(vehicle, ...args);
  } else {
    return getVehicleDistanceToPoint3D(vehicle, ...args);
  }
}

export function isVehicleInRangeOfPoint(
  vehicle: Vehicle,
  range: number,
  x: number,
  y: number,
): boolean;
export function isVehicleInRangeOfPoint(
  vehicle: Vehicle,
  range: number,
  x: number,
  y: number,
  z: number,
): boolean;
export function isVehicleInRangeOfPoint(
  vehicle: Vehicle,
  range: number,
  ...args: [number, number] | [number, number, number]
): boolean {
  if (args.length === 2) {
    return isVehicleInRangeOfPoint2D(vehicle, range, ...args);
  } else {
    return isVehicleInRangeOfPoint3D(vehicle, range, ...args);
  }
}

setVehicleHook("getDistanceFromPoint", function (x, y, z) {
  return getVehicleDistanceToPoint(this, x, y, z);
});
