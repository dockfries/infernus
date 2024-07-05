// -----------------------------------------------------------------------------
// Example Filterscript for the LS Wells Fargo Building Object
// -----------------------------------------------------------
// By Matite in March 2015
//
//
// This script creates the edited LS Wells Fargo Building object and
// removes the existing GTASA building object.
//
// Warning...
// This script uses a total of:
// * 1 object = 1 for the replacement building object
// * Enables the /lswf command to teleport the player to the LS Wells Fargo Building
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

import type { IFilterScript } from "@infernus/core";
import { GameText, Player, PlayerEvent } from "@infernus/core";
import { DynamicObject } from "@infernus/core";

// Stores the created object number of the replacement building object so
// it can be destroyed when the filterscript is unloaded
let LSWellsFargoObject1: DynamicObject | null = null; // Building object

function removeBuilding(p: Player) {
  p.removeBuilding(4007, 1421.38, -1477.6, 42.2031, 250.0); // Building
  p.removeBuilding(4009, 1421.38, -1477.6, 42.2031, 250.0); // LOD
}

export const LsWellsFargo: IFilterScript = {
  name: "ls_wells_fargo",
  load() {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- LS Wells Fargo Building Filterscript");
    console.log("  |--  Script v1.01");
    console.log("  |--  6th March 2015");
    console.log("  |---------------------------------------------------");

    // Create the LS Wells Fargo Building object
    LSWellsFargoObject1 = new DynamicObject({
      modelId: 19879,
      x: 1421.38,
      y: -1477.6,
      z: 42.2031,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    LSWellsFargoObject1.create();
    // Display information in the Server Console
    console.log("  |--  LS Wells Fargo Building object created");
    console.log("  |---------------------------------------------------");

    Player.getInstances().forEach((p) => {
      // Check if the player is connected and not a NPC
      if (!p.isNpc()) {
        // Remove default GTASA Wells Fargo Building and LOD map objects for the player
        // (so any player currently ingame does not have to rejoin for them
        //  to be removed when this filterscript is loaded)
        removeBuilding(p);
      }
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      // Remove default GTASA Wells Fargo Building and LOD map objects for the player
      removeBuilding(player);
      return next();
    });

    const command = PlayerEvent.onCommandText("lswf", ({ player, next }) => {
      // Set the interior
      player.setInterior(0);

      // Set player position and facing angle
      player.setPos(1448.43, -1468.28, 13.82);
      player.setFacingAngle(92);

      // Fix camera position after teleporting
      player.setCameraBehind();

      // Send a gametext message to the player
      new GameText("~b~~h~LS Wells Fargo!", 3000, 3).forPlayer(player);
      return next();
    });

    return [onConnect, command];
  },
  unload() {
    // Check for valid object
    if (LSWellsFargoObject1!.isValid()) {
      // Destroy the Wells Fargo Building object
      LSWellsFargoObject1!.destroy();
      LSWellsFargoObject1 = null;

      // Display information in the Server Console
      console.log("  |---------------------------------------------------");
      console.log("  |--  LS Wells Fargo Building object destroyed");
    }

    // Display information in the Server Console
    console.log("  |---------------------------------------------------");
    console.log("  |--  LS Wells Fargo Building Filterscript Unloaded");
    console.log("  |---------------------------------------------------");
  },
};
