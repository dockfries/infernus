// Example FilterScript for the let SF ZomboTech Building and Lab with Elevator
// Original elevator code by Zamaroht in 2010
//
// Updated by Kye in 2011
// * Added a sound effect for the elevator starting/stopping
//
// Edited by Matite in January 2015
// * Added code to remove the existing building, add the let buildings and
//   adapted the elevator code so it works in this let building
//
//
// This script creates the let SF ZomboTech building and the lab objects, removes
// the existing GTASA building object and creates an elevator that can be used to
// travel between the building foyer and the lab.
//
// You can un-comment the OnPlayerCommandText callback below to enable a simple
// teleport command (/zl) that teleports you to the ZomboTech Lab elevator.
//
// Warning...
// This script uses a total of:
// * 9 objects = 1 for the elevator, 2 for the elevator doors, 4 for the elevator
//   floor doors and 2 for the buildings (replacement ZomboTech building and lab)
// * 3 3D Text Labels = 2 on the floors and 1 in the elevator

// Stores the created object numbers of the replacement building and the lab so
// they can be destroyed when the filterScript is unloaded

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
import type { ISFZomboTechFS } from "./interfaces";

let sfZomboTechBuildingObject: DynamicObject | null = null;
let sfZomboTechLabObject: DynamicObject | null = null;

// Stores the created object numbers of the elevator, the elevator doors and
// the elevator floor doors so they can be destroyed when the filterScript
// is unloaded
let obj_Elevator: DynamicObject | null = null;
let obj_ElevatorDoors: DynamicObject[] = [];
let obj_FloorDoors: [DynamicObject, DynamicObject][] = [];

// Stores a reference to the 3D text labels used on each floor and inside the
// elevator itself so they can be detroyed when the filterScript is unloaded
let label_Elevator: Dynamic3DTextLabel | null = null;
let label_Floors: Dynamic3DTextLabel[] = [];

// Stores the current state of the elevator (ie ELEVATOR_STATE_IDLE,
// ELEVATOR_STATE_WAITING or ELEVATOR_STATE_MOVING)
let elevatorState: number;

// Stores the current floor the elevator is on or heading to... if the value is
// ELEVATOR_STATE_IDLE or ELEVATOR_STATE_WAITING this is the current floor. If
// the value is ELEVATOR_STATE_MOVING then it is the floor it's moving to
let elevatorFloor: number;

// Stores the elevator queue for each floor
let elevatorQueue: number[] = [];

// Stores who requested the floor for the elevator queue...
// FloorRequestedBy[floor_id] = playerid;  (stores who requested which floor)
let floorRequestedBy: (Player | InvalidEnum.PLAYER_ID)[] = [];

// Used for a timer that makes the elevator move faster after players start
// surfing the object
let elevatorBoostTimer: NodeJS.Timeout | null = null;
let elevatorTurnTimer: NodeJS.Timeout | null = null;

// Un-comment the OnPlayerCommandText callback below (remove the "/*" and the "*/")
// to enable a simple teleport command (/zl) which teleports the player to
// the Zombotech Lab elevator.

function removeBuilding(p: Player) {
  if (!p.isNpc()) return;
  // Remove default GTASA SF ZomboTech map object and LOD for the player
  // (so any player currently ingame does not have to rejoin for them
  //  to be removed when this filterScript is loaded)
  p.removeBuilding(10027, -1951.6875, 660.023986, 89.507797, 250.0); // Building
  p.removeBuilding(9939, -1951.6875, 660.023986, 89.507797, 250.0); // LOD
}

function elevator_Initialize() {
  // Initializes the elevator.

  obj_Elevator = new DynamicObject({
    modelId: 18755,
    x: constants.X_ELEVATOR_POS,
    y: constants.Y_ELEVATOR_POS,
    z: constants.GROUND_Z_COORD,
    rx: 0.0,
    ry: 0.0,
    rz: 270.0,
  });
  obj_Elevator.create();
  obj_ElevatorDoors[0] = new DynamicObject({
    modelId: 18757,
    x: constants.X_ELEVATOR_POS,
    y: constants.Y_ELEVATOR_POS,
    z: constants.GROUND_Z_COORD,
    rx: 0.0,
    ry: 0.0,
    rz: 270.0,
  });
  obj_ElevatorDoors[0].create();
  obj_ElevatorDoors[1] = new DynamicObject({
    modelId: 18756,
    x: constants.X_ELEVATOR_POS,
    y: constants.Y_ELEVATOR_POS,
    z: constants.GROUND_Z_COORD,
    rx: 0.0,
    ry: 0.0,
    rz: 270.0,
  });
  obj_ElevatorDoors[1].create();

  label_Elevator = new Dynamic3DTextLabel({
    text: "{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to use elevator",
    color: 0xccccccaa,
    x: constants.X_ELEVATOR_POS - 1.8,
    y: constants.Y_ELEVATOR_POS + 1.6,
    z: constants.GROUND_Z_COORD - 0.6,
    drawDistance: 4.0,
    worldId: 0,
    testLos: true,
  });
  label_Elevator.create();

  for (let i = 0; i < constants.FloorNames.length; i++) {
    obj_FloorDoors[i] = [
      new DynamicObject({
        modelId: 18757,
        x: constants.X_ELEVATOR_POS,
        y: constants.Y_ELEVATOR_POS + 0.245,
        z: getDoorsZCoordForFloor(i),
        rx: 0.0,
        ry: 0.0,
        rz: 270.0,
      }),
      new DynamicObject({
        modelId: 18756,
        x: constants.X_ELEVATOR_POS,
        y: constants.Y_ELEVATOR_POS + 0.245,
        z: getDoorsZCoordForFloor(i),
        rx: 0.0,
        ry: 0.0,
        rz: 270.0,
      }),
    ];
    obj_FloorDoors[i][0].create();
    obj_FloorDoors[i][1].create();

    const string = `{CCCCCC}[${constants.FloorNames[i]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to call`;

    const z = i === 0 ? 47.460277 : 25.820274;

    label_Floors[i] = new Dynamic3DTextLabel({
      text: string,
      color: 0xccccccaa,
      x: constants.X_ELEVATOR_POS - 2.5,
      y: constants.Y_ELEVATOR_POS + 2.5,
      z: z - 0.2,
      drawDistance: 10.5,
      worldId: 0,
      testLos: true,
    });
    label_Floors[i].create();
  }

  // Open ground floor doors:
  floor_OpenDoors(0);
  elevator_OpenDoors();

  return true;
}

function elevator_Destroy() {
  // Destroys the elevator and the elevator doors
  obj_Elevator!.destroy();
  obj_ElevatorDoors[0].destroy();
  obj_ElevatorDoors[1].destroy();
  label_Elevator!.destroy();

  obj_Elevator = null;
  obj_ElevatorDoors = [];

  // Destroy the 3D text label inside the elevator
  label_Elevator = null;

  // Loop
  for (let i = 0; i < obj_FloorDoors.length; i++) {
    // Destroy the elevator floor doors and the floor 3D text labels
    obj_FloorDoors[i][0].destroy();
    obj_FloorDoors[i][1].destroy();
    label_Floors[i].destroy();
  }

  obj_FloorDoors = [];
  label_Floors = [];
  elevatorQueue = [];
  floorRequestedBy = [];

  return true;
}

function elevator_OpenDoors() {
  // Opens the elevator's doors.

  const { y, z } = obj_ElevatorDoors[0].getPos()!;
  obj_ElevatorDoors[0].move(
    constants.X_DOOR_L_OPENED,
    y,
    z,
    constants.DOORS_SPEED,
  );
  obj_ElevatorDoors[1].move(
    constants.X_DOOR_R_OPENED,
    y,
    z,
    constants.DOORS_SPEED,
  );

  return true;
}

function elevator_CloseDoors() {
  // Closes the elevator's doors.

  if (elevatorState === constants.ELEVATOR_STATE_MOVING) return false;

  const { y, z } = obj_ElevatorDoors[0].getPos()!;
  obj_ElevatorDoors[0].move(
    constants.X_DOOR_CLOSED,
    y,
    z,
    constants.DOORS_SPEED,
  );
  obj_ElevatorDoors[1].move(
    constants.X_DOOR_CLOSED,
    y,
    z,
    constants.DOORS_SPEED,
  );

  return true;
}

function floor_OpenDoors(floorId: number) {
  // Opens the doors at the specified floor.

  obj_FloorDoors[floorId][0].move(
    constants.X_DOOR_L_OPENED,
    constants.Y_ELEVATOR_POS + 0.245,
    getDoorsZCoordForFloor(floorId),
    constants.DOORS_SPEED,
  );
  obj_FloorDoors[floorId][1].move(
    constants.X_DOOR_R_OPENED,
    constants.Y_ELEVATOR_POS + 0.245,
    getDoorsZCoordForFloor(floorId),
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
    constants.Y_ELEVATOR_POS + 0.245,
    getDoorsZCoordForFloor(floorId),
    constants.DOORS_SPEED,
  );
  obj_FloorDoors[floorId][1].move(
    constants.X_ELEVATOR_POS,
    constants.Y_ELEVATOR_POS + 0.245,
    getDoorsZCoordForFloor(floorId),
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
  {
    const { response, listItem } = await new Dialog({
      style: DialogStylesEnum.LIST,
      caption: "ZomboTech Elevator...",
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
  return constants.GROUND_Z_COORD + constants.FloorZOffsets[floorId];
}

function getDoorsZCoordForFloor(floorId: number) {
  return constants.GROUND_Z_COORD + constants.FloorZOffsets[floorId];
}

export const SFZomboTech: ISFZomboTechFS = {
  name: "sf_zombo_tech",
  load(options) {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- SF ZomboTech FilterScript");
    console.log("  |--  Script v1.01");
    console.log("  |--  12th January 2015");
    console.log("  |---------------------------------------------------");

    // Create the SF ZomboTech Building object
    sfZomboTechBuildingObject = new DynamicObject({
      modelId: 19593,
      x: -1951.6875,
      y: 660.023986,
      z: 89.507797,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    sfZomboTechBuildingObject.create();

    // Create the SF ZomboTech Lab object
    sfZomboTechLabObject = new DynamicObject({
      modelId: 19594,
      x: -1951.6875,
      y: 660.023986,
      z: 29.507797,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    sfZomboTechLabObject.create();

    // Display information in the Server Console
    console.log("  |--  SF ZomboTech Building and Lab objects created");

    // Reset the elevator queue
    resetElevatorQueue();

    // Create the elevator object, the elevator doors and the floor doors
    elevator_Initialize();

    // Display information in the Server Console
    console.log("  |--  SF ZomboTech Building Elevator created");
    console.log("  |---------------------------------------------------");

    Player.getInstances().forEach((p) => {
      removeBuilding(p);
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      removeBuilding(player);
      return next();
    });

    const onMoved = DynamicObjectEvent.onMoved(({ object, next }) => {
      for (let i = 0; i < obj_FloorDoors.length; i++) {
        if (object === obj_FloorDoors[i][0]) {
          const { x } = obj_FloorDoors[i][0].getPos()!;

          // A floor door has shut so move the elevator to the next floor in the queue
          if (x === constants.X_DOOR_CLOSED) {
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

        floorRequestedBy[elevatorFloor] = InvalidEnum.PLAYER_TEXT_DRAW;

        elevator_OpenDoors();
        floor_OpenDoors(elevatorFloor);

        const { z } = obj_Elevator.getPos()!;
        label_Elevator = new Dynamic3DTextLabel({
          text: "{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to use elevator",
          color: 0xccccccaa,
          x: constants.X_ELEVATOR_POS - 1.8,
          y: constants.Y_ELEVATOR_POS + 1.6,
          z: z - 0.6,
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
        if (!player.isInAnyVehicle() && newKeys & KeysEnum.YES) {
          const pos = player.getPos()!;

          // console.log(`X = ${pos.x} | Y = ${pos.y} | Z = ${pos.z}`);

          if (
            pos.y < constants.Y_ELEVATOR_POS + 1.8 &&
            pos.y > constants.Y_ELEVATOR_POS - 1.8 &&
            pos.x < constants.X_ELEVATOR_POS + 1.8 &&
            pos.x > constants.X_ELEVATOR_POS - 1.8
          )
            // He is using the elevator button
            showElevatorDialog(player);
          // Is the player using a floor button?
          else {
            if (
              pos.y > constants.Y_ELEVATOR_POS + 1.81 &&
              pos.y < constants.Y_ELEVATOR_POS + 3.8 &&
              pos.x < constants.X_ELEVATOR_POS - 1.81 &&
              pos.x > constants.X_ELEVATOR_POS - 3.8
            ) {
              // Create variable
              let i = 0;

              // Check for ground floor
              if (
                pos.z > constants.GROUND_Z_COORD - 2 &&
                pos.z < constants.GROUND_Z_COORD + 2
              ) {
                i = 0;
              } else i = 1;

              //console.logf("Floor = %d | State = %d | i = %d", ElevatorFloor, ElevatorState, i);

              // Check if the elevator is not moving and already on the requested floor
              if (
                elevatorState !== constants.ELEVATOR_STATE_MOVING &&
                elevatorFloor === i
              ) {
                // Display a gametext message and exit here
                new GameText(
                  "~n~~n~~n~~n~~n~~r~ZomboTech Elevator~n~~r~Is Already On~n~~r~This Floor!",
                  3000,
                  5,
                ).forPlayer(player);
                return true;
              }

              //console.logf("Call Elevator to Floor %i", i);

              callElevator(player, i);
              new GameText("~r~Elevator called", 3500, 4).forPlayer(player);
            }
          }
        }

        return next();
      },
    );

    const offs = [onConnect, onMoved, onKeyStateChange];

    if (options && options.enableCommand) {
      const onCommandText = PlayerEvent.onCommandText(
        "zl",
        ({ player, next }) => {
          // Set the interior
          player.setInterior(0);

          // Set player position and facing angle
          player.setPos(
            -1957.11 + Math.random() * 2,
            644.36 + Math.random() * 2,
            47.6,
          );
          player.setFacingAngle(215);

          // Fix camera position after teleporting
          player.setCameraBehind();

          // Send a gametext message to the player
          new GameText("~b~~h~ZomboTech Lab!", 3000, 3).forPlayer(player);

          // Exit here
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

    // Check for valid object
    if (sfZomboTechBuildingObject!.isValid()) {
      // Destroy the SF ZombotTech Building object
      sfZomboTechBuildingObject!.destroy();
      sfZomboTechBuildingObject = null;

      // Display information in the Server Console
      console.log("  |---------------------------------------------------");
      console.log("  |--  SF ZomboTech Building object destroyed");
    }

    // Check for valid object
    if (sfZomboTechLabObject!.isValid()) {
      // Destroy the SF ZomboTech Lab object
      sfZomboTechLabObject!.destroy();
      sfZomboTechLabObject = null;

      // Display information in the Server Console
      console.log("  |--  SF ZomboTech Lab object destroyed");
    }

    // Destroy the elevator, the elevator doors and the elevator floor doors
    elevator_Destroy();

    // Display information in the Server Console
    console.log("  |--  SF ZomboTech Building Elevator destroyed");
    console.log("  |---------------------------------------------------");
  },
};
