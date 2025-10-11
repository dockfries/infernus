//-------------------------------------------------
//
//  NPC initialisation for Grand Larceny
//
//-------------------------------------------------

import {
  Vehicle,
  GameMode,
  Npc,
  PlayerEvent,
  PlayerStateEnum,
} from "@infernus/core";
import { npcNames, spawnInfo, vehCreateInfo } from "./constants";
import type { IGlNpcsFS } from "./interfaces";
import { initNpcModes } from "./npcmodes";

function setVehicleTireStatus(vehicle: Vehicle, tireStatus: number) {
  const { panels, doors, lights } = vehicle.getDamageStatus();
  vehicle.updateDamageStatus(panels, doors, lights, tireStatus);
}

export const GlNpcs: IGlNpcsFS = {
  name: "gl_npcs",
  load(options) {
    //-------------------------------------------------
    // IMPORTANT: This restricts NPCs connecting from
    // an IP address outside this server. If you need
    // to connect NPCs externally you will need to modify
    // the code in this callback.

    const vehCreatedInfo: Record<string, Vehicle> = {};

    Object.entries(vehCreateInfo).forEach(([npcName, vehInfo]) => {
      vehCreatedInfo[npcName] = new Vehicle(vehInfo, true);
      vehCreatedInfo[npcName].create();
    });

    const offConnect = PlayerEvent.onConnect(({ player, next }) => {
      if (!player.isNpc()) return next();
      const ip_addr_npc =
        GameMode.getConsoleVarAsString("network.bind").consoleVar;
      let ip_addr_server = player.getIp().ip;

      if (!ip_addr_server) {
        ip_addr_server = "127.0.0.1";
      }

      if (ip_addr_npc === ip_addr_server) {
        // this bot is remote connecting
        console.log(
          "NPC: Got a remote NPC connecting from %s and I'm kicking it.",
          ip_addr_npc,
        );
        player.kick();
        return false;
      }

      console.log("NPC: Connection from %s is allowed.", ip_addr_npc);
      return next();
    });

    const offRequestClass = PlayerEvent.onRequestClass(({ player, next }) => {
      if (!player.isNpc()) return next(); // We only deal with NPC players in this script

      const playerName = player.getName().name;

      if (playerName in spawnInfo) {
        const [team, skin, x, y, z, rotation] =
          spawnInfo[playerName as keyof typeof spawnInfo];
        player.setSpawnInfo(
          team,
          skin,
          x,
          y,
          z,
          rotation,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
        );
      }

      return next();
    });

    const offStateChange = PlayerEvent.onStateChange(
      ({ player, newState, next }) => {
        if (!player.isNpc()) return next();

        if (newState !== PlayerStateEnum.ONFOOT) return next();

        const playerName = player.getName().name;

        if (playerName in vehCreatedInfo) {
          player.setColor(0xffffffff);

          const veh = vehCreatedInfo[playerName];
          Npc.getInstance(player.id)!.putInVehicle(veh, 0);

          if (playerName === "DriverTest2") {
            setVehicleTireStatus(veh!, 0xff);
          }
        }

        return next();
      },
    );

    npcNames.slice(0, 6).forEach((name) => {
      new Npc(name).spawn();
    });

    // Testing
    if (options && options.test) {
      npcNames.slice(6).forEach((name) => {
        new Npc(name).spawn();
      });
    }

    return [
      offConnect,
      offRequestClass,
      offStateChange,
      ...initNpcModes(),
      () => {
        Object.values(vehCreatedInfo).forEach((veh) => {
          if (veh.isValid()) {
            veh.destroy();
          }
        });
      },
    ];
  },
  unload() {},
};
