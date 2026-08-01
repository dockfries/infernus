// Example FilterScript for the new Modular House Objects
// ------------------------------------------------------
// By Matite in February 2015
//
// This script creates a Modular Island with Modular Houses just off the coast
// in SF (near Jizzy's Nightclub).
//
// Warning...
// This script uses a total of 205 player objects and enables the /mh teleport
// command by default.

import type { IFilterScript } from "@infernus/core";
import { LogLevelEnum, GameText, PlayerEvent, DynamicObject } from "@infernus/core";
import { modularHousesObjects } from "./constants";

let createdObjects: DynamicObject[] = [];

function createMHObjects() {
  createdObjects = modularHousesObjects.map((obj) => {
    const [
      modelId,
      x,
      y,
      z,
      rx,
      ry,
      rz,
      materialIndex,
      materialModelId,
      txdName,
      textureName,
      materialColor,
    ] = obj;
    const o = new DynamicObject({
      modelId,
      x,
      y,
      z,
      rx,
      ry,
      rz,
      drawDistance: 999.0,
    });
    o.create();
    if (materialIndex !== undefined) {
      o.setMaterial(materialIndex, materialModelId!, txdName!, textureName!, materialColor!);
    }
    return o;
  });
}

export const ModularHouses: IFilterScript = {
  name: "modular_houses",
  load() {
    // Display information in the Server Console
    samp.logprint("\n", LogLevelEnum.INFO);
    samp.logprint("  |---------------------------------------------------", LogLevelEnum.INFO);
    samp.logprint("  |--- Modular Houses FilterScript by Matite", LogLevelEnum.INFO);
    samp.logprint("  |--  Script v1.01", LogLevelEnum.INFO);
    samp.logprint("  |--  28th February 2015", LogLevelEnum.INFO);
    samp.logprint("  |---------------------------------------------------", LogLevelEnum.INFO);

    createMHObjects();

    const offs = [];

    const mh = PlayerEvent.onCommandText("mh", ({ player, next }) => {
      // Set the player interior
      player.setInterior(0);
      // Check if the player is in any vehicle
      if (player.isInAnyVehicle()) {
        // In a Vehicle
        // Set vehicle position and facing angle
        const vehicle = player.getVehicle()!;
        vehicle.setPos(-3305.72 + Math.random() * 2, 1602.27 + Math.random() * 2, 6.2);
        vehicle.setZAngle(233);
        // Link vehicle to interior
        vehicle.linkToInterior(0);
      } else {
        // On Foot
        // Set player position and facing angle
        player.setPos(-3305.72 + Math.random() * 2, 1602.27 + Math.random() * 2, 6.2);
        player.setFacingAngle(233);
      }
      // Fix camera position after teleporting
      player.setCameraBehind();

      // Send a gametext message to the player
      new GameText("~b~~h~Modular Houses!", 3000, 3).forPlayer(player);
      return next();
    });

    offs.push(mh);

    return offs;
  },
  unload() {
    createdObjects.forEach((o) => o.isValid() && o.destroy());
    createdObjects = [];

    // Display information in the Server Console
    samp.logprint("  |---------------------------------------------------", LogLevelEnum.INFO);
    samp.logprint("  |--  Modular Houses FilterScript Unloaded", LogLevelEnum.INFO);
    samp.logprint("  |---------------------------------------------------", LogLevelEnum.INFO);
  },
};
