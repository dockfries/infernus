import { Player } from "@infernus/core";
import { vectorSize } from "./math";
import { badGetPlayerDistanceFromPoint, setPlayerHook } from "./hook";

export function getPlayerDistanceToPoint2D(
  player: Player,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = player.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, 0);
  }
  return Number.NaN;
}

export function isPlayerInRangeOfPoint2D(
  player: Player,
  range: number,
  x: number,
  y: number,
) {
  const { x: x2, y: y2, ret } = player.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, 0) <= range);
}

export function getPlayerDistanceToPoint3D(
  player: Player,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = player.getPos();
  if (ret) {
    return vectorSize(x - x2, y - y2, z - z2);
  }
  return Number.NaN;
}

export function isPlayerInRangeOfPoint3D(
  player: Player,
  range: number,
  x: number,
  y: number,
  z: number,
) {
  const { x: x2, y: y2, z: z2, ret } = player.getPos();
  return !!(ret && vectorSize(x - x2, y - y2, z - z2) <= range);
}

export function getPlayerDistanceToPlayer(player: Player, target: Player) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  if (ret1 && ret2) {
    return vectorSize(x1 - x2, y1 - y2, z1 - z2);
  }
  return Number.NaN;
}

export function isPlayerInRangeOfPlayer(
  player: Player,
  target: Player,
  range: number,
  ignoreVW = false,
  ignoreInterior = false,
) {
  const { x: x1, y: y1, z: z1, ret: ret1 } = player.getPos();
  const { x: x2, y: y2, z: z2, ret: ret2 } = target.getPos();
  return !!(
    ret1 &&
    ret2 &&
    vectorSize(x1 - x2, y1 - y2, z1 - z2) <= range &&
    (ignoreVW || player.getVirtualWorld() === target.getVirtualWorld()) &&
    (ignoreInterior || player.getInterior() === target.getInterior())
  );
}

export function getClosestPlayerToPlayer(
  player: Player,
  ignoreVW = false,
  ignoreInterior = false,
): Player | null {
  const { x, y, z, ret } = player.getPos();
  if (!ret) {
    return null;
  }
  let distance = Number.POSITIVE_INFINITY;
  let closest: Player | null = null;
  let distance2 = 0;
  if (ignoreInterior) {
    if (ignoreVW) {
      Player.getInstances().forEach((i) => {
        if (
          i !== player &&
          (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) <
            distance
        ) {
          distance = distance2;
          closest = i;
        }
      });
    } else {
      const vw = player.getVirtualWorld();
      Player.getInstances().forEach((i) => {
        if (
          i !== player &&
          vw === i.getVirtualWorld() &&
          (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) <
            distance
        ) {
          distance = distance2;
          closest = i;
        }
      });
    }
  } else {
    if (ignoreVW) {
      const interior = player.getInterior();
      Player.getInstances().forEach((i) => {
        if (
          i !== player &&
          interior === i.getInterior() &&
          (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) <
            distance
        ) {
          distance = distance2;
          closest = i;
        }
      });
    } else {
      const vw = player.getVirtualWorld();
      const interior = player.getInterior();
      Player.getInstances().forEach((i) => {
        if (
          i !== player &&
          vw === i.getVirtualWorld() &&
          interior === i.getInterior() &&
          (distance2 = badGetPlayerDistanceFromPoint.call(i, x, y, z)) <
            distance
        ) {
          distance = distance2;
          closest = i;
        }
      });
    }
  }
  return closest;
}

export function getPlayerDistanceToPoint(
  player: Player,
  x: number,
  y: number,
): number;
export function getPlayerDistanceToPoint(
  player: Player,
  x: number,
  y: number,
  z: number,
): number;
export function getPlayerDistanceToPoint(
  player: Player,
  ...args: [number, number] | [number, number, number]
): number {
  if (args.length === 2) {
    return getPlayerDistanceToPoint2D(player, ...args);
  } else {
    return getPlayerDistanceToPoint3D(player, ...args);
  }
}

export function isPlayerInRangeOfPoint(
  player: Player,
  range: number,
  x: number,
  y: number,
): boolean;
export function isPlayerInRangeOfPoint(
  player: Player,
  range: number,
  x: number,
  y: number,
  z: number,
): boolean;
export function isPlayerInRangeOfPoint(
  player: Player,
  range: number,
  ...args: [number, number] | [number, number, number]
): boolean {
  if (args.length === 2) {
    return isPlayerInRangeOfPoint2D(player, range, ...args);
  } else {
    return isPlayerInRangeOfPoint3D(player, range, ...args);
  }
}

setPlayerHook("getDistanceFromPoint", function (x, y, z) {
  return getPlayerDistanceToPoint(this, x, y, z);
});

setPlayerHook("isInRangeOfPoint", function (x, y, z) {
  return isPlayerInRangeOfPoint(this, x, y, z);
});
