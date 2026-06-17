import { findZ_For2DCoord, rayCastLine, WATER_OBJECT } from "@infernus/colandreas";
import { DynamicObject, Player, Vehicle, VehicleModelInfoEnum } from "@infernus/core";
import {
  playerUsingVehPara,
  POSITION_FLAG_AIR,
  POSITION_FLAG_GROUND,
  vehicleParachuteObject,
} from "../constants";
import { VehPara } from "../vehPara";

export function isCollisionFlag(a: number, b: number) {
  return a & b;
}

export function compressRotation(rotation: number): number {
  return rotation - Math.floor(rotation / 360) * 360;
}

export function decompressRotation(rotation: number): number {
  rotation = compressRotation(rotation);
  if (rotation > 180) rotation -= 360;
  return rotation;
}

export function getRotationMatrixEuler(rx: number, ry: number, rz: number): number[][] {
  const d2r = (d: number) => (d * Math.PI) / 180;
  const cosX = Math.cos(d2r(rx)),
    cosY = Math.cos(d2r(ry)),
    cosZ = Math.cos(d2r(rz));
  const sinX = Math.sin(d2r(rx)),
    sinY = Math.sin(d2r(ry)),
    sinZ = Math.sin(d2r(rz));

  return [
    [cosZ * cosY - sinZ * sinX * sinY, -sinZ * cosX, cosZ * sinY + sinZ * sinX * cosY],
    [sinZ * cosY + cosZ * sinX * sinY, cosZ * cosX, sinZ * sinY - cosZ * sinX * cosY],
    [-cosX * sinY, sinX, cosX * cosY],
  ];
}

export function matrixRotate(
  matrix: number[][],
  ox: number,
  oy: number,
  oz: number,
): { x: number; y: number; z: number } {
  return {
    x: ox * matrix[0][0] + oy * matrix[0][1] + oz * matrix[0][2],
    y: ox * matrix[1][0] + oy * matrix[1][1] + oz * matrix[1][2],
    z: ox * matrix[2][0] + oy * matrix[2][1] + oz * matrix[2][2],
  };
}

export function quatToEuler(qw: number, qx: number, qy: number, qz: number) {
  const prec = (v: number) => Math.round(v * 10000) / 10000;
  qw = prec(qw);
  qx = prec(qx);
  qy = prec(qy);
  qz = prec(qz);

  const r2d = (r: number) => (r * 180) / Math.PI;
  return {
    rx: compressRotation(r2d(Math.asin(2 * qy * qz - 2 * qx * qw))),
    ry: compressRotation(r2d(-Math.atan2(qx * qz + qy * qw, 0.5 - qx * qx - qy * qy))),
    rz: compressRotation(r2d(-Math.atan2(qx * qy + qz * qw, 0.5 - qx * qx - qz * qz))),
  };
}

export function getVehicleRotationEx(vehicle: Vehicle) {
  const { w, x, y, z } = vehicle.getRotationQuat();
  return quatToEuler(w, x, y, z);
}

export function shiftVectorRotation(
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
): { x: number; y: number; z: number; ret: boolean } {
  const dist = Math.sqrt(x * x + y * y + z * z);
  if (dist <= 0) return { x: 0, y: 0, z: 0, ret: false };

  const matrix = getRotationMatrixEuler(rx, ry, rz);
  return {
    ...matrixRotate(matrix, x / dist, y / dist, z / dist),
    ret: true,
  };
}

export function getVehicleCollisionFlags(vehicle: Vehicle): number {
  const { x, y, z } = vehicle.getPos();

  const groundZ = findZ_For2DCoord(x, y) ?? 0;
  const hitWater = rayCastLine(x, y, z + 10, x, y, z - 100)?.ret === WATER_OBJECT;

  if (z >= groundZ + 2.2 && !hitWater) return POSITION_FLAG_AIR;
  return POSITION_FLAG_GROUND;
}

export function togglePlayerUsingVehPara(player: Player, toggle: boolean) {
  if (toggle) {
    playerUsingVehPara.add(player.id);
  } else {
    playerUsingVehPara.delete(player.id);
  }
}

export function startVehicleParachuteAction(player: Player) {
  togglePlayerUsingVehPara(player, true);

  const veh = player.getVehicle();
  if (!veh) return false;
  const vehObjs = vehicleParachuteObject.get(veh.id);
  if (vehObjs) {
    vehObjs.forEach((obj) => {
      if (obj && obj.isValid()) obj.destroy();
    });
    vehicleParachuteObject.delete(veh.id);
  }

  const arr: DynamicObject[] = [];
  vehicleParachuteObject.set(veh.id, arr);

  const obj = new DynamicObject({
    modelId: 18849,
    x: 0.0,
    y: 0.0,
    z: -6000.0,
    rx: 0.0,
    ry: 0.0,
    rz: 0.0,
    worldId: player.getVirtualWorld(),
    interiorId: player.getInterior(),
  });
  obj.create();
  arr.push(obj);

  switch (Math.floor(Math.random() * 5)) {
    case 0: {
      obj.setMaterial(0, 18841, "MickyTextures", "Smileyface2", 0x00000000);
      obj.setMaterial(2, 10412, "hotel1", "carpet_red_256", 0x00ffffff);
      break;
    }
    case 1: {
      obj.setMaterial(0, 18841, "MickyTextures", "red032", 0x00000000);
      obj.setMaterial(2, 10412, "hotel1", "carpet_red_256", 0x00ffffff);
      break;
    }
    case 2: {
      obj.setMaterial(0, 18841, "MickyTextures", "ws_gayflag1", 0x00000000);
      obj.setMaterial(2, 10412, "hotel1", "carpet_red_256", 0x00ffffff);
      break;
    }
    case 3: {
      obj.setMaterial(0, 18841, "MickyTextures", "waterclear256", 0x00000000);
      obj.setMaterial(2, 10412, "hotel1", "carpet_red_256", 0x00ffffff);
      break;
    }
    case 4: {
      obj.setMaterial(2, 10412, "hotel1", "carpet_red_256", 0x00ffffff);
      break;
    }
  }

  let { z } = veh.getModelInfo(VehicleModelInfoEnum.SIZE);
  z /= 2.0;
  obj.attachToVehicle(veh, 0.0, 0.0, z + 6.0, 0.0, 0.0, 90.0);
}

export function stopVehicleParachuteAction(player: Player, vehicle?: Vehicle) {
  togglePlayerUsingVehPara(player, false);

  const _vehicle = vehicle || player.getVehicle();
  if (_vehicle) {
    VehPara.toggle(_vehicle.id, false);
  }
}
