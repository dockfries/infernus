// Example FilterScript for Kylie's Barn Object
// --------------------------------------------
// By Matite in March 2015
//
//
// This script creates the repaired Kylie's Barn Building object and removes
// the existing GTASA barn object (normally this object has some collision
// bugs that prevent the player from moving about inside it).
//
// Warning...
// This script uses a total of:
// * 1 object = 1 for the replacement barn object
// * Enables the /kb command to teleport the player to Kylie's Barn

import type { IFilterScript } from "@infernus/core";
import { DynamicObject, GameText, Player, PlayerEvent } from "@infernus/core";

// Stores the created object number of the replacement barn object so
// it can be destroyed when the filterscript is unloaded
let KyliesBarnObject1: DynamicObject | null = null; // Barn object

function removeBuilding(p: Player) {
  p.removeBuilding(14871, 286.188, 307.609, 1002.01, 250.0); // Barn
}

export const KyliesBarn: IFilterScript = {
  name: "kylies_barn",
  load() {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- Kylie's Barn FilterScript");
    console.log("  |--  Script v1.01");
    console.log("  |--  6th March 2015");
    console.log("  |---------------------------------------------------");

    // Create Kylie's Barn repaired object
    KyliesBarnObject1 = new DynamicObject({
      modelId: 19881,
      x: 286.188,
      y: 307.609,
      z: 1002.01,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    KyliesBarnObject1.create();

    // Display information in the Server Console
    console.log("  |--  Kylie's Barn object created");
    console.log("  |---------------------------------------------------");

    Player.getInstances().forEach((p) => {
      // Check if the player is connected and not a NPC
      if (!p.isNpc()) {
        // Remove default GTASA Kylie's Barn object for the player (so any
        // player currently ingame does not have to rejoin for them to be
        // removed when this filterscript is loaded)
        removeBuilding(p);
      }
    });

    const kbCommand = PlayerEvent.onCommandText("kb", ({ player, next }) => {
      // Set the interior
      player.setInterior(3);

      // Set player position and facing angle
      player.setPos(292.03, 309.82, 999.55);
      player.setFacingAngle(88);

      // Fix camera position after teleporting
      player.setCameraBehind();

      // Send a gametext message to the player
      new GameText("~b~~h~Kylie's Barn!", 3000, 3).forPlayer(player);

      return next();
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      // Remove default GTASA Kylie's Barn object for the player
      removeBuilding(player); // Barn
      return next();
    });

    return [kbCommand, onConnect];
  },
  unload() {
    // Check for valid object
    if (KyliesBarnObject1!.isValid()) {
      // Destroy the Kylie's Barn object
      KyliesBarnObject1!.destroy();

      // Display information in the Server Console
      console.log("  |---------------------------------------------------");
      console.log("  |--  Kylie's Barn object destroyed");
    }

    // Display information in the Server Console
    console.log("  |---------------------------------------------------");
    console.log("  |--  Kylie's Barn FilterScript Unloaded");
    console.log("  |---------------------------------------------------");
  },
};
