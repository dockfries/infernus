// Example FilterScript for the new Modular Island Objects
// -------------------------------------------------------
// By Matite in January 2015
//
// This script creates a Modular Island just off the coast in SF (next to the
// docks near the hospital).
//
// Warning...
// This script uses a total of 87 objects

import { GameText, PlayerEvent, DynamicObject } from "@infernus/core";
import { modularIslandObjects } from "./constants";
import type { IModularIsLandFS } from "./interfaces";

let createdObjects: DynamicObject[] = [];

function createMIObjects() {
  createdObjects = modularIslandObjects.map((obj) => {
    const [modelId, x, y, z, rx, ry, rz] = obj;
    const o = new DynamicObject({
      modelId,
      x,
      y,
      z,
      rx,
      ry,
      rz,
      drawDistance: 599.0,
    });
    o.create();
    return o;
  });
  // Create modular island objects (with draw distance of 599m)
}

export const ModularIsland: IModularIsLandFS = {
  name: "modular_island",
  load(options) {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- Modular Island FilterScript by Matite");
    console.log("  |--  Script v1.01");
    console.log("  |--  12th January 2015");
    console.log("  |---------------------------------------------------");

    createMIObjects();

    const offs = [];

    // Un-comment the OnPlayerCommandText callback below (remove the "/*" and the "*/")
    // to enable a simple teleport command (/mi) which teleports the player to
    // the modular island in SF.
    if (options && options.enableCommand) {
      const mi = PlayerEvent.onCommandText("mi", ({ player, next }) => {
        // Set the interior
        player.setInterior(0);

        // Set player position and facing angle
        player.setPos(
          -3343.57 + Math.random() * 2,
          194.34 + Math.random() * 2,
          6.2,
        );
        player.setFacingAngle(315);

        // Fix camera position after teleporting
        player.setCameraBehind();

        // Send a gametext message to the player
        new GameText("~b~~h~Modular Island!", 3000, 3).forPlayer(player);
        return next();
      });
      offs.push(mi);
    }

    return offs;
  },
  unload() {
    createdObjects.forEach((o) => o.isValid() && o.destroy());
    createdObjects = [];

    // Display information in the Server Console
    console.log("  |---------------------------------------------------");
    console.log("  |--  Modular Island FilterScript Unloaded");
    console.log("  |---------------------------------------------------");
  },
};
