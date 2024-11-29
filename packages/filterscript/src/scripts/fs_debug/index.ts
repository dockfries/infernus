// SA:MP PAWN Debug -
//  *  Debugging filterscript used
//  *  for creation of gamemode.
//  *
//  *  Simon Campbell
//  *  10/03/2007, 6:31pm
//  *
//  *  17/11/2011
//  *    Updated to 0.5d which supports SA:MP 0.3d

import { Player, PlayerEvent } from "@infernus/core";
import {
  DEBUG_VERSION,
  MIN_OBJECT_ID,
  CAMERA_MODE_A,
  MIN_SKIN_ID,
  MIN_VEHICLE_ID,
  curPlayerCamD,
  curPlayerObjI,
  curPlayerObjM,
  curPlayerSkin,
  curPlayerVehI,
  curPlayerVehM,
  curServerVehP,
  gPlayerStatus,
  gPlayerTimers,
  pObjectRate,
} from "./constants";
import { IFsDebug, I_OBJECT, I_OBJ_RATE } from "./interfaces";
import { registerCameraSelect } from "./commands/cameraSelect";
import { registerVehicleSelect } from "./commands/vehicleSelect";
import { registerWorldSelect } from "./commands/worldSelect";
import { registerSkinSelect } from "./commands/skinSelect";
import { registerObjectSelect } from "./commands/objectSelect";
import { registerMiscCommands } from "./commands/miscCommands";

export const FsDebug: IFsDebug = {
  name: "fs_debug",
  load(options) {
    console.log("\n  *********************\n  * SA:MP DEBUG 0.2   *");
    console.log("  * By Simon Campbell *\n  *********************");
    console.log(
      `  * Version: ${DEBUG_VERSION}      *\n  *********************`,
    );
    console.log("  * -- LOADED         *\n  *********************\n");

    Player.getInstances().forEach((player) => {
      const p_curPlayerObjM = curPlayerObjM.get(player) || ({} as I_OBJECT);
      p_curPlayerObjM.OBJ_MDL = MIN_OBJECT_ID;
      curPlayerObjM.set(player, p_curPlayerObjM);

      const p_pObjectRate = pObjectRate.get(player) || ({} as I_OBJ_RATE);
      p_pObjectRate.OBJ_RATE_ROT = 1.0;
      p_pObjectRate.OBJ_RATE_MOVE = 1.0;
      pObjectRate.set(player, p_pObjectRate);
    });

    const onCommandReceived = PlayerEvent.onCommandReceived(
      ({ player, command, next }) => {
        const injectCommands = [
          "s",
          "ssel",
          "skin",
          "v",
          "vsel",
          "vehicle",
          "w",
          "t",
          "g",
          "wsel",
          "time",
          "weather",
          "gravity",
          "w2",
          "goto",
          "bring",
          "warpto",
          "weapon",
          "setloc",
          "csel",
          "camera",
          "osel",
          "object",
          "debug",
        ];
        const mainCmd = command.split(" ")[0];
        if (mainCmd && injectCommands.includes(mainCmd)) {
          if (options?.adminsOnly && !player.isAdmin()) return false;
          return next();
        }
        return next();
      },
    );

    const onDisconnect = PlayerEvent.onDisconnect(({ player, next }) => {
      const timer = gPlayerTimers.get(player);
      if (timer) {
        clearInterval(timer);
        gPlayerTimers.delete(player);
      }
      gPlayerStatus.delete(player);
      return next();
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      curPlayerCamD.set(player, {
        MODE: CAMERA_MODE_A,
        RATE: 2.0,
        POS_X: 0.0,
        POS_Y: 0.0,
        POS_Z: 0.0,
        LOOK_X: 0.0,
        LOOK_Y: 0.0,
        LOOK_Z: 0.0,
      });
      curPlayerSkin.set(player, MIN_SKIN_ID); // Current Player Skin ID
      curPlayerVehM.set(player, MIN_VEHICLE_ID); // Current Player Vehicle ID
      curPlayerVehI.set(player, -1);
      return next();
    });

    const onClickMap = PlayerEvent.onClickMap(
      ({ player, fX, fY, fZ, next }) => {
        if (options?.adminsOnly && !player.isAdmin()) {
          return next();
        }
        player.setPosFindZ(fX, fY, fZ);
        return next();
      },
    );

    const offCameSelect = registerCameraSelect(options);
    const offWorldSelect = registerWorldSelect(options);
    const offVehicleSelect = registerVehicleSelect(options);
    const offSkinSelect = registerSkinSelect(options);
    const offObjectCommands = registerObjectSelect(options);
    const offMiscCommands = registerMiscCommands(options);

    return [
      onCommandReceived,
      onDisconnect,
      onConnect,
      onClickMap,
      ...offCameSelect,
      ...offWorldSelect,
      ...offVehicleSelect,
      ...offSkinSelect,
      ...offObjectCommands,
      ...offMiscCommands,
    ];
  },
  unload() {
    console.log("\n  *********************\n  * SA:MP DEBUG 0.2   *");
    console.log("  * -- SHUTDOWN       *\n  *********************\n");

    gPlayerStatus.clear();
    Array.from(gPlayerTimers.values()).forEach((t) => clearTimeout(t));
    gPlayerTimers.clear();

    curPlayerSkin.clear();
    curPlayerVehM.clear();
    curPlayerVehI.clear();

    pObjectRate.clear();
    curPlayerObjM.clear();
    curPlayerObjI.clear();
    curPlayerCamD.clear();
    curServerVehP.clear();
  },
};
