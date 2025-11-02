import {
  DynamicObject,
  ObjectMp,
  Streamer,
  StreamerItemTypes,
} from "@infernus/core";
import { vectorSize } from "./math";

export function getObjectDistanceToPoint2D(
  object: ObjectMp,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = object.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, 0);
  }
  return Number.NaN;
}

export function isObjectInRangeOfPoint2D(
  object: ObjectMp,
  range: number,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = object.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, 0) <= range);
}

export function getObjectDistanceToPoint3D(
  object: ObjectMp,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = object.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, z - z2);
  }
  return Number.NaN;
}

export function isObjectInRangeOfPoint3D(
  object: ObjectMp,
  range: number,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = object.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, z - z2) <= range);
}

export function getObjectDistanceToObject(object: ObjectMp, target: ObjectMp) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isObjectInRangeOfObject(
  object: ObjectMp,
  target: ObjectMp,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestObjectToObject(object: ObjectMp): ObjectMp | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;

  const isGlobal = object.isGlobal();

  const instances = isGlobal
    ? ObjectMp.getInstances()
    : ObjectMp.getPlayersInstances()
        .map(([, o]) => o)
        .flat();

  instances.forEach((obj) => {
    if (!obj.isValid()) return;
    if (
      (isGlobal && obj.id !== object.id) ||
      (!isGlobal &&
        obj.getPlayer() === object.getPlayer() &&
        obj.id !== object.id) ||
      obj.getPlayer() !== object.getPlayer()
    ) {
      distance2 = getObjectDistanceToPoint3D(object, x, y, z);
      if (distance2 < distance) {
        distance = distance2;
        closest = obj;
      }
    }
  });

  return closest;
}

export function getClosestObjectToPlayerObject(
  object: ObjectMp,
): ObjectMp | null {
  if (object.isGlobal()) return null;
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;
  ObjectMp.getInstances().forEach((obj) => {
    if (obj.isValid()) {
      distance2 = getObjectDistanceToPoint3D(object, x, y, z);
      if (distance2 < distance) {
        distance = distance2;
        closest = obj;
      }
    }
  });
  return closest;
}

export function getClosestPlayerObjectToObject(
  object: ObjectMp,
): ObjectMp | null {
  if (!object.isGlobal()) return null;
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;
  ObjectMp.getPlayersInstances()
    .map(([, o]) => o)
    .flat()
    .forEach((obj) => {
      if (obj.isValid()) {
        distance2 = getObjectDistanceToPoint3D(object, x, y, z);
        if (distance2 < distance) {
          distance = distance2;
          closest = obj;
        }
      }
    });
  return closest;
}

export function getObjectDistanceToPoint(
  object: ObjectMp,
  x: number,
  y: number,
): number;
export function getObjectDistanceToPoint(
  object: ObjectMp,
  x: number,
  y: number,
  z: number,
): number;
export function getObjectDistanceToPoint(
  object: ObjectMp,
  ...args: [number, number] | [number, number, number]
): number {
  if (args.length === 2) {
    return getObjectDistanceToPoint2D(object, ...args);
  } else {
    return getObjectDistanceToPoint3D(object, ...args);
  }
}

export function isObjectInRangeOfPoint(
  object: ObjectMp,
  range: number,
  x: number,
  y: number,
): boolean;
export function isObjectInRangeOfPoint(
  object: ObjectMp,
  range: number,
  x: number,
  y: number,
  z: number,
): boolean;
export function isObjectInRangeOfPoint(
  object: ObjectMp,
  range: number,
  ...args: [number, number] | [number, number, number]
): boolean {
  if (args.length === 2) {
    return isObjectInRangeOfPoint2D(object, range, ...args);
  } else {
    return isObjectInRangeOfPoint3D(object, range, ...args);
  }
}

export function getDynObjectDistanceToPoint2D(
  object: DynamicObject,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = object.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, 0);
  }
  return Number.NaN;
}

export function isDynObjectInRangeOfPoint2D(
  object: DynamicObject,
  range: number,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = object.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, 0) <= range);
}

export function getDynObjectDistanceToPoint3D(
  object: DynamicObject,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = object.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, z - z2);
  }
  return Number.NaN;
}

export function isDynObjectInRangeOfPoint3D(
  object: DynamicObject,
  range: number,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = object.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, z - z2) <= range);
}

export function getDynObjectDistanceToDynObject(
  object: DynamicObject,
  target: DynamicObject,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynObjectInRangeOfDynObject(
  object: DynamicObject,
  target: DynamicObject,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestDynObjectToDynObject(
  object: DynamicObject,
): DynamicObject | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closestId = -1;
  let distance2 = 0;
  for (let i = Streamer.getUpperBound(StreamerItemTypes.OBJECT); i >= 1; --i) {
    if (
      i !== object.id &&
      DynamicObject.isValid(i) &&
      (distance2 = Streamer.getDistanceToItem(
        x,
        y,
        z,
        StreamerItemTypes.OBJECT,
        i,
      ).distance) < distance
    ) {
      distance = distance2;
      closestId = i;
    }
  }
  if (closestId === -1) return null;
  return DynamicObject.getInstance(closestId) || new DynamicObject(closestId);
}

export function getDynObjectDistanceToPoint(
  object: DynamicObject,
  x: number,
  y: number,
): number;
export function getDynObjectDistanceToPoint(
  object: DynamicObject,
  x: number,
  y: number,
  z: number,
): number;
export function getDynObjectDistanceToPoint(
  object: DynamicObject,
  ...args: [number, number] | [number, number, number]
): number {
  if (args.length === 2) {
    return getDynObjectDistanceToPoint2D(object, ...args);
  } else {
    return getDynObjectDistanceToPoint3D(object, ...args);
  }
}

export function isDynObjectInRangeOfPoint(
  object: DynamicObject,
  range: number,
  x: number,
  y: number,
): boolean;
export function isDynObjectInRangeOfPoint(
  object: DynamicObject,
  range: number,
  x: number,
  y: number,
  z: number,
): boolean;
export function isDynObjectInRangeOfPoint(
  object: DynamicObject,
  range: number,
  ...args: [number, number] | [number, number, number]
): boolean {
  if (args.length === 2) {
    return isDynObjectInRangeOfPoint2D(object, range, ...args);
  } else {
    return isDynObjectInRangeOfPoint3D(object, range, ...args);
  }
}
