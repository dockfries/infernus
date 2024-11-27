import { PlayerEvent, Player } from "@infernus/core";
import { COLOR_RED, COLOR_GREEN, aWeaponNames } from "../constants";
import { IFsDebugOptions } from "../interfaces";
import { getXYInFrontOfPlayer, getWeaponModelIDFromName } from "../utils";

export function registerMiscCmds(options?: IFsDebugOptions) {
  if (options?.miscCommands === false) return [];

  const goto = PlayerEvent.onCommandText(
    ["goto", "warpto"],
    ({ player, subcommand, next }) => {
      if (!subcommand[0]) {
        player.sendClientMessage(
          COLOR_RED,
          "[USAGE]: /goto PLAYERID (X_OFFSET Y_OFFSET Z_OFFSET)",
        );
        return next();
      }
      const id = +subcommand[0];
      if (!Player.isConnected(id)) {
        player.sendClientMessage(COLOR_RED, "[ERROR]: Not connected PLAYERID.");
        return next();
      }
      const pInstance = Player.getInstance(id)!;
      const interior = pInstance.getInterior();
      const pos = pInstance.getPos()!;
      let x = pos.x;
      let y = pos.y;
      let z = pos.z;
      if (!subcommand[1]) {
        const frontXY = getXYInFrontOfPlayer(pInstance, 1.5);
        x = frontXY.x;
        y = frontXY.y;
        player.setInterior(interior);
        player.setPos(x, y, z);
        const pName = pInstance.getName();
        player.sendClientMessage(
          COLOR_GREEN,
          `[SUCCESS]: You have warped to ${pName} (ID: ${id}).`,
        );
        return next();
      }
      x += +subcommand[1];
      if (subcommand[2]) {
        y += +subcommand[2];
      }
      if (subcommand[3]) {
        z += +subcommand[3];
      }
      const pVeh = player.getVehicle();
      if (pVeh) {
        pVeh.setPos(x, y, z);
        pVeh.linkToInterior(interior);
      } else {
        player.setPos(x, y, z);
      }
      player.setInterior(interior);
      const pName = pInstance.getName();
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: You have warped to ${pName} (ID: ${id}).`,
      );
      return next();
    },
  );

  const setLocation = PlayerEvent.onCommandText(
    "setloc",
    ({ player, subcommand, next }) => {
      if (!subcommand[0]) {
        player.sendClientMessage(COLOR_RED, "[USAGE]: /setloc X Y Z INTERIOR");
        return next();
      }
      const x = +subcommand[0];
      const y = +subcommand[1];
      const z = +subcommand[2];
      const interior = +subcommand[3];
      const pVeh = player.getVehicle();
      if (pVeh) {
        pVeh.setPos(x, y, z);
        pVeh.linkToInterior(interior);
      } else {
        player.setPos(x, y, z);
      }
      player.setInterior(interior);
      return next();
    },
  );

  const bring = PlayerEvent.onCommandText(
    "bring",
    ({ player, subcommand, next }) => {
      if (!subcommand[0]) {
        player.sendClientMessage(
          COLOR_RED,
          "[USAGE]: /bring PLAYERID (X_OFFSET Y_OFFSET Z_OFFSET)",
        );
        return next();
      }
      const id = +subcommand[0];
      if (!Player.isConnected(id)) {
        player.sendClientMessage(COLOR_RED, "[ERROR]: Not connected PLAYERID.");
        return next();
      }
      const pInstance = Player.getInstance(id)!;
      const interior = player.getInterior();
      const pos = player.getPos()!;
      let x = pos.x;
      let y = pos.y;
      let z = pos.z;
      if (!subcommand[1]) {
        const frontXY = getXYInFrontOfPlayer(player, 1.5);
        x = frontXY.x;
        y = frontXY.y;
        pInstance.setInterior(interior);
        pInstance.setPos(x, y, z);
        const pName = pInstance.getName();
        player.sendClientMessage(
          COLOR_GREEN,
          `[SUCCESS]: You have brought ${pName} (ID: ${id}) to you.`,
        );
        return next();
      }
      x += +subcommand[1];
      if (subcommand[2]) {
        y += +subcommand[2];
      }
      if (subcommand[3]) {
        z += +subcommand[3];
      }
      const pVeh = pInstance.getVehicle();
      if (pVeh) {
        pVeh.setPos(x, y, z);
        pVeh.linkToInterior(interior);
      } else {
        pInstance.setPos(x, y, z);
      }
      const pName = pInstance.getName();
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: You have brought ${pName} (ID: ${id}) to you.`,
      );
      return next();
    },
  );

  const weapon = PlayerEvent.onCommandText(
    ["weapon", "w2"],
    ({ player, subcommand, next }) => {
      if (!subcommand[0]) {
        player.sendClientMessage(
          COLOR_RED,
          "[USAGE]: /w2 WEAPONID/NAME (AMMO) or /weapon WEAPONID/NAME (AMMO)",
        );
        return next();
      }
      let weaponId = getWeaponModelIDFromName(subcommand[0]);
      if (weaponId === -1) {
        weaponId = +subcommand[0];
        if (weaponId < 0 || weaponId > 47) {
          player.sendClientMessage(COLOR_RED, "[ERROR]: Invalid WEAPONID/NAME");
          return next();
        }
      }
      if (!subcommand[1]) {
        player.giveWeapon(weaponId, 500);
        player.sendClientMessage(
          COLOR_GREEN,
          `[SUCCESS]: You were given weapon ${aWeaponNames[weaponId]} (ID: ${weaponId}) with 500 ammo.`,
        );
        return next();
      }
      const idx = +subcommand[2];
      player.giveWeapon(weaponId, idx);
      player.sendClientMessage(
        COLOR_GREEN,
        `[SUCCESS]: You were given weapon ${aWeaponNames[weaponId]} (ID: ${weaponId}) with ${idx} ammo.`,
      );
      return next();
    },
  );

  return [goto, setLocation, bring, weapon];
}
