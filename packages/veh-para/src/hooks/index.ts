import { Player, Vehicle } from "@infernus/core";
import { vehicleParachuteObject } from "../constants";
import { VehPara } from "../vehPara";
import { stopVehicleParachuteAction } from "../utils/internal";

const orig_putPlayerIn = Vehicle.__inject__.putPlayerIn;

function vp_putPlayerInVehicle(playerId: number, vehicleId: number, seatId: number) {
  const vehicle = Vehicle.getInstance(vehicleId);
  if (vehicle) {
    const vehObjs = vehicleParachuteObject.get(vehicleId);
    if (vehObjs && vehObjs.length && vehObjs[0]?.isValid()) {
      VehPara.toggle(vehicle.id, false);
    }
  }
  return orig_putPlayerIn(playerId, vehicleId, seatId);
}

Vehicle.__inject__.putPlayerIn = vp_putPlayerInVehicle;

const orig_create = Vehicle.__inject__.create;
export function vp_createVehicle(
  vehicleType: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
  color1: string | number,
  color2: string | number,
  respawnDelay: number,
  addSiren: boolean,
) {
  const vehicleId = orig_create(
    vehicleType,
    x,
    y,
    z,
    rotation,
    color1,
    color2,
    respawnDelay,
    addSiren,
  );
  VehPara.toggle(vehicleId, false);
  return vehicleId;
}

Vehicle.__inject__.create = vp_createVehicle;

const orig_addStatic = Vehicle.__inject__.addStatic;
export function vp_addStaticVehicle(
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  color1: string | number,
  color2: string | number,
) {
  const vehicleId = orig_addStatic(modelId, spawnX, spawnY, spawnZ, zAngle, color1, color2);
  VehPara.toggle(vehicleId, false);
  return vehicleId;
}
Vehicle.__inject__.addStatic = vp_addStaticVehicle;

const orig_addStaticEx = Vehicle.__inject__.addStaticEx;
export function vp_addStaticVehicleEx(
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  color1: string | number,
  color2: string | number,
  respawnDelay: number,
  addSiren: boolean,
) {
  const vehicleId = orig_addStaticEx(
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    color1,
    color2,
    respawnDelay,
    addSiren,
  );
  VehPara.toggle(vehicleId, false);
  return vehicleId;
}
Vehicle.__inject__.addStaticEx = vp_addStaticVehicleEx;

const orig_destroy = Vehicle.__inject__.destroy;
export function vp_destroyVehicle(vehicleId: number) {
  VehPara.toggle(vehicleId, false);
  return orig_destroy(vehicleId);
}
Vehicle.__inject__.destroy = vp_destroyVehicle;

const orig_setPos = Player.__inject__.setPos;
export function vp_setPlayerPos(playerId: number, x: number, y: number, z: number) {
  const player = Player.getInstance(playerId);
  if (player && VehPara.isUsing(player)) {
    stopVehicleParachuteAction(player, player.getVehicle());
  }
  return orig_setPos(playerId, x, y, z);
}
Player.__inject__.setPos = vp_setPlayerPos;

export {};
