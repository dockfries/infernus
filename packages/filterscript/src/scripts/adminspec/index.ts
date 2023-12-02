/*
  ADMIN SPECTATE FILTER SCRIPT
  kye 2007
*/

import type { IAdminSpecOptions } from "filterscript/interfaces";
import type { IFilterScript } from "@infernus/core";
import { Vehicle } from "@infernus/core";
import {
  Player,
  PlayerEvent,
  InvalidEnum,
  PlayerStateEnum,
} from "@infernus/core";
import { ColorEnum } from "./enums/color";
import { ADMIN_SPEC_TYPE } from "./enums/type";

class AdminSpecPlayer {
  gSpectateID = -1;
  gSpectateType = ADMIN_SPEC_TYPE.NONE;
}

const myPlayers = new Map<Player, AdminSpecPlayer>();

const specCommands = ["specplayer", "specvehicle", "specoff"];

// WE ONLY DEAL WITH COMMANDS FROM ADMINS IN THIS FILTERSCRIPT
PlayerEvent.onCommandPerformed(({ player, command, next }) => {
  if (specCommands.includes(command) && !player.isAdmin()) return false;
  return next();
});

// IF ANYONE IS SPECTATING THIS PLAYER, WE'LL ALSO HAVE
// TO CHANGE THEIR INTERIOR ID TO MATCH
PlayerEvent.onInteriorChange(({ player, newInteriorId }) => {
  Player.getInstances().forEach((p) => {
    const mp = myPlayers.get(p);
    if (
      mp &&
      p.isConnected() &&
      p.getState() === PlayerStateEnum.SPECTATING &&
      mp.gSpectateID === p.id &&
      mp.gSpectateType === ADMIN_SPEC_TYPE.PLAYER &&
      p !== player
    ) {
      p.setInterior(newInteriorId);
    }
  });
  return true;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAdminSpecFs = (options?: IAdminSpecOptions): IFilterScript => {
  let offs: (() => void)[] = [];
  return {
    name: "admin_spec",
    load() {
      Player.getInstances().forEach((player) => {
        myPlayers.set(player, new AdminSpecPlayer());
      });

      const offOnConnect = PlayerEvent.onConnect(({ next, player }) => {
        myPlayers.set(player, new AdminSpecPlayer());
        return next();
      });

      const offOnDisconnect = PlayerEvent.onDisconnect(({ next, player }) => {
        myPlayers.delete(player);
        return next();
      });

      // SPECTATE A PLAYER
      const offSpecPlayer = PlayerEvent.onCommandText(
        "specplayer",
        ({ player, subcommand, next }) => {
          const [specId] = subcommand;
          if (!specId) {
            player.sendClientMessage(
              ColorEnum.WHITE,
              "USAGE: /specplayer [playerId]"
            );
            return next();
          }

          const specPlayer = Player.getInstance(+specId);
          if (!specPlayer || !specPlayer.isConnected()) {
            player.sendClientMessage(
              ColorEnum.RED,
              "specplayer: that player isn't active."
            );
            return next();
          }

          player.toggleSpectating(true);
          player.spectatePlayer(specPlayer);
          player.setInterior(specPlayer.getInterior());

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const mp = myPlayers.get(player)!;
          mp.gSpectateID = specPlayer.id;
          mp.gSpectateType = ADMIN_SPEC_TYPE.PLAYER;
          return next();
        }
      );

      // SPECTATE A VEHICLE
      const offSpecVehicle = PlayerEvent.onCommandText(
        "specvehicle",
        ({ player, subcommand, next }) => {
          const [vehId] = subcommand;
          if (!vehId) {
            player.sendClientMessage(
              ColorEnum.WHITE,
              "USAGE: /specvehicle [vehicleId]"
            );
            return next();
          }

          const specVehicle = Vehicle.getInstance(+vehId);
          if (!specVehicle) return next();

          player.toggleSpectating(true);
          player.spectateVehicle(specVehicle);

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const mp = myPlayers.get(player)!;

          mp.gSpectateID = specVehicle.id;
          mp.gSpectateType = ADMIN_SPEC_TYPE.VEHICLE;

          return next();
        }
      );

      // STOP SPECTATING
      const offSpecOff = PlayerEvent.onCommandText(
        "specoff",
        ({ player, next }) => {
          player.toggleSpectating(false);

          const mp = myPlayers.get(player)!;
          mp.gSpectateID = InvalidEnum.PLAYER_ID;
          mp.gSpectateType = ADMIN_SPEC_TYPE.NONE;
          return next();
        }
      );

      offs.push(
        offOnConnect,
        offOnDisconnect,
        offSpecPlayer,
        offSpecVehicle,
        offSpecOff
      );
    },
    unload() {
      offs.forEach((off) => off());
      offs = [];
      /* empty */
    },
  };
};
