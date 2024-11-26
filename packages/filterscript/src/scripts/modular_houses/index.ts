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
import { GameText, PlayerEvent, DynamicObject } from "@infernus/core";
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
      o.setMaterial(
        materialIndex,
        materialModelId!,
        txdName!,
        textureName!,
        materialColor!,
      );
    }
    return o;
  });
}

export const ModularHouses: IFilterScript = {
  name: "modular_houses",
  load() {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- Modular Houses FilterScript by Matite");
    console.log("  |--  Script v1.01");
    console.log("  |--  28th February 2015");
    console.log("  |---------------------------------------------------");

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
        vehicle.setPos(
          -3305.72 + Math.random() * 2,
          1602.27 + Math.random() * 2,
          6.2,
        );
        vehicle.setZAngle(233);
        // Link vehicle to interior
        vehicle.linkToInterior(0);
      } else {
        // On Foot
        // Set player position and facing angle
        player.setPos(
          -3305.72 + Math.random() * 2,
          1602.27 + Math.random() * 2,
          6.2,
        );
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
    createdObjects.forEach((o) => o.destroy());
    createdObjects = [];

    // Display information in the Server Console
    console.log("  |---------------------------------------------------");
    console.log("  |--  Modular Houses FilterScript Unloaded");
    console.log("  |---------------------------------------------------");
  },
};
