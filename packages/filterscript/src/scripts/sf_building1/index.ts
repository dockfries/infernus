// -----------------------------------------------------------------------------
// Example Filterscript for the let SF Building 1
// ----------------------------------------------
// By Matite in February 2015
//
//
// This script creates the let SF Building 1 object and removes the existing
// GTASA building object.
//
// Warning...
// This script uses a total of:
// * 3 objects = 1 for the replacement land object, 1 for the outside object
//   and 1 for the inside object
// * Enables the /sfb command to teleport the player to the SF Building 1
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

import type { IFilterScript } from "@infernus/core";
import { DynamicObject, GameText, Player, PlayerEvent } from "@infernus/core";

// Stores the created object numbers of the replacement building objects so
// they can be destroyed when the filterscript is unloaded
let sfBuilding1Object1: DynamicObject | null = null; // Land object
let sfBuilding1Object2: DynamicObject | null = null; // Outside object
let sfBuilding1Object3: DynamicObject | null = null; // Inside object

function removeBuilding(player: Player) {
  // Remove default GTASA SF Building and LOD map objects for the player
  // (so any player currently ingame does not have to rejoin for them
  //  to be removed when this filterscript is loaded)
  player.removeBuilding(9510, -2719.02, 861.211, 72.1562, 250.0); // Building
  player.removeBuilding(9671, -2719.02, 861.211, 72.1562, 250.0); // LOD
  player.removeBuilding(715, -2693.24, 852.6, 71.74, 8.0); // Tree (casts a shadow inside)
}

export const SFBuilding1: IFilterScript = {
  name: "sf_building1",
  load() {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- SF Building 1 Filterscript");
    console.log("  |--  Script v1.01");
    console.log("  |--  10th February 2015");
    console.log("  |---------------------------------------------------");

    // Create the SF Building 1 Land object
    sfBuilding1Object1 = new DynamicObject({
      modelId: 19600,
      x: -2719.02,
      y: 861.211,
      z: 72.1562,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    sfBuilding1Object1.create();

    // Display information in the Server Console
    console.log("  |--  SF Building 1 Land object created");

    // Create the SF Building 1 Outside object
    sfBuilding1Object2 = new DynamicObject({
      modelId: 19598,
      x: -2719.02,
      y: 861.211,
      z: 72.1562,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    sfBuilding1Object2.create();

    // Display information in the Server Console
    console.log("  |--  SF Building 1 Outside object created");

    // Create the SF Building 1 Inside object
    sfBuilding1Object3 = new DynamicObject({
      modelId: 19599,
      x: -2719.02,
      y: 861.211,
      z: 72.1562,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    sfBuilding1Object3.create();

    // Display information in the Server Console
    console.log("  |--  SF Building 1 Inside object created");
    console.log("  |---------------------------------------------------");

    // Loop
    Player.getInstances().forEach((p) => {
      if (!p.isNpc()) {
        removeBuilding(p);
      }
    });

    const command = PlayerEvent.onCommandText("sfb", ({ player, next }) => {
      // Set the interior
      player.setInterior(0);
      // Set player position and facing angle
      player.setPos(-2706.56, 870.91 + Math.random() * 2, 71.86);
      player.setFacingAngle(180);

      // Fix camera position after teleporting
      player.setCameraBehind();

      // Send a gametext message to the player
      new GameText("~b~~h~SF Building!", 3000, 3).forPlayer(player);

      return next();
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      removeBuilding(player);
      return next();
    });

    return [command, onConnect];
  },
  unload() {
    // Check for valid object
    if (sfBuilding1Object1!.isValid()) {
      // Destroy the SF Building 1 Land object
      sfBuilding1Object1!.destroy();
      sfBuilding1Object1 = null;

      // Display information in the Server Console
      console.log("  |---------------------------------------------------");
      console.log("  |--  SF Building 1 Land object destroyed");
    }

    // Check for valid object
    if (sfBuilding1Object2!.isValid()) {
      // Destroy the SF Building 1 Outside object
      sfBuilding1Object2!.destroy();
      sfBuilding1Object2 = null;

      // Display information in the Server Console
      console.log("  |--  SF Building 1 Outside object destroyed");
    }

    // Check for valid object
    if (sfBuilding1Object3!.isValid()) {
      // Destroy the SF Building 1 Inside object
      sfBuilding1Object3!.destroy();
      sfBuilding1Object3 = null;

      // Display information in the Server Console
      console.log("  |--  SF Building 1 Inside object destroyed");
    }

    // Display information in the Server Console
    console.log("  |---------------------------------------------------");
    console.log("  |--  SF Building 1 Filterscript Unloaded");
    console.log("  |---------------------------------------------------");
  },
};
