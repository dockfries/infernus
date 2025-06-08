// Example FilterScript for the let LS BeachSide Building with Elevator

// Original elevator code by Zamaroht in 2010
//
// Updated by Kye in 2011
// * Added a sound effect for the elevator starting/stopping
//
// Edited by Matite in January 2015
// * Adapted the elevator code so it works in this let building and removed the
//   light pole at the underground car park entrance
//
// Updated to v1.03 by Matite in April 2015
// * Removed the code that removes the existing building map object and the lines
//   that create the let objects as the original building is now replaced with
//   the let one by SAMP instead (same as the LS Office building)
//
// Updated to v1.02 by Matite in February 2015
// * Added code for the let car park object and edited the elevator to
//   include the car park
//
// This script creates the let LS BeachSide building object, removes the
// existing GTASA building object, adds the let car park object and creates
// an elevator that can be used to travel between all levels.
//
// You can un-comment the OnPlayerCommandText callback below to enable a simple
// teleport command (/lsb) that teleports you to the LS BeachSide building.
//
// Warning...
// This script uses a total of:
// * 31 objects = 1 for the elevator, 2 for the elevator doors and 28 for the
//   elevator floor doors
// * 15 3D Text Labels = 14 on the floors and 1 in the elevator

import {
  Dialog,
  DialogStylesEnum,
  Dynamic3DTextLabel,
  DynamicObject,
  DynamicObjectEvent,
  GameText,
  InvalidEnum,
  KeysEnum,
  Player,
  PlayerEvent,
} from "@infernus/core";
import * as constants from "./constants";
import { playSoundForPlayersInRange } from "filterscript/utils/gl_common";
import type { ILSBeachSideFS } from "./interfaces";

// Variables

// Stores the created object numbers of the elevator, the elevator doors and
// the elevator floor doors so they can be destroyed when the filtersScript
// is unloaded
let obj_Elevator: DynamicObject | null = null;
let obj_ElevatorDoors: DynamicObject[] = [];
let obj_FloorDoors: [DynamicObject, DynamicObject][] = [];

// Stores a reference to the 3D text labels used on each floor and inside the
// elevator itself so they can be detroyed when the filtersScript is unloaded
let label_Elevator: Dynamic3DTextLabel | null = null;
let label_Floors: Dynamic3DTextLabel[] = [];

// Stores the current state of the elevator (ie ELEVATOR_STATE_IDLE,
// ELEVATOR_STATE_WAITING or ELEVATOR_STATE_MOVING)
let elevatorState: number = 0;

// Stores the current floor the elevator is on or heading to... if the value is
// ELEVATOR_STATE_IDLE or ELEVATOR_STATE_WAITING this is the current floor. If
// the value is ELEVATOR_STATE_MOVING then it is the floor it's moving to
let elevatorFloor: number = 0;

// Stores the elevator queue for each floor
let elevatorQueue: number[] = [];

// Stores who requested the floor for the elevator queue...
// FloorRequestedBy[floor_id] = player;  (stores who requested which floor)
let floorRequestedBy: (Player | InvalidEnum.PLAYER_ID)[] = [];

// Used for a timer that makes the elevator move faster after players start
// surfing the object
let elevatorBoostTimer: NodeJS.Timeout | null = null;
let elevatorTurnTimer: NodeJS.Timeout | null = null;

function elevator_Initialize() {
  // Create the elevator and elevator door objects
  obj_Elevator = new DynamicObject({
    modelId: 18755,
    x: constants.X_ELEVATOR_POS,
    y: constants.Y_ELEVATOR_POS,
    z: constants.GROUND_Z_COORD,
    rx: 0.0,
    ry: 0.0,
    rz: 80.0,
  });
  obj_Elevator.create();
  obj_ElevatorDoors[0] = new DynamicObject({
    modelId: 18757,
    x: constants.X_ELEVATOR_POS,
    y: constants.Y_ELEVATOR_POS,
    z: constants.GROUND_Z_COORD,
    rx: 0.0,
    ry: 0.0,
    rz: 80.0,
  });
  obj_ElevatorDoors[0].create();
  obj_ElevatorDoors[1] = new DynamicObject({
    modelId: 18756,
    x: constants.X_ELEVATOR_POS,
    y: constants.Y_ELEVATOR_POS,
    z: constants.GROUND_Z_COORD,
    rx: 0.0,
    ry: 0.0,
    rz: 80.0,
  });
  obj_ElevatorDoors[1].create();

  // Create the 3D text label for inside the elevator
  label_Elevator = new Dynamic3DTextLabel({
    text: "{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to use elevator",
    color: 0xccccccaa,
    x: constants.X_ELEVATOR_POS + 1.6,
    y: constants.Y_ELEVATOR_POS - 1.85,
    z: constants.GROUND_Z_COORD - 0.4,
    drawDistance: 4.0,
    worldId: 0,
    testLos: true,
  });
  label_Elevator.create();

  // Create variables

  // Loop
  for (let i = 0; i < constants.FloorNames.length; i++) {
    // Create elevator floor door objects
    obj_FloorDoors[i] = [
      new DynamicObject({
        modelId: 18757,
        x: constants.X_ELEVATOR_POS,
        y: constants.Y_ELEVATOR_POS - 0.245,
        z: getDoorsZCoordForFloor(i) + 0.05,
        rx: 0.0,
        ry: 0.0,
        rz: 80.0,
      }),
      new DynamicObject({
        modelId: 18756,
        x: constants.X_ELEVATOR_POS,
        y: constants.Y_ELEVATOR_POS - 0.245,
        z: getDoorsZCoordForFloor(i) + 0.05,
        rx: 0.0,
        ry: 0.0,
        rz: 80.0,
      }),
    ];
    obj_FloorDoors[i][0].create();
    obj_FloorDoors[i][1].create();

    // Format string for the floor 3D text label
    const string = `{CCCCCC}[${constants.FloorNames[i]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to call`;

    // Get label Z position
    const z = getDoorsZCoordForFloor(i);

    // Create floor label
    label_Floors[i] = new Dynamic3DTextLabel({
      text: string,
      color: 0xccccccaa,
      x: constants.X_ELEVATOR_POS + 2,
      y: constants.Y_ELEVATOR_POS - 3,
      z: z - 0.2,
      drawDistance: 10.5,
      worldId: 0,
      testLos: true,
    });
    label_Floors[i].create();
  }

  // Open the car park floor doors and the elevator doors
  floor_OpenDoors(0);
  elevator_OpenDoors();

  // Exit here
  return true;
}

function elevator_Destroy() {
  // Destroys the elevator.

  obj_Elevator!.destroy();
  obj_ElevatorDoors[0].destroy();
  obj_ElevatorDoors[1].destroy();
  label_Elevator!.destroy();

  obj_Elevator = null;
  obj_ElevatorDoors = [];
  label_Elevator = null;

  for (let i = 0; i < obj_FloorDoors.length; i++) {
    obj_FloorDoors[i][0].destroy();
    obj_FloorDoors[i][1].destroy();
    label_Floors[i]!.destroy();
  }

  obj_FloorDoors = [];
  label_Floors = [];
  elevatorQueue = [];
  floorRequestedBy = [];

  return true;
}

function elevator_OpenDoors() {
  // Opens the elevator's doors.

  const { z } = obj_ElevatorDoors[0].getPos();
  obj_ElevatorDoors[0].move(
    constants.X_DOOR_L_OPENED,
    constants.Y_DOOR_L_OPENED,
    z,
    constants.DOORS_SPEED,
  );
  obj_ElevatorDoors[1].move(
    constants.X_DOOR_R_OPENED,
    constants.Y_DOOR_R_OPENED,
    z,
    constants.DOORS_SPEED,
  );

  return true;
}

function elevator_CloseDoors() {
  // Closes the elevator's doors.

  if (elevatorState === constants.ELEVATOR_STATE_MOVING) return false;

  const { z } = obj_ElevatorDoors[0].getPos();
  obj_ElevatorDoors[0].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    z,
    constants.DOORS_SPEED,
  );
  obj_ElevatorDoors[1].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    z,
    constants.DOORS_SPEED,
  );

  return true;
}

function floor_OpenDoors(floorId: number) {
  // Opens the doors at the specified floor.

  obj_FloorDoors[floorId][0].move(
    constants.X_FDOOR_L_OPENED,
    constants.Y_FDOOR_L_OPENED,
    getDoorsZCoordForFloor(floorId) + 0.05,
    constants.DOORS_SPEED,
  );
  obj_FloorDoors[floorId][1].move(
    constants.X_FDOOR_R_OPENED,
    constants.Y_FDOOR_R_OPENED,
    getDoorsZCoordForFloor(floorId) + 0.05,
    constants.DOORS_SPEED,
  );

  playSoundForPlayersInRange(
    6401,
    50.0,
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    getDoorsZCoordForFloor(floorId) + 5.0,
  );

  return true;
}

function floor_CloseDoors(floorId: number) {
  // Closes the doors at the specified floor.

  obj_FloorDoors[floorId][0].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS - 0.245,
    getDoorsZCoordForFloor(floorId) + 0.05,
    constants.DOORS_SPEED,
  );
  obj_FloorDoors[floorId][1].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS - 0.245,
    getDoorsZCoordForFloor(floorId) + 0.05,
    constants.DOORS_SPEED,
  );

  playSoundForPlayersInRange(
    6401,
    50.0,
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    getDoorsZCoordForFloor(floorId) + 5.0,
  );

  return true;
}

function elevator_MoveToFloor(floorId: number) {
  // Moves the elevator to specified floor (doors are meant to be already closed).

  elevatorState = constants.ELEVATOR_STATE_MOVING;
  elevatorFloor = floorId;

  // Move the elevator slowly, to give time to clients to sync the object surfing. Then, boost it up:
  obj_Elevator!.move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    getElevatorZCoordForFloor(floorId),
    0.25,
  );
  obj_ElevatorDoors[0].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    getDoorsZCoordForFloor(floorId),
    0.25,
  );
  obj_ElevatorDoors[1].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    getDoorsZCoordForFloor(floorId),
    0.25,
  );
  label_Elevator!.destroy();

  if (elevatorTurnTimer) {
    clearTimeout(elevatorTurnTimer);
  }

  elevatorBoostTimer = setTimeout(() => {
    elevator_Boost(floorId);
  }, 2000);

  return true;
}

function elevator_Boost(floorId: number) {
  // Increases the elevator's speed until it reaches 'floorId'
  obj_Elevator!.stop();
  obj_ElevatorDoors[0].stop();
  obj_ElevatorDoors[1].stop();

  obj_Elevator!.move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    getElevatorZCoordForFloor(floorId),
    constants.ELEVATOR_SPEED,
  );
  obj_ElevatorDoors[0].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    getDoorsZCoordForFloor(floorId),
    constants.ELEVATOR_SPEED,
  );
  obj_ElevatorDoors[1].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS,
    getDoorsZCoordForFloor(floorId),
    constants.ELEVATOR_SPEED,
  );

  return true;
}

function elevator_TurnToIdle() {
  elevatorState = constants.ELEVATOR_STATE_IDLE;
  readNextFloorInQueue();

  return true;
}

function removeFirstQueueFloor() {
  // Removes the data in ElevatorQueue[0], and reorders the queue accordingly.

  for (let i = 0; i < elevatorQueue.length - 1; i++)
    elevatorQueue[i] = elevatorQueue[i + 1];

  elevatorQueue[elevatorQueue.length - 1] = constants.INVALID_FLOOR;

  return true;
}

function addFloorToQueue(floorId: number) {
  // Adds 'floorId' at the end of the queue.

  // Scan for the first empty space:
  let slot = -1;
  for (let i = 0; i < elevatorQueue.length; i++) {
    if (elevatorQueue[i] === constants.INVALID_FLOOR) {
      slot = i;
      break;
    }
  }

  if (slot !== -1) {
    elevatorQueue[slot] = floorId;

    // If needed, move the elevator.
    if (elevatorState === constants.ELEVATOR_STATE_IDLE) readNextFloorInQueue();

    return true;
  }

  return false;
}

function resetElevatorQueue() {
  // Resets the queue.

  for (let i = 0; i < constants.FloorNames.length; i++) {
    elevatorQueue[i] = constants.INVALID_FLOOR;
    floorRequestedBy[i] = InvalidEnum.PLAYER_ID;
  }

  return true;
}

function isFloorInQueue(floorId: number) {
  // Checks if the specified floor is currently part of the queue.
  return elevatorQueue.includes(floorId);
}

function readNextFloorInQueue() {
  // Reads the next floor in the queue, closes doors, and goes to it.

  if (
    elevatorState !== constants.ELEVATOR_STATE_IDLE ||
    elevatorQueue[0] === constants.INVALID_FLOOR
  )
    return false;

  elevator_CloseDoors();
  floor_CloseDoors(elevatorFloor);

  return true;
}

function didPlayerRequestElevator(player: Player) {
  return floorRequestedBy.includes(player);
}

async function showElevatorDialog(player: Player) {
  let info = "";
  for (let i = 0; i < elevatorQueue.length; i++) {
    if (floorRequestedBy[i] !== InvalidEnum.PLAYER_ID) {
      info += "{FF0000}";
    }

    info += constants.FloorNames[i] + "\n";
  }

  const { response, listItem } = await new Dialog({
    style: DialogStylesEnum.LIST,
    caption: "LS BeachSide Elevator...",
    info,
    button1: "Accept",
    button2: "Cancel",
  }).show(player);

  if (!response) return false;

  if (
    floorRequestedBy[listItem] !== InvalidEnum.PLAYER_ID ||
    isFloorInQueue(listItem)
  )
    new GameText("~r~The floor is already in the queue", 3500, 4).forPlayer(
      player,
    );
  else if (didPlayerRequestElevator(player))
    new GameText("~r~You already requested the elevator", 3500, 4).forPlayer(
      player,
    );
  else callElevator(player, listItem);

  return true;
}

function callElevator(player: Player, floorId: number) {
  // Calls the elevator (also used with the elevator dialog).

  if (
    floorRequestedBy[floorId] !== InvalidEnum.PLAYER_ID ||
    isFloorInQueue(floorId)
  )
    return false;

  floorRequestedBy[floorId] = player;
  addFloorToQueue(floorId);

  return true;
}

function getElevatorZCoordForFloor(floorId: number) {
  // Return Z height value
  return constants.GROUND_Z_COORD + constants.FloorZOffsets[floorId];
}

function getDoorsZCoordForFloor(floorId: number) {
  // Return Z height value
  return constants.GROUND_Z_COORD + constants.FloorZOffsets[floorId];
}

function removeBuilding(p: Player) {
  // Check if the player is connected and not a NPC
  if (p.isNpc()) return;
  // Remove the lamp post at the underground car park entrance
  p.removeBuilding(1226, 265.481, -1581.1, 32.9311, 5.0);

  // Remove the night lights object (must be removed to also remove any
  // occulsion zones inside the building)
  p.removeBuilding(6518, 280.297, -1606.2, 72.3984, 250.0);
}

export const LSBeachSide: ILSBeachSideFS = {
  name: "ls_beach_side",
  load(options) {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------");
    console.log("  |--- LS BeachSide FilterScript");
    console.log("  |--  Script v1.03");
    console.log("  |--  19th April 2015");
    console.log("  |---------");

    // Reset the elevator queue
    resetElevatorQueue();

    // Create the elevator object, the elevator doors and the floor doors
    elevator_Initialize();

    // Display information in the Server Console
    console.log("  |--  LS BeachSide Building Elevator created");
    console.log("  |---------");

    Player.getInstances().forEach((p) => {
      removeBuilding(p);
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      removeBuilding(player);
      return next();
    });

    const onMoved = DynamicObjectEvent.onMoved(({ object, next }) => {
      // Loop
      for (let i = 0; i < obj_FloorDoors.length; i++) {
        // Check if the object that moved was one of the elevator floor doors
        if (object === obj_FloorDoors[i][0]) {
          const { y } = obj_FloorDoors[i][0].getPos();

          // Some floor doors have shut, move the elevator to next floor in queue:
          if (y < constants.Y_DOOR_L_OPENED - 0.5) {
            elevator_MoveToFloor(elevatorQueue[0]);
            removeFirstQueueFloor();
          }
        }
      }

      if (object === obj_Elevator) {
        // The elevator reached the specified floor.
        if (elevatorBoostTimer) {
          clearTimeout(elevatorBoostTimer); // Kills the timer, in case the elevator reached the floor before boost.
          elevatorBoostTimer = null;
        }

        floorRequestedBy[elevatorFloor] = InvalidEnum.PLAYER_ID;

        elevator_OpenDoors();
        floor_OpenDoors(elevatorFloor);

        const { z } = obj_Elevator.getPos();
        label_Elevator = new Dynamic3DTextLabel({
          text: "{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to use elevator",
          color: 0xccccccaa,
          x: constants.X_ELEVATOR_POS + 1.6,
          y: constants.Y_ELEVATOR_POS - 1.85,
          z: z - 0.4,
          drawDistance: 4.0,
          worldId: 0,
          testLos: true,
        });
        label_Elevator.create();

        if (elevatorTurnTimer) {
          clearTimeout(elevatorTurnTimer);
        }

        elevatorState = constants.ELEVATOR_STATE_WAITING;
        elevatorTurnTimer = setTimeout(
          elevator_TurnToIdle,
          constants.ELEVATOR_WAIT_TIME,
        );
      }

      return next();
    });

    const onKeyStateChange = PlayerEvent.onKeyStateChange(
      ({ player, newKeys, next }) => {
        // Check if the player is not in a vehicle and pressed the conversation yes key (Y by default)
        if (!player.isInAnyVehicle() && newKeys & KeysEnum.YES) {
          // Create variables and get the players current position

          const pos = player.getPos();
          // For debug
          // console.log(`X = ${pos.x} | Y = ${pos.y} | Z = ${pos.z}`);

          // Check if the player is using the button inside the elevator
          if (
            pos.y > constants.Y_ELEVATOR_POS - 1.8 &&
            pos.y < constants.Y_ELEVATOR_POS + 1.8 &&
            pos.x < constants.X_ELEVATOR_POS + 1.8 &&
            pos.x > constants.X_ELEVATOR_POS - 1.8
          ) {
            // The player is using the button inside the elevator

            // Show the elevator dialog to the player
            showElevatorDialog(player);
          } else {
            // Check if the player is using the button on one of the floors
            if (
              pos.y < constants.Y_ELEVATOR_POS - 1.81 &&
              pos.y > constants.Y_ELEVATOR_POS - 3.8 &&
              pos.x > constants.X_ELEVATOR_POS + 1.21 &&
              pos.x < constants.X_ELEVATOR_POS + 3.8
            ) {
              // The player is most likely using an elevator floor button... check which floor

              // Create variable with the number of floors to check (total floors minus 1)
              let i = 13;

              // Loop
              while (pos.z < getDoorsZCoordForFloor(i) + 3.5 && i > 0) i--;

              if (i === 0 && pos.z < getDoorsZCoordForFloor(0) + 2.0) i = -1;

              if (i <= 12) {
                // Check if the elevator is not moving (idle or waiting)
                if (elevatorState !== constants.ELEVATOR_STATE_MOVING) {
                  // Check if the elevator is already on the floor it was called from
                  if (elevatorFloor === i + 1) {
                    // Display gametext message to the player
                    new GameText(
                      "~n~~n~~n~~n~~n~~n~~n~~y~~h~LS BeachSide Elevator Is~n~~y~~h~Already On This Floor...~n~~w~Walk Inside It~n~~w~And Press '~k~~CONVERSATION_YES~'",
                      3500,
                      3,
                    ).forPlayer(player);

                    // Display chat text message to the player
                    player.sendClientMessage(
                      constants.COLOR_MESSAGE_YELLOW,
                      "* The LS BeachSide elevator is already on this floor... walk inside it and press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}'",
                    );

                    return next();
                  }
                }

                // Call function to call the elevator to the floor
                callElevator(player, i + 1);

                // Display gametext message to the player
                new GameText(
                  "~n~~n~~n~~n~~n~~n~~n~~n~~g~~h~LS BeachSide Elevator~n~~g~~h~Has Been Called...~n~~w~Please Wait",
                  3000,
                  3,
                ).forPlayer(player);

                // Create variable for formatted message
                let strTempString = "";

                // Check if the elevator is moving
                if (elevatorState === constants.ELEVATOR_STATE_MOVING) {
                  // Format chat text message
                  strTempString =
                    "* The LS BeachSide elevator has been called... it is currently moving towards the " +
                    `${constants.FloorNames[elevatorFloor]}.`;
                } else {
                  // Check if the floor is the car park
                  if (elevatorFloor === 0) {
                    // Format chat text message
                    strTempString =
                      "* The LS BeachSide elevator has been called... it is currently at the " +
                      `${constants.FloorNames[elevatorFloor]}.`;
                  } else {
                    // Format chat text message
                    strTempString =
                      "* The LS BeachSide elevator has been called... it is currently on the " +
                      `${constants.FloorNames[elevatorFloor]}.`;
                  }
                }

                // Display formatted chat text message to the player
                player.sendClientMessage(
                  constants.COLOR_MESSAGE_YELLOW,
                  strTempString,
                );

                return next();
              }
            }
          }
        }

        return next();
      },
    );

    const offs: (() => any)[] = [onConnect, onMoved, onKeyStateChange];

    // Un-comment the OnPlayerCommandText callback below (remove the "/*" and the "*/")
    // to enable a simple teleport command (/lsb) which teleports the player to
    // outside the LS BeachSide building.

    if (options && options.enableCommand) {
      const onCommandText = PlayerEvent.onCommandText(
        "lsb",
        ({ player, next }) => {
          // Check command text
          // Set the interior
          player.setInterior(0);

          // Set player position and facing angle
          player.setPos(
            289.81 + Math.random() * 2,
            -1630.65 + Math.random() * 2,
            34.32,
          );
          player.setFacingAngle(10);

          // Fix camera position after teleporting
          player.setCameraBehind();

          // Send a gametext message to the player
          new GameText("~b~~h~LS BeachSide!", 3000, 3).forPlayer(player);
          return next();
        },
      );
      offs.push(onCommandText);
    }

    return offs;
  },
  unload() {
    if (elevatorBoostTimer) {
      clearTimeout(elevatorBoostTimer);
      elevatorBoostTimer = null;
    }

    if (elevatorTurnTimer) {
      clearTimeout(elevatorTurnTimer);
      elevatorTurnTimer = null;
    }

    // Destroy the elevator, the elevator doors and the elevator floor doors
    elevator_Destroy();

    // Display information in the Server Console
    console.log("  |--  LS BeachSide Building Elevator destroyed");
    console.log("  |---------");
  },
};
