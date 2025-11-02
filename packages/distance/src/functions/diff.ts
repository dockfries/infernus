import {
  Actor,
  DynamicActor,
  DynamicObject,
  ObjectMp,
  Player,
  Streamer,
  StreamerItemTypes,
  Vehicle,
} from "@infernus/core";
import { vectorSize } from "./math";
import {
  badGetPlayerDistanceFromPoint,
  badGetVehicleDistanceFromPoint,
} from "./hook";
import {
  getActorDistanceToPoint3D,
  getDynActorDistanceToPoint3D,
} from "./actor";
import { getObjectDistanceToPoint3D } from "./object";

export function getVehicleDistanceToPlayer(vehicle: Vehicle, player: Player) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isVehicleInRangeOfPlayer(
  vehicle: Vehicle,
  player: Player,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || vehicle.getVirtualWorld() === player.getVirtualWorld())
  );
}

export function getClosestVehicleToPlayer(
  player: Player,
  ignoreVW = false,
): Vehicle | null {
  const { x, y, z, ret } = player.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Vehicle | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Vehicle.getInstances().forEach((i) => {
      if (
        (distance2 = badGetVehicleDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = player.getVirtualWorld();
    Vehicle.getInstances().forEach((i) => {
      {
        if (
          vw === i.getVirtualWorld() &&
          (distance2 = badGetVehicleDistanceFromPoint.call(i, x, y, z)) <
            distance
        ) {
          distance = distance2;
          closest = i;
        }
      }
    });
  }
  return closest;
}

export function getPlayerDistanceToVehicle(player: Player, vehicle: Vehicle) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isPlayerInRangeOfVehicle(
  player: Player,
  vehicle: Vehicle,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || player.getVirtualWorld() === vehicle.getVirtualWorld())
  );
}

export function getClosestPlayerToVehicle(
  vehicle: Vehicle,
  ignoreVW = false,
): Player | null {
  const { x, y, z, ret } = vehicle.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Player | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Player.getInstances().forEach((i) => {
      if (
        (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = vehicle.getVirtualWorld();
    Player.getInstances().forEach((i) => {
      if (
        vw === i.getVirtualWorld() &&
        (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  }
  return closest;
}

export function getPlayerDistanceToObject(player: Player, object: ObjectMp) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isPlayerInRangeOfObject(
  player: Player,
  object: ObjectMp,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestPlayerToObject(object: ObjectMp): Player | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Player | null = null;
  let distance2 = 0;
  Player.getInstances().forEach((i) => {
    if (
      (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getObjectDistanceToPlayer(object: ObjectMp, player: Player) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isObjectInRangeOfPlayer(
  object: ObjectMp,
  player: Player,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestObjectToPlayer(player: Player): ObjectMp | null {
  const { x, y, z, ret } = player.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;
  ObjectMp.getInstances().forEach((i) => {
    if (
      i.isValid() &&
      (distance2 = getObjectDistanceToPoint3D(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getClosestPlayerObjectToPlayer(
  player: Player,
  objectPlayer?: Player,
): ObjectMp | null {
  const { x, y, z, ret } = player.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;
  (objectPlayer
    ? ObjectMp.getInstances(objectPlayer)
    : ObjectMp.getPlayersInstances()
        .map(([, o]) => o)
        .flat()
  ).forEach((i) => {
    if (
      i.isValid() &&
      (distance2 = getObjectDistanceToPoint3D(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getObjectDistanceToVehicle(object: ObjectMp, vehicle: Vehicle) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isObjectInRangeOfVehicle(
  object: ObjectMp,
  vehicle: Vehicle,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestObjectToVehicle(vehicle: Vehicle): ObjectMp | null {
  const { x, y, z, ret } = vehicle.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;
  ObjectMp.getInstances().forEach((i) => {
    if (
      i.isValid() &&
      (distance2 = getObjectDistanceToPoint3D(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getClosestPlayerObjectToVehicle(
  vehicle: Vehicle,
  objectPlayer?: Player,
): ObjectMp | null {
  const { x, y, z, ret } = vehicle.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;
  (objectPlayer
    ? ObjectMp.getInstances(objectPlayer)
    : ObjectMp.getPlayersInstances()
        .map(([, o]) => o)
        .flat()
  ).forEach((i) => {
    if (
      i.isValid() &&
      (distance2 = getObjectDistanceToPoint3D(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getVehicleDistanceToObject(vehicle: Vehicle, object: ObjectMp) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isVehicleInRangeOfObject(
  vehicle: Vehicle,
  object: ObjectMp,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestVehicleToObject(object: ObjectMp): Vehicle | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Vehicle | null = null;
  let distance2 = 0;
  Vehicle.getInstances().forEach((i) => {
    if (
      (distance2 = badGetVehicleDistanceFromPoint.call(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getDynObjectDistanceToPlayer(
  object: DynamicObject,
  player: Player,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynObjectInRangeOfPlayer(
  object: DynamicObject,
  player: Player,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestDynObjectToPlayer(
  player: Player,
): DynamicObject | null {
  const { x, y, z, ret } = player.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closestId = -1;
  let distance2 = 0;
  for (let i = Streamer.getUpperBound(StreamerItemTypes.OBJECT); i >= 1; --i) {
    {
      if (
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
  }
  if (closestId === -1) return null;
  return DynamicObject.getInstance(closestId) || new DynamicObject(closestId);
}

export function getPlayerDistanceToDynObject(
  player: Player,
  object: DynamicObject,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isPlayerInRangeOfDynObject(
  player: Player,
  object: DynamicObject,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestPlayerToDynObject(
  object: DynamicObject,
): Player | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Player | null = null;
  let distance2 = 0;
  Player.getInstances().forEach((i) => {
    if (
      (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getDynObjectDistanceToObject(
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

export function getDynObjectDistanceToVehicle(
  object: DynamicObject,
  vehicle: Vehicle,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynObjectInRangeOfVehicle(
  object: DynamicObject,
  vehicle: Vehicle,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestDynObjectToVehicle(
  vehicle: Vehicle,
): DynamicObject | null {
  const { x, y, z, ret } = vehicle.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closestId = -1;
  let distance2 = 0;
  for (let i = Streamer.getUpperBound(StreamerItemTypes.OBJECT); i >= 1; --i) {
    {
      if (
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
  }
  if (closestId === -1) return null;
  return DynamicObject.getInstance(closestId) || new DynamicObject(closestId);
}

export function getVehicleDistanceToDynObject(
  vehicle: Vehicle,
  object: DynamicObject,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isVehicleInRangeOfDynObject(
  vehicle: Vehicle,
  object: DynamicObject,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestVehicleToDynObject(
  object: DynamicObject,
): Vehicle | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Vehicle | null = null;
  let distance2 = 0;
  Vehicle.getInstances().forEach((i) => {
    if (
      (distance2 = badGetVehicleDistanceFromPoint.call(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getVehicleDistanceToActor(vehicle: Vehicle, actor: Actor) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isVehicleInRangeOfActor(
  vehicle: Vehicle,
  actor: Actor,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || vehicle.getVirtualWorld() === actor.getVirtualWorld())
  );
}

export function getClosestVehicleToActor(
  actor: Actor,
  ignoreVW = false,
): Vehicle | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Vehicle | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Vehicle.getInstances().forEach((i) => {
      if (
        (distance2 = badGetVehicleDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = actor.getVirtualWorld();
    Vehicle.getInstances().forEach((i) => {
      if (
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

export function getActorDistanceToVehicle(actor: Actor, vehicle: Vehicle) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isActorInRangeOfVehicle(
  actor: Actor,
  vehicle: Vehicle,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || actor.getVirtualWorld() === vehicle.getVirtualWorld())
  );
}

export function getClosestActorToVehicle(
  vehicle: Vehicle,
  ignoreVW = false,
): Actor | null {
  const { x, y, z, ret } = vehicle.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Actor | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Actor.getInstances().forEach((i) => {
      if ((distance2 = getActorDistanceToPoint3D(i, x, y, z)) < distance) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = vehicle.getVirtualWorld();
    Actor.getInstances().forEach((i) => {
      if (
        vw === i.getVirtualWorld() &&
        (distance2 = getActorDistanceToPoint3D(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  }
  return closest;
}

export function getActorDistanceToObject(actor: Actor, object: ObjectMp) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isActorInRangeOfObject(
  actor: Actor,
  object: ObjectMp,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestActorToObject(object: ObjectMp): Actor | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Actor | null = null;
  let distance2 = 0;

  Actor.getInstances().forEach((i) => {
    if ((distance2 = getActorDistanceToPoint3D(i, x, y, z)) < distance) {
      distance = distance2;
      closest = i;
    }
  });

  return closest;
}

export function getObjectDistanceToActor(object: ObjectMp, actor: Actor) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isObjectInRangeOfActor(
  object: ObjectMp,
  actor: Actor,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestObjectToActor(actor: Actor): ObjectMp | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;
  ObjectMp.getInstances().forEach((i) => {
    if (
      i.isValid() &&
      (distance2 = getObjectDistanceToPoint3D(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getClosestPlayerObjectToActor(
  actor: Actor,
  objectPlayer?: Player,
): ObjectMp | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: ObjectMp | null = null;
  let distance2 = 0;
  (objectPlayer
    ? ObjectMp.getInstances(objectPlayer)
    : ObjectMp.getPlayersInstances()
        .map(([, o]) => o)
        .flat()
  ).forEach((i) => {
    if (
      i.isValid() &&
      (distance2 = getObjectDistanceToPoint3D(i, x, y, z)) < distance
    ) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getDynObjectDistanceToActor(
  object: DynamicObject,
  actor: Actor,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynObjectInRangeOfActor(
  object: DynamicObject,
  actor: Actor,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestDynObjectToActor(actor: Actor): DynamicObject | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closestId = -1;
  let distance2 = 0;
  for (let i = Streamer.getUpperBound(StreamerItemTypes.OBJECT); i >= 1; --i) {
    {
      if (
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
  }
  if (closestId === -1) return null;
  return DynamicObject.getInstance(closestId) || new DynamicObject(closestId);
}

export function getActorDistanceToDynObject(
  actor: Actor,
  object: DynamicObject,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isActorInRangeOfDynObject(
  actor: Actor,
  object: DynamicObject,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestActorToDynObject(
  object: DynamicObject,
): Actor | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Actor | null = null;
  let distance2 = 0;
  Actor.getInstances().forEach((i) => {
    if ((distance2 = getActorDistanceToPoint3D(i, x, y, z)) < distance) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getActorDistanceToPlayer(actor: Actor, player: Player) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isActorInRangeOfPlayer(
  actor: Actor,
  player: Player,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || actor.getVirtualWorld() === player.getVirtualWorld())
  );
}

export function getClosestActorToPlayer(
  player: Player,
  ignoreVW = false,
): Actor | null {
  const { x, y, z, ret } = player.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Actor | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Actor.getInstances().forEach((i) => {
      if ((distance2 = getActorDistanceToPoint3D(i, x, y, z)) < distance) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = player.getVirtualWorld();
    Actor.getInstances().forEach((i) => {
      if (
        vw === i.getVirtualWorld() &&
        (distance2 = getActorDistanceToPoint3D(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  }
  return closest;
}

export function getPlayerDistanceToActor(player: Player, actor: Actor) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isPlayerInRangeOfActor(
  player: Player,
  actor: Actor,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || player.getVirtualWorld() === actor.getVirtualWorld())
  );
}

export function getClosestPlayerToActor(
  actor: Actor,
  ignoreVW = false,
): Player | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Player | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Player.getInstances().forEach((i) => {
      if (
        (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = actor.getVirtualWorld();
    Player.getInstances().forEach((i) => {
      if (
        vw === i.getVirtualWorld() &&
        (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  }
  return closest;
}

export function getVehicleDistanceToDynActor(
  vehicle: Vehicle,
  actor: DynamicActor,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isVehicleInRangeOfDynActor(
  vehicle: Vehicle,
  actor: DynamicActor,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = vehicle.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || vehicle.getVirtualWorld() === actor.getVirtualWorld())
  );
}

export function getClosestVehicleToDynActor(
  actor: DynamicActor,
  ignoreVW = false,
): Vehicle | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Vehicle | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Vehicle.getInstances().forEach((i) => {
      if (
        (distance2 = badGetVehicleDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = actor.getVirtualWorld();
    Vehicle.getInstances().forEach((i) => {
      if (
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

export function getDynActorDistanceToVehicle(
  actor: DynamicActor,
  vehicle: Vehicle,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynActorInRangeOfVehicle(
  actor: DynamicActor,
  vehicle: Vehicle,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = vehicle.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || actor.getVirtualWorld() === vehicle.getVirtualWorld())
  );
}

export function getClosestDynActorToVehicle(
  vehicle: Vehicle,
  ignoreVW = false,
): DynamicActor | null {
  const { x, y, z, ret } = vehicle.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: DynamicActor | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    DynamicActor.getInstances().forEach((i) => {
      if ((distance2 = getDynActorDistanceToPoint3D(i, x, y, z)) < distance) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = vehicle.getVirtualWorld();
    DynamicActor.getInstances().forEach((i) => {
      if (
        vw === i.getVirtualWorld() &&
        (distance2 = getDynActorDistanceToPoint3D(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  }
  return closest;
}

export function getDynObjectDistanceToDynActor(
  object: DynamicObject,
  actor: DynamicActor,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynObjectInRangeOfDynActor(
  object: DynamicObject,
  actor: DynamicActor,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = object.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestDynObjectToDynActor(
  actor: DynamicActor,
): DynamicObject | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closestId = -1;
  let distance2 = 0;
  for (let i = Streamer.getUpperBound(StreamerItemTypes.OBJECT); i >= 1; --i) {
    {
      if (
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
  }
  if (closestId === -1) return null;
  return DynamicObject.getInstance(closestId) || new DynamicObject(closestId);
}

export function getDynActorDistanceToDynObject(
  actor: DynamicActor,
  object: DynamicObject,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynActorInRangeOfDynObject(
  actor: DynamicActor,
  object: DynamicObject,
  range: number,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = object.getPos();
  return !!(ret1 && ret2 && vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range);
}

export function getClosestDynActorToDynObject(
  object: DynamicObject,
): DynamicActor | null {
  const { x, y, z, ret } = object.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: DynamicActor | null = null;
  let distance2 = 0;
  DynamicActor.getInstances().forEach((i) => {
    if ((distance2 = getDynActorDistanceToPoint3D(i, x, y, z)) < distance) {
      distance = distance2;
      closest = i;
    }
  });
  return closest;
}

export function getDynActorDistanceToPlayer(
  actor: DynamicActor,
  player: Player,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isDynActorInRangeOfPlayer(
  actor: DynamicActor,
  player: Player,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = actor.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = player.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || actor.getVirtualWorld() === player.getVirtualWorld())
  );
}

export function getClosestDynActorToPlayer(
  player: Player,
  ignoreVW = false,
): DynamicActor | null {
  const { x, y, z, ret } = player.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: DynamicActor | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    DynamicActor.getInstances().forEach((i) => {
      if ((distance2 = getDynActorDistanceToPoint3D(i, x, y, z)) < distance) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = player.getVirtualWorld();
    DynamicActor.getInstances().forEach((i) => {
      if (
        vw === i.getVirtualWorld() &&
        (distance2 = getDynActorDistanceToPoint3D(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  }
  return closest;
}

export function getPlayerDistanceToDynActor(
  player: Player,
  actor: DynamicActor,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isPlayerInRangeOfDynActor(
  player: Player,
  actor: DynamicActor,
  range: number,
  ignoreVW = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = actor.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || player.getVirtualWorld() === actor.getVirtualWorld())
  );
}

export function getClosestPlayerToDynActor(
  actor: DynamicActor,
  ignoreVW = false,
): Player | null {
  const { x, y, z, ret } = actor.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Player | null = null;
  let distance2 = 0;
  if (ignoreVW) {
    Player.getInstances().forEach((i) => {
      if (
        (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  } else {
    const vw = actor.getVirtualWorld();
    Player.getInstances().forEach((i) => {
      if (
        vw === i.getVirtualWorld() &&
        (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) < distance
      ) {
        distance = distance2;
        closest = i;
      }
    });
  }
  return closest;
}
