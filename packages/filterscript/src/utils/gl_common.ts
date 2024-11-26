import type { ICommonOptions } from "filterscript/interfaces";
import type { KeysEnum } from "@infernus/core";
import { Player, Vehicle, VehicleModelInfoEnum } from "@infernus/core";
import { degreesToRadians } from "./convert";

export const isKeyJustDown = (
  key: KeysEnum,
  newKeys: KeysEnum,
  oldKeys: KeysEnum,
) => {
  if (newKeys & key && !(oldKeys & key)) return true;
  return false;
};

export const playSoundForAll = (
  soundId: number,
  x: number,
  y: number,
  z: number,
) => {
  Player.getInstances().forEach((p) => {
    if (p.isConnected()) p.playSound(soundId, x, y, z);
  });
};

export const playSoundForPlayersInRange = (
  soundId: number,
  range: number,
  x: number,
  y: number,
  z: number,
) => {
  Player.getInstances().forEach((p) => {
    if (p.isConnected() && p.isInRangeOfPoint(range, x, y, z))
      p.playSound(soundId, x, y, z);
  });
};

export const log = (options: ICommonOptions, msg: string) => {
  if (options.debug) console.log(msg);
};

export const RETURN_USER_FAILURE = -1;
export const RETURN_USER_MULTIPLE = -2;

export function returnUser(idOrName: string) {
  let result = RETURN_USER_FAILURE;

  const _idOrName = idOrName.trim(); // Strip out leading spaces
  if (!_idOrName) return RETURN_USER_FAILURE; // No passed text

  result = +_idOrName;

  // id
  if (!Number.isNaN(result)) {
    const user = Player.getInstance(result);
    if (!user) return RETURN_USER_FAILURE;
    return result;
  }
  // name
  const count = Player.getInstances().filter((p) => p.getName() === idOrName);
  if (!count.length) return RETURN_USER_FAILURE;
  if (count.length > 1) return RETURN_USER_MULTIPLE;
  return count[0].id;
}

export function spawnVehicleInFrontOfPlayer(
  player: Player,
  vehicleModel: number,
  color1: number,
  color2: number,
) {
  const { x, y, z } = player.getPos()!;

  let facing = player.getFacingAngle();

  const { x: size_x, z: size_z } = Vehicle.getModelInfo(
    vehicleModel,
    VehicleModelInfoEnum.SIZE,
  );

  const distance = size_x + 0.5;

  const _x = x + distance * Math.sin(degreesToRadians(-facing));
  const _y = y + distance * Math.cos(degreesToRadians(-facing));

  facing += 90.0;
  if (facing > 360.0) facing -= 360.0;

  const veh = new Vehicle({
    modelId: vehicleModel,
    x: _x,
    y: _y,
    z: z + size_z * 0.25,
    zAngle: facing,
    color: [color1, color2],
    respawnDelay: -1,
  });
  veh.create();
  return veh;
}
