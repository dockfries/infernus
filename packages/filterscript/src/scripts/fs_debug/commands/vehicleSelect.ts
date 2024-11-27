import {
  PlayerEvent,
  Vehicle,
  CameraCutStylesEnum,
  GameText,
  KeysEnum,
  Player,
} from "@infernus/core";
import {
  gPlayerStatus,
  COLOR_RED,
  aSelNames,
  MIN_VEHICLE_ID,
  MAX_VEHICLE_ID,
  VEHICLE_DISTANCE,
  curPlayerVehM,
  curPlayerVehI,
  curServerVehP,
  COLOR_GREEN,
  aVehicleNames,
  gPlayerTimers,
} from "../constants";
import { SelStatEnum } from "../enums";
import { IFsDebugOptions } from "../interfaces";
import { getVehicleModelIDFromName, getXYInFrontOfPlayer } from "../utils";

function vehicleSelect(player: Player) {
  /*
  // Make sure the player is not in skin selection before continuing
  if (gPlayerStatus.get(player) !== VEHI_SEL_STAT) {
    const timer = skinTimerID.get(player);
    clearInterval(timer);
    skinTimerID.delete(player);
    return;
  }
  */
  const { keys, leftRight } = player.getKeys();

  let p_curPlayerVehM = curPlayerVehM.get(player) || MIN_VEHICLE_ID;

  // Right key increases Vehicle MODELID
  if (leftRight === KeysEnum.KEY_RIGHT) {
    if (p_curPlayerVehM === MAX_VEHICLE_ID) {
      p_curPlayerVehM = MIN_VEHICLE_ID;
    } else {
      p_curPlayerVehM++;
    }

    new GameText(
      `Model ID: ${curPlayerVehM}~n~Vehicle Name: ${aVehicleNames[p_curPlayerVehM - MIN_VEHICLE_ID]}`,
      1500,
      3,
    ).forPlayer(player);

    const { z } = player.getPos()!;

    const { x, y } = getXYInFrontOfPlayer(player, VEHICLE_DISTANCE);
    const angle = player.getFacingAngle();

    const vehId = curPlayerVehI.get(player)!;
    let veh = Vehicle.getInstance(vehId)!;
    if (veh) veh.destroy();

    const p_curServerVehP = curServerVehP.get(veh)!;
    p_curServerVehP.spawn = false;
    curServerVehP.set(veh, p_curServerVehP);

    veh = new Vehicle({
      modelId: p_curPlayerVehM,
      x,
      y,
      z: z + 2.0,
      zAngle: angle + 90.0,
      color: [-1, -1],
      respawnDelay: 5000,
    });
    veh.create();

    curPlayerVehI.set(player, veh.id);
    console.log("vsel vehicle select id = %d", veh.id);

    veh.linkToInterior(player.getInterior());

    curServerVehP.set(veh, {
      spawn: true,
      vModel: p_curPlayerVehM,
      vInt: player.getInterior(),
    });
  }

  // Left key decreases Vehicle MODELID
  if (leftRight === KeysEnum.KEY_LEFT) {
    if (p_curPlayerVehM === MIN_VEHICLE_ID) {
      p_curPlayerVehM = MAX_VEHICLE_ID;
    } else {
      p_curPlayerVehM--;
    }

    new GameText(
      `Model ID: ${curPlayerVehM}~n~Vehicle Name: ${aVehicleNames[p_curPlayerVehM - MIN_VEHICLE_ID]}`,
      1500,
      3,
    ).forPlayer(player);

    const { z } = player.getPos()!;

    const { x, y } = getXYInFrontOfPlayer(player, VEHICLE_DISTANCE);
    const angle = player.getFacingAngle();

    const vehId = curPlayerVehI.get(player)!;
    let veh = Vehicle.getInstance(vehId)!;
    if (veh) veh.destroy();

    const p_curServerVehP = curServerVehP.get(veh)!;
    p_curServerVehP.spawn = false;
    curServerVehP.set(veh, p_curServerVehP);

    veh = new Vehicle({
      modelId: p_curPlayerVehM,
      x,
      y,
      z: z + 2.0,
      zAngle: angle + 90.0,
      color: [-1, -1],
      respawnDelay: 5000,
    });
    veh.create();

    curPlayerVehI.set(player, veh.id);
    console.log("vsel vehicle select id = %d", veh.id);

    veh.linkToInterior(player.getInterior());

    curServerVehP.set(veh, {
      spawn: true,
      vModel: p_curPlayerVehM,
      vInt: player.getInterior(),
    });
  }

  // Action key exits vehicle selection
  if (keys & KeysEnum.ACTION) {
    const vehId = curPlayerVehI.get(player);
    player.setCameraBehind();
    player.toggleControllable(true);
    player.sendClientMessage(
      COLOR_GREEN,
      `[SUCCESS]: Spawned a "${aVehicleNames[p_curPlayerVehM - MIN_VEHICLE_ID]}" (MODELID: ${p_curPlayerVehM}, VEHICLEID: ${vehId})`,
    );
    gPlayerStatus.delete(player);
    const timer = gPlayerTimers.get(player);
    if (timer) {
      clearInterval(timer);
      gPlayerTimers.delete(player);
    }
  }
}

export function registerVehicleSelect(options?: IFsDebugOptions) {
  if (options?.vehicleSelect === false) return [];

  const vehicle = PlayerEvent.onCommandText(
    ["v", "vehicle"],
    ({ player, subcommand, next }) => {
      const status = gPlayerStatus.get(player);
      if (status) {
        player.sendClientMessage(
          COLOR_RED,
          `[ERROR]: You are already using "${aSelNames[status - 1]}".`,
        );
        return next();
      }
      if (!subcommand[0].length)
        return player.sendClientMessage(
          COLOR_RED,
          "[USAGE]: /v MODELID/NAME or /vehicle MODELID/NAME",
        );
      //***************
      // Fix by Mike! *
      //***************
      let idx = getVehicleModelIDFromName(subcommand[0]);
      if (idx === -1) {
        idx = +subcommand[0];
        if (idx < MIN_VEHICLE_ID || idx > MAX_VEHICLE_ID)
          return player.sendClientMessage(
            COLOR_RED,
            "[ERROR]: Invalid MODELID/NAME",
          );
      }
      const { z } = player.getPos()!;
      const { x, y } = getXYInFrontOfPlayer(player, VEHICLE_DISTANCE);
      const a = player.getFacingAngle();
      curPlayerVehM.set(player, idx);
      const veh = new Vehicle({
        modelId: idx,
        x,
        y,
        z: z + 2.0,
        zAngle: a + 90.0,
        color: [-1, -1],
        respawnDelay: 5000,
      });
      veh.create();
      curPlayerVehI.set(player, veh.id);
      veh.linkToInterior(player.getInterior());

      curServerVehP.set(veh, {
        spawn: true,
        vModel: idx,
        vInt: player.getInterior(),
      });

      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: Spawned a "${aVehicleNames[idx - MIN_VEHICLE_ID]}" (MODELID: ${idx}, VEHICLEID: ${veh.id})`,
      );
      return next();
    },
  );

  const vehicleSel = PlayerEvent.onCommandText("vsel", ({ player, next }) => {
    // /vsel allows players to select a vehicle using playerkeys.
    const status = gPlayerStatus.get(player);
    if (status) {
      player.sendClientMessage(
        COLOR_RED,
        `[ERROR]: You are already using "${aSelNames[status - 1]}".`,
      );
      return next();
    }
    gPlayerStatus.set(player, SelStatEnum.VEHICLE);
    const pos = player.getPos()!;
    let { x, y } = pos;
    const z = pos.z;
    player.setCameraPos(x, y, z + 3.0);
    const frontXY = getXYInFrontOfPlayer(player, VEHICLE_DISTANCE);
    x = frontXY.x;
    y = frontXY.y;
    player.setCameraLookAt(x, y, z, CameraCutStylesEnum.CUT);
    player.toggleControllable(false);
    const a = player.getFacingAngle();

    const idx = curPlayerVehM.get(player)!;

    const veh = new Vehicle({
      modelId: idx,
      x,
      y,
      z: z + 2.0,
      zAngle: a + 90.0,
      color: [-1, -1],
      respawnDelay: 5000,
    });
    veh.create();
    veh.linkToInterior(player.getInterior());
    console.log(`vsel vehicle start id = ${veh.id}`);

    curServerVehP.set(veh, {
      spawn: true,
      vModel: idx,
      vInt: player.getInterior(),
    });

    gPlayerTimers.set(
      player,
      setInterval(() => {
        vehicleSelect(player);
      }, 200),
    );
    return next();
  });

  return [vehicle, vehicleSel];
}
