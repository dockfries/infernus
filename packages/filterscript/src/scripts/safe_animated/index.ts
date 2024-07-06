// Example FilterScript for the letSafe with Door
// -----------------------------------------------
// By Matite in January 2015
//
// v1.0.1
// * Inital release in RC1
//
// v1.0.2
// * Changed the Z offset in the MoveObject parameters to fix an issue with
//   movement caused by rounding on some PCs
//
// This script removes the existing safe in Madd Dogg's Mansion then creates the
// let safe and door object in its place. You can then use commands to open and
// close the safe door.
//
// You can use the following commands:
// * /safe = Teleports the player to the safe in Madd Dogg's Mansion
// * /openopen = Makes the safe door open
// * /closesafe = Makes the safe door close
//
// Warning...
// This script uses a total of 2 objects

import type { IFilterScript } from "@infernus/core";
import { DynamicObject, GameText, Player, PlayerEvent } from "@infernus/core";

// Safe door status
const SAFE_DOOR_OPEN = 1;
const SAFE_DOOR_CLOSED = 0;

// Stores the created object number of the safe
let safeObject: DynamicObject | null = null;

// Stores the created object number of the safe door
let safeDoorObject: DynamicObject | null = null;

// Tracks the status of the safe door (ie whether it is open or closed)
let safeDoorStatus = SAFE_DOOR_CLOSED;

// Remove default GTASA safe object in Madd Dogg's Mansion office
function removeBuilding(player: Player) {
  player.removeBuilding(2332, 1230.646118, -806.418823, 1083.5, 10.0);
}

export const SafeAnimated: IFilterScript = {
  name: "safe_animated",
  load() {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- Safe and Door FilterScript by Matite");
    console.log("  |--  Script v1.02");
    console.log("  |--  13th February 2015");
    console.log("  |---------------------------------------------------");

    // Create the safe object
    safeObject = new DynamicObject({
      modelId: 19618,
      x: 1230.646118,
      y: -806.418823,
      z: 1083.5,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    safeObject.create();

    // Display information in the Server Console
    console.log("  |--  Safe object created");

    // Create the safe door object
    safeDoorObject = new DynamicObject({
      modelId: 19619,
      x: 1230.225708,
      y: -806.648803,
      z: 1083.5 - 0.01,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    safeDoorObject.create();

    // Display information in the Server Console
    console.log("  |--  Safe door object created");
    console.log("  |---------------------------------------------------");

    // Loop
    Player.getInstances().forEach((p) => {
      // Check if the player is connected and is not a NPC
      if (!p.isNpc()) {
        // (we do this now incase the filterscipt was loaded after the player joined)
        removeBuilding(p);
      }
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      removeBuilding(player);
      return next();
    });

    const command1 = PlayerEvent.onCommandText("safe", ({ player, next }) => {
      // Set the interior
      player.setInterior(5);

      // Set player position and facing angle
      player.setPos(1230.61, -808.15, 1084.1);
      player.setFacingAngle(0);

      // Fix camera position after teleporting
      player.setCameraBehind();

      // Send a gametext message to the player
      new GameText("~b~~h~Safe And Door!", 3000, 3).forPlayer(player);

      return next();
    });

    const command2 = PlayerEvent.onCommandText(
      "opensafe",
      ({ player, next }) => {
        // Check if the safe door is already open
        if (safeDoorStatus === SAFE_DOOR_OPEN) {
          // Send a gametext message to the player
          new GameText(
            "~r~~h~Safe Door~n~~r~~h~Already Open!",
            3000,
            3,
          ).forPlayer(player);
          return next();
        }

        // Animate the safe door opening (the small Z offset is required)
        safeDoorObject!.move(
          1230.225708,
          -806.648803,
          1083.5 + 0.01,
          0.005,
          0,
          0,
          280,
        );

        // Set the safe door status
        safeDoorStatus = SAFE_DOOR_OPEN;

        // Send a gametext message to the player
        new GameText("~b~~h~Safe Door Opened!", 3000, 3).forPlayer(player);

        return next();
      },
    );

    const command3 = PlayerEvent.onCommandText(
      "closesafe",
      ({ player, next }) => {
        // Check if the safe door is already open
        if (safeDoorStatus === SAFE_DOOR_CLOSED) {
          // Send a gametext message to the player
          new GameText(
            "~r~~h~Safe Door~n~~r~~h~Already Closed!",
            3000,
            3,
          ).forPlayer(player);
          return next();
        }

        // Animate the safe door closing (the small Z offset is required)
        safeDoorObject!.move(
          1230.225708,
          -806.648803,
          1083.5 - 0.01,
          0.005,
          0,
          0,
          0,
        );

        // Set the safe door status
        safeDoorStatus = SAFE_DOOR_CLOSED;

        // Send a gametext message to the player
        new GameText("~b~~h~Safe Door Closed!", 3000, 3).forPlayer(player);
      },
    );

    return [onConnect, command1, command2, command3];
  },
  unload() {
    // Check for valid object
    if (safeObject!.isValid()) {
      // Destroy the safe object
      safeObject!.destroy();
      safeObject = null;

      // Display information in the Server Console
      console.log("  |---------------------------------------------------");
      console.log("  |--  Safe object destroyed");
    }

    // Check for valid object
    if (safeDoorObject!.isValid()) {
      // Destroy the safe door object
      safeDoorObject!.destroy();
      safeDoorObject = null;

      // Display information in the Server Console
      console.log("  |--  Safe door object destroyed");
    }

    // Display information in the Server Console
    console.log("  |---------------------------------------------------");
    console.log("  |--  Safe and Door FilterScript Unloaded");
    console.log("  |---------------------------------------------------");
  },
};
