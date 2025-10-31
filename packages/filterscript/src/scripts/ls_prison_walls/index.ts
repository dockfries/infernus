// Example FilterScript for the LS Prison Walls and Gate Objects
// By Matite in February 2015
//
// This script creates the let LS Prison Walls object, removes the existing
// GTASA object and creates 2 sets of opening gates.
//
// Warning...
// This script uses a total of:
// * 5 objects = 1 for the replacement walls and 4 for the replacement gates
// * 2 3D Text Labels = 1 on each set of gates
// * Enables the /lsp command to teleport the player to the eastern prison gates

import type { IFilterScript } from "@infernus/core";
import {
  Dynamic3DTextLabel,
  DynamicObject,
  DynamicObjectEvent,
  KeysEnum,
  Player,
  GameText,
  PlayerEvent,
} from "@infernus/core";
import * as constants from "./constants";
import { playSoundForPlayersInRange } from "filterscript/utils/gl_common";

// Used for the eastern and southern prison gates status flags

// Variables

// Stores the created object number of the replacement prison walls so it can
// be destroyed when the filterScript is unloaded
let lsPrisonWallsObject: DynamicObject | null = null;

// Stores the created object numbers of the prison walls gates so they can be
// opened or closed and destroyed when the filterScript is unloaded
let lsPrisonGatesObject: DynamicObject[] = [];

// Stores a reference to the 3D text labels used on each set of gates so they
// can be destroyed when the filterScript is unloaded
let labelGates: Dynamic3DTextLabel[] = [];

// Stores the current status of the eastern prison gates
let easternGatesStatus = constants.GATES_CLOSED;

// Stores the current status of the southern prison gates
let southernGatesStatus = constants.GATES_CLOSED;

function removeBuilding(p: Player) {
  if (p.isNpc()) return;
  // Remove default GTASA LS Prison Walls and LOD map objects for the player
  // (so any player currently ingame does not have to rejoin for them
  //  to be removed when this filterScript is loaded)
  p.removeBuilding(4000, 1787.13, -1565.68, 11.9688, 250.0); // Walls
  p.removeBuilding(4080, 1787.13, -1565.68, 11.9688, 250.0); // LOD
}

export const LSPrisonWalls: IFilterScript = {
  name: "ls_prison_walls",
  load() {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- LS Prison Walls FilterScript");
    console.log("  |--  Script v1.01");
    console.log("  |--  13th February 2015");
    console.log("  |---------------------------------------------------");

    // Create the LS Prison Walls object
    lsPrisonWallsObject = new DynamicObject({
      modelId: 19794,
      x: 1787.13,
      y: -1565.68,
      z: 11.9688,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    lsPrisonWallsObject.create();

    // Display information in the Server Console
    console.log("  |--  LS Prison Walls object created");

    // Create the LS Prison Walls Eastern Gates objects
    lsPrisonGatesObject[0] = new DynamicObject({
      modelId: 19795,
      x: 1824.318481,
      y: -1534.731201,
      z: 14.296878 - 0.01,
      rx: 0,
      ry: 0,
      rz: 343.0,
    });
    lsPrisonGatesObject[0].create();

    lsPrisonGatesObject[1] = new DynamicObject({
      modelId: 19795,
      x: 1822.407592,
      y: -1540.949951,
      z: 14.296878 - 0.01,
      rx: 0,
      ry: 0,
      rz: 163.0,
    });
    lsPrisonGatesObject[1].create();

    // Create the LS Prison Walls Southern Gates objects
    lsPrisonGatesObject[2] = new DynamicObject({
      modelId: 19796,
      x: 1752.00415,
      y: -1591.186523,
      z: 14.267195 - 0.01,
      rx: 0,
      ry: 0,
      rz: 77.0,
    });
    lsPrisonGatesObject[2].create();

    lsPrisonGatesObject[3] = new DynamicObject({
      modelId: 19796,
      x: 1756.914062,
      y: -1592.316284,
      z: 14.267195 - 0.01,
      rx: 0,
      ry: 0,
      rz: 257.0,
    });
    lsPrisonGatesObject[3].create();

    // Display information in the Server Console
    console.log("  |--  LS Prison Walls Gates objects created");

    // Create variable
    let text = "";

    // Create 3D Text Label at the prisons eastern gates
    text = `{CCCCCC}[{${constants.GateNames[0]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to open or close the gates`;
    labelGates[0] = new Dynamic3DTextLabel({
      text,
      color: 0xccccccaa,
      x: 1823.78,
      y: -1537.98,
      z: 13.54,
      drawDistance: 10.5,
      worldId: 0,
      testLOS: true,
    });
    labelGates[0].create();

    // Create 3D Text Label at the prisons eastern gates
    text = `{CCCCCC}[${constants.GateNames[1]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to open or close the gates`;
    labelGates[1] = new Dynamic3DTextLabel({
      text,
      color: 0xccccccaa,
      x: 1754.27,
      y: -1592.18,
      z: 13.54,
      drawDistance: 10.5,
      worldId: 0,
      testLOS: true,
    });
    labelGates[1].create();

    // Display information in the Server Console
    console.log("  |--  LS Prison Wall Gates 3D Text Labels created");
    console.log("  |---------------------------------------------------");

    Player.getInstances().forEach((p) => {
      // Check if the player is connected and not a NPC
      removeBuilding(p);
    });

    const onCommandText = PlayerEvent.onCommandText(
      "lsp",
      ({ player, next }) => {
        // Set the interior
        player.setInterior(0);

        // Set player position and facing angle
        player.setPos(1830.66 + Math.random() * 2, -1538.46, 14.5);
        player.setFacingAngle(85);

        // Fix camera position after teleporting
        player.setCameraBehind();

        // Send a gametext message to the player
        new GameText("~b~~h~LS Prison!", 3000, 3).forPlayer(player);
        return next();
      },
    );

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      removeBuilding(player);
      return next();
    });

    const onMoved = DynamicObjectEvent.onMoved(({ object, next }) => {
      // Check if the object that moved was one of the eastern gates
      if (object === lsPrisonGatesObject[0]) {
        // Check if the eastern gates were closing
        if (easternGatesStatus === constants.GATES_CLOSING) {
          // Set status flag for eastern gates
          easternGatesStatus = constants.GATES_CLOSED;
        } else {
          // Set status flag for eastern gates
          easternGatesStatus = constants.GATES_OPEN;
        }
      }
      // Check if the object that moved was one of the southern gates
      else if (object === lsPrisonGatesObject[2]) {
        // Check if the southern gates were closing
        if (southernGatesStatus === constants.GATES_CLOSING) {
          // Set status flag for southern gates
          southernGatesStatus = constants.GATES_CLOSED;
        } else {
          // Set status flag for southern gates
          southernGatesStatus = constants.GATES_OPEN;
        }
      }

      return next();
    });

    const onKeyStateChange = PlayerEvent.onKeyStateChange(
      ({ player, newKeys, next }) => {
        // Check if the player pressed the conversation yes key (normally the Y key)
        if (newKeys & KeysEnum.YES) {
          // Check if the player is outside the eastern prison gates
          if (player.isInRangeOfPoint(10.0, 1823.78, -1537.98, 13.54)) {
            // Debug
            //console.logf("-->Player ID %d within 10m of the Eastern Prison Gates", playerid);

            // Check if the eastern gates are not currently opening (ie moving)
            if (easternGatesStatus === constants.GATES_OPENING) {
              // Send chat text message and exit here
              player.sendClientMessage(
                constants.COLOR_MESSAGE_YELLOW,
                "* Sorry, you must wait for the eastern gates to fully open first.",
              );
              return 1;
            }
            // Check if the eastern gates are not currently closing (ie moving)
            else if (easternGatesStatus === constants.GATES_CLOSING) {
              // Send chat text message and exit here
              player.sendClientMessage(
                constants.COLOR_MESSAGE_YELLOW,
                "* Sorry, you must wait for the eastern gates to fully close first.",
              );
              return 1;
            }

            // Play gate opening sound
            playSoundForPlayersInRange(1035, 50.0, 1823.78, -1537.98, 13.54);

            // Check if the eastern gates are currently open or closed
            if (easternGatesStatus === constants.GATES_CLOSED) {
              // Send a gametext message to the player
              new GameText(
                "~b~~h~Eastern Prison~n~~b~~h~Gates Opening!",
                3000,
                3,
              ).forPlayer(player);

              // Animate the eastern gates opening (the small Z offset is required)
              lsPrisonGatesObject[0].move(
                1824.318481,
                -1534.731201,
                14.296878 + 0.01,
                0.002,
                0,
                0,
                258,
              );

              // Animate the eastern gates opening (the small Z offset is required)
              lsPrisonGatesObject[1].move(
                1822.407592,
                -1540.949951,
                14.296878 + 0.01,
                0.002,
                0,
                0,
                253,
              );

              // Set status flag for eastern gates
              easternGatesStatus = constants.GATES_OPENING;
            } else {
              // Send a gametext message to the player
              new GameText(
                "~b~~h~Eastern Prison~n~~b~~h~Gates Closing!",
                3000,
                3,
              ).forPlayer(player);

              // Animate the eastern gates closing (the small Z offset is required)
              lsPrisonGatesObject[0].move(
                1824.318481,
                -1534.731201,
                14.296878 - 0.01,
                0.002,
                0,
                0,
                343,
              );

              // Animate the eastern gates closing (the small Z offset is required)
              lsPrisonGatesObject[1].move(
                1822.407592,
                -1540.949951,
                14.296878 - 0.01,
                0.002,
                0,
                0,
                163,
              );

              // Set status flag for eastern gates
              easternGatesStatus = constants.GATES_CLOSING;
            }
          }
          // Check if the player is outside the southern prison gates
          else if (player.isInRangeOfPoint(10.0, 1754.27, -1592.18, 13.54)) {
            // Debug
            //console.logf("-->Player ID %d within 10m of the Southern Prison Gates", playerid);

            // Check if the southern gates are not currently opening (ie moving)
            if (southernGatesStatus === constants.GATES_OPENING) {
              // Send chat text message and exit here
              player.sendClientMessage(
                constants.COLOR_MESSAGE_YELLOW,
                "* Sorry, you must wait for the southern gates to fully open first.",
              );
              return 1;
            }
            // Check if the southern gates are not currently closing (ie moving)
            else if (southernGatesStatus === constants.GATES_CLOSING) {
              // Send chat text message and exit here
              player.sendClientMessage(
                constants.COLOR_MESSAGE_YELLOW,
                "* Sorry, you must wait for the southern gates to fully close first.",
              );
              return 1;
            }

            // Play gate opening sound
            playSoundForPlayersInRange(1035, 50.0, 1754.27, -1592.18, 13.54);

            // Check if the southern gates are currently open or closed
            if (southernGatesStatus === constants.GATES_CLOSED) {
              // Send a gametext message to the player
              new GameText(
                "~b~~h~Southern Prison~n~~b~~h~Gates Opening!",
                3000,
                3,
              ).forPlayer(player);

              // Animate the southern gates opening (the small Z offset is required)
              lsPrisonGatesObject[2].move(
                1752.00415,
                -1591.186523,
                14.267195 + 0.01,
                0.002,
                0,
                0,
                172,
              );

              // Animate the southern gates opening (the small Z offset is required)
              lsPrisonGatesObject[3].move(
                1756.914062,
                -1592.316284,
                14.267195 + 0.01,
                0.002,
                0,
                0,
                187,
              );

              // Set status flag for southern gates
              southernGatesStatus = constants.GATES_OPENING;
            } else {
              // Send a gametext message to the player
              new GameText(
                "~b~~h~Southern Prison~n~~b~~h~Gates Closing!",
                3000,
                3,
              ).forPlayer(player);

              // Animate the southern gates closing (the small Z offset is required)
              lsPrisonGatesObject[2].move(
                1752.00415,
                -1591.186523,
                14.267195 - 0.01,
                0.002,
                0,
                0,
                77,
              );

              // Animate the southern gates closing (the small Z offset is required)
              lsPrisonGatesObject[3].move(
                1756.914062,
                -1592.316284,
                14.267195 - 0.01,
                0.002,
                0,
                0,
                257,
              );

              // Set status flag for southern gates
              southernGatesStatus = constants.GATES_CLOSING;
            }
          }
        }

        return next();
      },
    );

    return [onCommandText, onConnect, onMoved, onKeyStateChange];
  },
  unload() {
    // Check for valid object
    if (lsPrisonWallsObject!.isValid()) {
      // Destroy the LS Prison Walls object
      lsPrisonWallsObject!.destroy();

      // Display information in the Server Console
      console.log("  |---------------------------------------------------");
      console.log("  |--  LS Prison Walls object destroyed");
    }

    lsPrisonWallsObject = null;

    // Check for valid object
    if (lsPrisonGatesObject[0].isValid()) {
      // Destroy the LS Prison Walls Eastern Gates object 1
      lsPrisonGatesObject[0].destroy();

      // Display information in the Server Console
      console.log("  |--  LS Prison Walls Eastern Gates object 1 destroyed");
    }

    // Check for valid object
    if (lsPrisonGatesObject[1].isValid()) {
      // Destroy the LS Prison Walls Eastern Gates object 2
      lsPrisonGatesObject[1].destroy();

      // Display information in the Server Console
      console.log("  |--  LS Prison Walls Eastern Gates object 2 destroyed");
    }

    // Check for valid object
    if (lsPrisonGatesObject[2].isValid()) {
      // Destroy the LS Prison Walls Southern Gates object 1
      lsPrisonGatesObject[2].destroy();

      // Display information in the Server Console
      console.log("  |--  LS Prison Walls Southern Gates object 1 destroyed");
    }

    // Check for valid object
    if (lsPrisonGatesObject[3].isValid()) {
      // Destroy the LS Prison Walls Southern Gates object 2
      lsPrisonGatesObject[3].destroy();

      // Display information in the Server Console
      console.log("  |--  LS Prison Walls Southern Gates object 2 destroyed");
    }

    lsPrisonGatesObject = [];

    // Destroy 3D Text Labels on the eastern and southern gates
    labelGates[0].destroy();
    labelGates[1].destroy();

    labelGates = [];

    // Display information in the Server Console
    console.log("  |--  Deleted the 3D Text Labels on the Prison Gates");

    // Display information in the Server Console
    console.log("  |---------------------------------------------------");
    console.log("  |--  LS Prison Walls FilterScript Unloaded");
    console.log("  |---------------------------------------------------");
  },
};
