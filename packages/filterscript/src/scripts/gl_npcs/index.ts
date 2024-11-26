//-------------------------------------------------
//
//  NPC initialisation for Grand Larceny
//
//-------------------------------------------------

import { Vehicle, GameMode, Npc, PlayerEvent } from "@infernus/core";
import { npcNames, spawnInfo, vehiclePutId } from "./constants";
import type { IGlNpcsFS } from "./interfaces";

function setVehicleTireStatus(vehicle: Vehicle, tireStatus: number) {
  const { panels, doors, lights } = vehicle.getDamageStatus()!;
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

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      if (!player.isNpc()) return next();
      const ip_addr_npc = GameMode.getConsoleVarAsString("bind");
      let ip_addr_server = player.getIp();

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

    const onRequestClass = PlayerEvent.onRequestClass(({ player, next }) => {
      if (!player.isNpc()) return next(); // We only deal with NPC players in this script

      const playerName = player.getName();

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

    const onSpawn = PlayerEvent.onSpawn(({ player, next }) => {
      if (!player.isNpc()) return next(); // We only deal with NPC players in this script

      const playerName = player.getName();

      if (playerName in vehiclePutId) {
        const veh = Vehicle.getInstance(
          vehiclePutId[playerName as keyof typeof vehiclePutId],
        );
        veh!.putPlayerIn(player, 0);
        player.setColor(0xffffffff);

        if (playerName === "DriverTest2" && options && options.test) {
          setVehicleTireStatus(veh!, 0xff);
        }
      }

      return next();
    });

    Npc.connect(npcNames[0], "train_lv");
    Npc.connect(npcNames[1], "train_ls");
    Npc.connect(npcNames[2], "train_sf");
    Npc.connect(npcNames[3], "at400_lv");
    Npc.connect(npcNames[4], "at400_sf");
    Npc.connect(npcNames[5], "at400_ls");

    // Testing
    if (options && options.test) {
      Npc.connect(npcNames[6], "onfoot_test");
      Npc.connect(npcNames[7], "mat_test2");
      Npc.connect(npcNames[8], "driver_test2");
    }

    return [onConnect, onRequestClass, onSpawn];
  },
  unload() {},
};
