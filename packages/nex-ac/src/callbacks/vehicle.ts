import {
  InvalidEnum,
  LimitsEnum,
  Player,
  Vehicle,
  VehicleEvent,
  VehicleParamsEnum,
} from "@infernus/core";
import { ACInfo, ACVehInfo } from "../struct";
import {
  ac_GetSpeed,
  ac_GetVectorDist,
  ac_IsABoatEx,
  ac_IsAnAircraft,
  ac_IsAnAircraftRC,
  ac_IsATrainCarriageEx,
  ac_IsATrainPartEx,
  ac_IsCompatible,
  ac_IsUpsideDown,
  ac_IsValidVehicleModel,
  setVehicleFakePosForPlayer,
  setVehicleFakeZAngleForPlayer,
} from "../functions";
import { innerACConfig } from "../config";
import {
  ac_FloodDetect,
  ac_KickWithCode,
  triggerCheatWarning,
} from "./trigger";
import { ac_cPrice, ac_Mtfc } from "../constants";

VehicleEvent.onPlayerEnter(({ player, vehicle, isPassenger, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[6] < ac_Mtfc[6][0])
        ac_FloodDetect(player, 6);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[6] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[6] = ac_gtc;
    const ac_model = vehicle.getModel();
    if (
      ACInfo.get(player.id).acACAllow[44] &&
      (ac_model <= 0 ||
        (!vehicle.isStreamedIn(player) && !ac_IsATrainCarriageEx(ac_model)))
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Veh: ${vehicle.id}, veh model: ${ac_model}, isPassenger: ${isPassenger}`,
        );
      }
      return ac_KickWithCode(player, "", 0, 44, 1);
    }
    ACInfo.get(player.id).acEnterRes = true;
    if (ACInfo.get(player.id).acACAllow[5] && !ac_IsATrainPartEx(ac_model)) {
      const ac_dist = vehicle.getDistanceFromPoint(
        ACInfo.get(player.id).acPosX,
        ACInfo.get(player.id).acPosY,
        ACInfo.get(player.id).acPosZ,
      );
      if (
        ac_dist >= 30.0 ||
        (ac_dist >= 20.0 &&
          ac_model !== 553 &&
          ac_model !== 577 &&
          ac_model !== 592)
      ) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC DEBUG] Veh model: ${ac_model}, veh: ${vehicle.id}, dist: ${ac_dist}, isPassenger: ${isPassenger}, playerId: ${player.id}`,
          );
        }
        ac_KickWithCode(player, "", 0, 5, 3);
        ACInfo.get(player.id).acEnterRes = false;
        setVehicleFakePosForPlayer(
          player,
          vehicle,
          ACVehInfo.get(vehicle.id).acPosX,
          ACVehInfo.get(vehicle.id).acPosY,
          ACVehInfo.get(vehicle.id).acPosZ,
        );
        setVehicleFakeZAngleForPlayer(
          player,
          vehicle,
          ACVehInfo.get(vehicle.id).acZAngle,
        );
        player.clearAnimations(true);
      }
    }
    const ac_doors = ACVehInfo.get(vehicle.id).acLocked[player.id];
    if (isPassenger || ac_doors !== VehicleParamsEnum.ON) {
      if (ac_doors !== VehicleParamsEnum.ON)
        ACInfo.get(player.id).acEnterSeat = -1;
      else ACInfo.get(player.id).acEnterSeat = +isPassenger;
      if (ACInfo.get(player.id).acEnterVeh !== vehicle.id) {
        ACInfo.get(player.id).acEnterVeh = vehicle.id;
        if (ac_model === 570 || ac_IsABoatEx(ac_model))
          ACInfo.get(player.id).acEnterVehTick = 0;
        else ACInfo.get(player.id).acEnterVehTick = ac_gtc;
      }
    } else if (
      ACInfo.get(player.id).acEnterVeh !== vehicle.id ||
      (ACInfo.get(player.id).acEnterSeat !== -1 &&
        ACInfo.get(player.id).acEnterSeat !== +isPassenger)
    ) {
      ACInfo.get(player.id).acEnterSeat = -1;
      ACInfo.get(player.id).acEnterVeh = 0;
    }
  }
  return next();
});

VehicleEvent.onPlayerExit(({ player, vehicle, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    if (ACInfo.get(player.id).acDead) return false;
    let ac_i = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_i - ACInfo.get(player.id).acCall[7] < ac_Mtfc[7][0])
        ac_FloodDetect(player, 7);
      else if (ac_i - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[7] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[7] = ac_i;
    if (ACInfo.get(player.id).acACAllow[44] && !vehicle.isStreamedIn(player)) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Veh: ${vehicle.id}, veh model: ${vehicle.getModel()}`,
        );
      }
      return ac_KickWithCode(player, "", 0, 44, 5);
    }
    const ac_i_veh = Vehicle.getInstance(ACInfo.get(player.id).acVeh);
    ac_i = ac_i_veh ? ac_i_veh.getModel() : 0;
    if (
      ac_IsValidVehicleModel(ac_i) &&
      (ac_IsAnAircraft(ac_i) || ac_IsAnAircraftRC(ac_i))
    )
      ACInfo.get(player.id).acParachute = 1;
    else if (ACInfo.get(player.id).acParachute !== 2)
      ACInfo.get(player.id).acParachute = 0;
  }
  return next();
});

VehicleEvent.onMod(({ player, vehicle, componentId, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  let ac_i = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_i - ACInfo.get(player.id).acCall[12] < ac_Mtfc[12][0])
      return ac_FloodDetect(player, 12);
    if (ac_i - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[12] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  if (
    (!innerACConfig.AC_USE_TUNING_GARAGES &&
      ACInfo.get(player.id).acACAllow[23]) ||
    (innerACConfig.AC_USE_TUNING_GARAGES &&
      ACInfo.get(player.id).acACAllow[23] &&
      !ACInfo.get(player.id).acModShop)
  ) {
    ac_KickWithCode(player, "", 0, 23, 2);
    if (ACInfo.get(player.id).acKicked > 0) return false;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[12] = ac_i;

  if (innerACConfig.AC_USE_TUNING_GARAGES) {
    ACInfo.get(player.id).acGtc[18] = ac_i + 3250;
  }
  if (
    ACInfo.get(player.id).acACAllow[43] &&
    !ac_IsCompatible((ac_i = vehicle.getModel()), componentId)
  ) {
    if (innerACConfig.DEBUG) {
      console.log(
        `[Nex-AC DEBUG] Veh model: ${ac_i}, veh: ${vehicle.id}, componentId: ${componentId}`,
      );
    }
    return ac_KickWithCode(player, "", 0, 43, 1);
  }
  if (innerACConfig.AC_USE_TUNING_GARAGES) {
    ac_i = componentId - 1000;
    if (ACInfo.get(player.id).acSet[11] !== -1)
      ACInfo.get(player.id).acSet[11] += ac_cPrice[ac_i];
    else ACInfo.get(player.id).acSet[11] = ac_cPrice[ac_i];
    ACInfo.get(player.id).acCheatCount[21] = 0;
  }
  return next();
});

VehicleEvent.onPaintjob(({ player, vehicle, paintjobId, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  const ac_gtc = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_gtc - ACInfo.get(player.id).acCall[13] < ac_Mtfc[13][0])
      ac_FloodDetect(player, 13);
    else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[13] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  if (
    ACInfo.get(player.id).acACAllow[43] &&
    !(paintjobId >= 0 && paintjobId <= 2) &&
    paintjobId !== 255
  ) {
    if (innerACConfig.DEBUG) {
      console.log(
        `[Nex-AC DEBUG] Veh model: ${vehicle.getModel()}, veh: ${vehicle.id}, paintjobId: ${paintjobId}`,
      );
    }
    ac_KickWithCode(player, "", 0, 43, 2);
  } else if (ACInfo.get(player.id).acACAllow[23]) {
    if (!innerACConfig.AC_USE_TUNING_GARAGES)
      ac_KickWithCode(player, "", 0, 23, 4);
    else if (!ACInfo.get(player.id).acModShop)
      ac_KickWithCode(player, "", 0, 23, 4);
  }
  if (ACInfo.get(player.id).acKicked < 1) {
    const vehicleId = vehicle.id;
    if (paintjobId === 255) ACVehInfo.get(vehicleId).acPaintJob = 3;
    else ACVehInfo.get(vehicleId).acPaintJob = paintjobId;
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[13] = ac_gtc;
  return next();
});

VehicleEvent.onRespray(({ player, vehicle, color, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  const ac_gtc = Date.now();
  if (ACInfo.get(player.id).acACAllow[49]) {
    if (ac_gtc - ACInfo.get(player.id).acCall[14] < ac_Mtfc[14][0])
      return ac_FloodDetect(player, 14);
    if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
      ac_FloodDetect(player, 27);
    else
      ACInfo.get(player.id).acFloodCount[14] = ACInfo.get(
        player.id,
      ).acFloodCount[27] = 0;
  }
  if (!innerACConfig.AC_USE_TUNING_GARAGES && !innerACConfig.AC_USE_PAYNSPRAY) {
    if (ACInfo.get(player.id).acACAllow[23]) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Veh model: ${vehicle.getModel()}, veh: ${vehicle.id}, color1: ${color[0]}, color2: ${color[1]}`,
        );
      }
      ac_KickWithCode(player, "", 0, 23, 5);
      if (ACInfo.get(player.id).acKicked > 0) return false;
    }
  }
  ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[14] = ac_gtc;

  return next();
});

VehicleEvent.onSpawn(({ vehicle, next }) => {
  const vehicleId = vehicle.id;
  ACVehInfo.get(vehicleId).acPaintJob = 3;
  ACVehInfo.get(vehicleId).acHealth = 1000.0;
  ACVehInfo.get(vehicleId).acSpawned = true;
  ACVehInfo.get(vehicleId).acTrSpeed = -1;
  ACVehInfo.get(vehicleId).acPosDiff =
    ACVehInfo.get(vehicleId).acVelX =
    ACVehInfo.get(vehicleId).acVelY =
    ACVehInfo.get(vehicleId).acVelZ =
      0.0;
  ACVehInfo.get(vehicleId).acSpeed =
    ACVehInfo.get(vehicleId).acTires =
    ACVehInfo.get(vehicleId).acLights =
    ACVehInfo.get(vehicleId).acDoors =
    ACVehInfo.get(vehicleId).acPanels =
    ACVehInfo.get(vehicleId).acLastSpeed =
    ACVehInfo.get(vehicleId).acSpeedDiff =
      0;

  const spawnInfo = vehicle.getSpawnInfo()!;

  ACVehInfo.get(vehicleId).acPosX = spawnInfo.fX;
  ACVehInfo.get(vehicleId).acPosY = spawnInfo.fY;
  ACVehInfo.get(vehicleId).acPosZ = spawnInfo.fZ;
  ACVehInfo.get(vehicleId).acZAngle = spawnInfo.fRot;

  ACVehInfo.get(vehicleId).acDriver = InvalidEnum.PLAYER_ID;
  const ac_gtc = Date.now() + 2650;
  Player.getInstances().forEach((ac_i) => {
    if (ACInfo.get(ac_i.id).acVeh === vehicleId)
      ACInfo.get(ac_i.id).acSetPosTick = ACInfo.get(ac_i.id).acGtc[10] = ac_gtc;
    if (ACInfo.get(ac_i.id).acSet[8] === vehicleId)
      ACInfo.get(ac_i.id).acSet[8] = -1;
  });
  return next();
});

VehicleEvent.onDeath(({ vehicle, killer, next }) => {
  if (
    killer.id >= 0 &&
    killer.id < LimitsEnum.MAX_PLAYERS &&
    (!innerACConfig.AC_USE_NPC || (innerACConfig.AC_USE_NPC && !killer.isNpc()))
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(killer.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(killer.id).acCall[15] < ac_Mtfc[15][0])
        ac_FloodDetect(killer, 15);
      else if (ac_gtc - ACInfo.get(killer.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(killer, 27);
      else
        ACInfo.get(killer.id).acFloodCount[15] = ACInfo.get(
          killer.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(killer.id).acCall[27] = ACInfo.get(killer.id).acCall[15] =
      ac_gtc;
  }
  const ac_health = vehicle.getHealth().health;
  const { w: ac_w, x: ac_x, y: ac_y, z: ac_z } = vehicle.getRotationQuat()!;
  if (ac_health < 250.0 || ac_IsUpsideDown(ac_w, ac_x, ac_y, ac_z))
    ACVehInfo.get(vehicle.id).acSpawned = false;
  return next();
});

VehicleEvent.onDamageStatusUpdate(({ player, vehicle, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return true;
  const {
    panels: ac_panels,
    doors: ac_doors,
    lights: ac_lights,
    tires: ac_tires,
  } = vehicle.getDamageStatus();
  const vehicleId = vehicle.id;
  if (
    ACVehInfo.get(vehicleId).acPanels !== ac_panels ||
    ACVehInfo.get(vehicleId).acDoors !== ac_doors ||
    ACVehInfo.get(vehicleId).acTires !== ac_tires
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[24] < ac_Mtfc[24][0])
        ac_FloodDetect(player, 24);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else {
        if (ACInfo.get(player.id).acFloodCount[24] > 0)
          ACInfo.get(player.id).acFloodCount[24]--;
        ACInfo.get(player.id).acFloodCount[27] = 0;
      }
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[24] =
      ac_gtc;
  }
  ACVehInfo.get(vehicleId).acTires = ac_tires;
  ACVehInfo.get(vehicleId).acLights = ac_lights;
  ACVehInfo.get(vehicleId).acDoors = ac_doors;
  ACVehInfo.get(vehicleId).acPanels = ac_panels;
  return next();
});

VehicleEvent.onStreamIn(({ vehicle, forPlayer, next }) => {
  const vehicleId = vehicle.id;
  const { doors: ac_doors } = vehicle.getParamsEx();
  ACVehInfo.get(vehicleId).acLocked[forPlayer.id] = ac_doors;
  return next();
});

VehicleEvent.onSirenStateChange(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return true;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[25] < ac_Mtfc[25][0])
        ac_FloodDetect(player, 25);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[25] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[25] =
      ac_gtc;
  }
  return next();
});

VehicleEvent.onUnoccupiedUpdate(
  ({
    player,
    newX,
    newY,
    newZ,
    velX,
    velY,
    velZ,
    vehicle,
    passengerSeat,
    next,
  }) => {
    if (ACInfo.get(player.id).acKicked > 0) return false;
    const vehicleId = vehicle.id;
    if (
      ACInfo.get(player.id).acACAllow[31] &&
      (newX !== newX ||
        newY !== newY ||
        newZ !== newZ ||
        velX !== velX ||
        velY !== velY ||
        velZ !== velZ ||
        Math.abs(newX) >= 25000.0 ||
        Math.abs(newY) >= 25000.0 ||
        Math.abs(newZ) >= 25000.0 ||
        Math.abs(velX) >= 100.0 ||
        Math.abs(velY) >= 100.0 ||
        Math.abs(velZ) >= 100.0 ||
        (Math.abs(velX - ACVehInfo.get(vehicleId).acVelX) >= 2.6 &&
          Math.abs(velX) >= Math.abs(ACVehInfo.get(vehicleId).acVelX)) ||
        (Math.abs(velY - ACVehInfo.get(vehicleId).acVelY) >= 2.6 &&
          Math.abs(velY) >= Math.abs(ACVehInfo.get(vehicleId).acVelY)) ||
        (Math.abs(velZ - ACVehInfo.get(vehicleId).acVelZ) >= 2.6 &&
          Math.abs(velZ) >= Math.abs(ACVehInfo.get(vehicleId).acVelZ)))
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Pos x, y, z: ${newX}, ${newY}, ${newZ}, vel x, y, z: ${velX}, ${velY}, ${velZ}`,
        );
      }
      return ac_KickWithCode(player, "", 0, 31, 2);
    }
    const ac_vsp = ac_GetSpeed(velX, velY, velZ);

    const ac_gtc = Date.now(),
      ac_gpp = player.getPing();
    const { x: ac_x, y: ac_y, z: ac_z } = vehicle.getPos();

    if (ACInfo.get(player.id).acACAllow[5]) {
      const ac_dist = player.getDistanceFromPoint(newX, newY, newZ);
      if (ac_dist >= 120.0) {
        if (innerACConfig.DEBUG) {
          console.log(
            `[Nex-AC DEBUG] Dist: ${ac_dist}, veh: ${vehicleId}, seat: ${passengerSeat}, playerId: ${player.id}`,
          );
        }

        ac_KickWithCode(player, "", 0, 5, 4);

        ACVehInfo.get(vehicleId).acZAngle = vehicle.getZAngle().angle;

        setVehicleFakeZAngleForPlayer(
          player,
          vehicle,
          ACVehInfo.get(vehicleId).acZAngle,
        );

        setVehicleFakePosForPlayer(player, vehicle, ac_x, ac_y, ac_z);
        return false;
      }
    }
    const ac_dist = vehicle.getDistanceFromPoint(newX, newY, newZ);
    if (passengerSeat > 0) {
      const ac_zDiff = newZ - ac_z;

      if (
        ACInfo.get(player.id).acACAllow[31] &&
        (((velZ >= ACVehInfo.get(vehicleId).acVelZ || ac_zDiff >= -0.8) &&
          (Math.abs(velX - ACVehInfo.get(vehicleId).acVelX) >= 1.0 ||
            Math.abs(velY - ACVehInfo.get(vehicleId).acVelY) >= 1.0 ||
            (ac_GetVectorDist(
              ACVehInfo.get(vehicleId).acVelX,
              ACVehInfo.get(vehicleId).acVelY,
            ) >= 0.3 &&
              (Math.abs(velX) >= Math.abs(ACVehInfo.get(vehicleId).acVelX) ||
                Math.abs(velY) >=
                  Math.abs(ACVehInfo.get(vehicleId).acVelY))))) ||
          (ac_zDiff >= -5.0 &&
            (Math.abs(newX - ac_x) >= 8.0 || Math.abs(newY - ac_y) >= 8.0)))
      ) {
        if (
          ++ACInfo.get(player.id).acCheatCount[4] >
          innerACConfig.AC_MAX_CARSHOT_WARNINGS
        ) {
          if (innerACConfig.DEBUG) {
            console.log(
              `[Nex-AC DEBUG] Vel x, y, z: ${velX}, ${velY}, ${velZ}, old vel x, y: ${ACVehInfo.get(vehicleId).acVelX}, ${ACVehInfo.get(vehicleId).acVelY}, pos diff x, y, z: ${newX - ac_x}, ${newY - ac_y}, ${ac_zDiff}, veh: ${vehicleId}`,
            );
          }
          ac_KickWithCode(player, "", 0, 31, 1);
          if (ACInfo.get(player.id).acKicked > 0) return false;
          ACInfo.get(player.id).acCheatCount[4] = 0;
        } else {
          triggerCheatWarning(
            player,
            "",
            0,
            31,
            1,
            ACInfo.get(player.id).acCheatCount[4],
          );
        }
      } else if (
        ACInfo.get(player.id).acACAllow[8] &&
        ((velZ >= 0.1 &&
          velZ > ACVehInfo.get(vehicleId).acVelZ &&
          Math.abs(ac_x - newX) < ac_zDiff / 2.0 &&
          Math.abs(ac_y - newY) < ac_zDiff / 2.0) ||
          (velZ >= 0.0 && ac_zDiff <= -1.0) ||
          (velZ <= 0.0 && ac_zDiff >= 1.0) ||
          (ac_zDiff >= 0.0 && velZ <= -0.3) ||
          (ac_zDiff <= 0.0 && velZ >= 0.3))
      ) {
        if (
          ++ACInfo.get(player.id).acCheatCount[3] >
          innerACConfig.AC_MAX_FLYHACK_VEH_WARNINGS
        ) {
          if (innerACConfig.DEBUG) {
            console.log(
              `[Nex-AC DEBUG] Vel z: ${velZ}, old vel z: ${ACVehInfo.get(vehicleId).acVelZ}, pos diff x, y, z: ${ac_x - newX}, ${ac_y - newY}, ${ac_zDiff}, veh: ${vehicleId}`,
            );
          }
          ac_KickWithCode(player, "", 0, 8, 2);
          if (ACInfo.get(player.id).acKicked > 0) return false;
          ACInfo.get(player.id).acCheatCount[3] = 0;
        } else {
          triggerCheatWarning(
            player,
            "",
            0,
            8,
            2,
            ACInfo.get(player.id).acCheatCount[3],
          );
        }
      } else if (
        ACInfo.get(player.id).acACAllow[1] &&
        ac_dist >= 2.6 &&
        ac_vsp < 63
      ) {
        if (
          ++ACInfo.get(player.id).acCheatCount[2] >
          innerACConfig.AC_MAX_AIR_VEH_WARNINGS
        ) {
          if (innerACConfig.DEBUG) {
            console.log(
              `[Nex-AC DEBUG] Speed: ${ac_vsp}, dist: ${ac_dist}, old pos diff: ${ACVehInfo.get(vehicleId).acPosDiff}, veh: ${vehicleId}, seat: ${passengerSeat}`,
            );
          }
          ac_KickWithCode(player, "", 0, 1, 2);
          if (ACInfo.get(player.id).acKicked > 0) return false;
          ACInfo.get(player.id).acCheatCount[2] = 0;
        } else {
          triggerCheatWarning(
            player,
            "",
            0,
            1,
            2,
            ACInfo.get(player.id).acCheatCount[2],
          );
        }
      }
    }
    if (
      ACInfo.get(player.id).acACAllow[5] &&
      (ac_dist >= 25.0 ||
        (ac_dist >= 15.0 &&
          ac_gtc - ACInfo.get(player.id).acGtc[15] > ac_gpp)) &&
      ac_dist - ACVehInfo.get(vehicleId).acPosDiff > (ac_dist / 3.0) * 1.6 &&
      (ac_z >= -45.0 || ac_GetVectorDist(newX - ac_x, newY - ac_y) >= 180.0)
    ) {
      if (innerACConfig.DEBUG) {
        console.log(
          `[Nex-AC DEBUG] Dist: ${ac_dist}, old pos diff: ${ACVehInfo.get(vehicleId).acPosDiff}, old pos z: ${ac_z}, veh: ${vehicleId}, seat: ${passengerSeat}, playerId: ${player.id}`,
        );
      }

      ac_KickWithCode(player, "", 0, 5, 1);

      ACVehInfo.get(vehicleId).acZAngle = vehicle.getZAngle().angle;

      setVehicleFakeZAngleForPlayer(
        player,
        vehicle,
        ACVehInfo.get(vehicleId).acZAngle,
      );

      setVehicleFakePosForPlayer(player, vehicle, ac_x, ac_y, ac_z);

      return false;
    }

    const ac_a = next();
    if (!ac_a) return ac_a;

    ACVehInfo.get(vehicleId).acPosDiff = ac_dist;
    if (ACInfo.get(player.id).acEnterVeh === vehicleId)
      ACInfo.get(player.id).acEnterRes = false;
    ACVehInfo.get(vehicleId).acSpeedDiff =
      ac_vsp - ACVehInfo.get(vehicleId).acSpeed;
    ACVehInfo.get(vehicleId).acSpeed = ac_vsp;
    ACVehInfo.get(vehicleId).acPosX = newX;
    ACVehInfo.get(vehicleId).acPosY = newY;
    ACVehInfo.get(vehicleId).acPosZ = newZ;
    ACVehInfo.get(vehicleId).acVelX = velX;
    ACVehInfo.get(vehicleId).acVelY = velY;
    ACVehInfo.get(vehicleId).acVelZ = velZ;
    return ac_a;
  },
);

VehicleEvent.onTrailerUpdate(({ player, vehicle, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  const ac_a = next();
  if (!ac_a) return ac_a;

  ACInfo.get(player.id).acEnterRes = false;
  const vehicleId = vehicle.id;
  if (ACVehInfo.get(vehicleId).acTrSpeed !== -1) {
    ACVehInfo.get(vehicleId).acPosDiff = ACVehInfo.get(vehicleId).acTrPosDiff;
    ACVehInfo.get(vehicleId).acSpeedDiff =
      ACVehInfo.get(vehicleId).acTrSpeedDiff;
    ACVehInfo.get(vehicleId).acPosX = ACVehInfo.get(vehicleId).acTrPosX;
    ACVehInfo.get(vehicleId).acPosY = ACVehInfo.get(vehicleId).acTrPosY;
    ACVehInfo.get(vehicleId).acPosZ = ACVehInfo.get(vehicleId).acTrPosZ;
    ACVehInfo.get(vehicleId).acVelX = ACVehInfo.get(vehicleId).acTrVelX;
    ACVehInfo.get(vehicleId).acVelY = ACVehInfo.get(vehicleId).acTrVelY;
    ACVehInfo.get(vehicleId).acVelZ = ACVehInfo.get(vehicleId).acTrVelZ;
    ACVehInfo.get(vehicleId).acSpeed = ACVehInfo.get(vehicleId).acTrSpeed;
    ACVehInfo.get(vehicleId).acTrSpeed = -1;
  }
  return ac_a;
});
