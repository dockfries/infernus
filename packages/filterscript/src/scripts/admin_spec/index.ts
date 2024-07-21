/*
  ADMIN SPECTATE FILTER SCRIPT
  kye 2007
*/

import { Vehicle } from "@infernus/core";
import {
  Player,
  PlayerEvent,
  InvalidEnum,
  PlayerStateEnum,
} from "@infernus/core";
import { ColorEnum } from "./enums/color";
import { ADMIN_SPEC_TYPE } from "./enums/type";
import type { IAdminSpecFS } from "./interfaces";

class AdminSpecPlayer {
  gSpectateID = -1;
  gSpectateType = ADMIN_SPEC_TYPE.NONE;
}

const myPlayers = new Map<Player, AdminSpecPlayer>();

const specCommands: string[] = [];

export const AdminSpec: IAdminSpecFS = {
  name: "admin_spec",
  load(options) {
    specCommands.push(options?.command?.player || "specplayer");
    specCommands.push(options?.command?.vehicle || "specvehicle");
    specCommands.push(options?.command?.off || "specoff");

    // WE ONLY DEAL WITH COMMANDS FROM ADMINS IN THIS FILTERSCRIPT
    const offCommandPerformed = PlayerEvent.onCommandPerformed(
      ({ player, command, next }) => {
        if (specCommands.includes(command) && !player.isAdmin()) return false;
        return next();
      },
    );

    // IF ANYONE IS SPECTATING THIS PLAYER, WE'LL ALSO HAVE
    // TO CHANGE THEIR INTERIOR ID TO MATCH
    const offInteriorChange = PlayerEvent.onInteriorChange(
      ({ player, newInteriorId }) => {
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
      },
    );

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
      specCommands[0],
      ({ player, subcommand, next }) => {
        const [specId] = subcommand;
        if (!specId) {
          player.sendClientMessage(
            ColorEnum.WHITE,
            "USAGE: /specplayer [playerId]",
          );
          return next();
        }

        const specPlayer = Player.getInstance(+specId);
        if (!specPlayer || !specPlayer.isConnected()) {
          player.sendClientMessage(
            ColorEnum.RED,
            "specplayer: that player isn't active.",
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
      },
    );

    // SPECTATE A VEHICLE
    const offSpecVehicle = PlayerEvent.onCommandText(
      specCommands[1],
      ({ player, subcommand, next }) => {
        const [vehId] = subcommand;
        if (!vehId) {
          player.sendClientMessage(
            ColorEnum.WHITE,
            "USAGE: /specvehicle [vehicleId]",
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
      },
    );

    // STOP SPECTATING
    const offSpecOff = PlayerEvent.onCommandText(
      specCommands[2],
      ({ player, next }) => {
        player.toggleSpectating(false);

        const mp = myPlayers.get(player)!;
        mp.gSpectateID = InvalidEnum.PLAYER_ID;
        mp.gSpectateType = ADMIN_SPEC_TYPE.NONE;
        return next();
      },
    );

    return [
      offCommandPerformed,
      offInteriorChange,
      offOnConnect,
      offOnDisconnect,
      offSpecPlayer,
      offSpecVehicle,
      offSpecOff,
    ];
  },
  unload() {
    specCommands.splice(0, specCommands.length);
  },
};
