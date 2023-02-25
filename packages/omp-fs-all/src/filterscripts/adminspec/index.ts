/*
  ADMIN SPECTATE FILTER SCRIPT
  kye 2007
*/

import { IAdminSpecOptions } from "@/interfaces";
import {
  BasePlayer,
  BasePlayerEvent,
  BaseVehicle,
  BaseVehicleEvent,
  IFilterScript,
  InvalidEnum,
  PlayerStateEnum,
} from "omp-node-lib";
import { ColorEnum } from "./enums/color";
import { ADMIN_SPEC_TYPE } from "./enums/type";

class AdminSpecPlayer extends BasePlayer {
  public gSpectateID = -1;
  public gSpectateType = ADMIN_SPEC_TYPE.NONE;
}

class AdminSpecPlayerEvent extends BasePlayerEvent<AdminSpecPlayer> {
  // WE ONLY DEAL WITH COMMANDS FROM ADMINS IN THIS FILTERSCRIPT
  onCommandPerformed(player: AdminSpecPlayer) {
    if (!player.isAdmin()) return false;
    return true;
  }

  // IF ANYONE IS SPECTATING THIS PLAYER, WE'LL ALSO HAVE
  // TO CHANGE THEIR INTERIOR ID TO MATCH
  onInteriorChange(player: AdminSpecPlayer, newinteriorid: number) {
    this.getPlayersArr().forEach((p) => {
      if (
        p.isConnected() &&
        p.getState() === PlayerStateEnum.SPECTATING &&
        p.gSpectateID === p.id &&
        p.gSpectateType === ADMIN_SPEC_TYPE.PLAYER &&
        p !== player
      ) {
        p.setInterior(newinteriorid);
      }
    });
    return true;
  }
}

class AdminSpecVehicleEvent extends BaseVehicleEvent<
  AdminSpecPlayer,
  BaseVehicle
> {}

export const useAdminSpecFs = (options?: IAdminSpecOptions): IFilterScript => {
  return {
    name: "admin_spec",
    load() {
      const playerEvent = new AdminSpecPlayerEvent(
        (id) => new AdminSpecPlayer(id)
      );
      const vehicleEvent = new AdminSpecVehicleEvent(
        playerEvent.getPlayersMap()
      );

      // SPECTATE A PLAYER
      playerEvent.onCommandText("specplayer", (p, specId) => {
        if (!specId) {
          p.sendClientMessage(ColorEnum.WHITE, "USAGE: /specplayer [playerid]");
          return true;
        }

        const specPlayer = playerEvent.findPlayerById(+specId);
        if (!specPlayer || !specPlayer.isConnected()) {
          p.sendClientMessage(
            ColorEnum.RED,
            "specplayer: that player isn't active."
          );
          return true;
        }

        p.toggleSpectating(true);
        p.spectatePlayer(specPlayer);
        p.setInterior(specPlayer.getInterior());
        p.gSpectateID = specPlayer.id;
        p.gSpectateType = ADMIN_SPEC_TYPE.PLAYER;
        return true;
      });

      // SPECTATE A VEHICLE
      playerEvent.onCommandText("specvehicle", (p, vehId) => {
        if (!vehId) {
          p.sendClientMessage(
            ColorEnum.WHITE,
            "USAGE: /specvehicle [vehicleid]"
          );
          return true;
        }

        const specVehicle = vehicleEvent.findVehicleById(+vehId);
        if (!specVehicle) return true;

        p.toggleSpectating(true);
        p.spectateVehicle(specVehicle);
        p.gSpectateID = specVehicle.id;
        p.gSpectateType = ADMIN_SPEC_TYPE.VEHICLE;

        return true;
      });

      // STOP SPECTATING
      playerEvent.onCommandText("specoff", (p) => {
        p.toggleSpectating(false);
        p.gSpectateID = InvalidEnum.PLAYER_ID;
        p.gSpectateType = ADMIN_SPEC_TYPE.NONE;
        return true;
      });
    },
    unload() {
      /* empty */
    },
  };
};
