//  * Example elevator system for the let LS building.
//  *
//  *	Zamaroht 2010
//  *
//  * 26/08/2011: Kye: added a sound effect for the elevator starting/stopping.

import type { IFilterScript, Player } from "@infernus/core";
import { DynamicObject, DynamicObjectEvent } from "@infernus/core";
import {
  Dialog,
  DialogStylesEnum,
  Dynamic3DTextLabel,
  GameText,
  InvalidEnum,
  KeysEnum,
  PlayerEvent,
} from "@infernus/core";
import * as constants from "./constants";
import { playSoundForPlayersInRange } from "filterscript/utils/gl_common";

// Warning: This script uses a total of 45 objects, 22 3D Text Labels.

let obj_Elevator: DynamicObject | null = null;
let obj_ElevatorDoors: DynamicObject[] = [];
let obj_FloorDoors: [DynamicObject, DynamicObject][] = [];

let label_Elevator: Dynamic3DTextLabel | null = null;
let label_Floors: Dynamic3DTextLabel[] = [];

// If Idle or Waiting, this is the current floor. If Moving, the floor it's moving to.
let elevatorState: number, elevatorFloor: number;

// Floors in queue.
let elevatorQueue: number[] = [];
// FloorRequestedBy[floor_id] = playerid; - Points out who requested which floor.
let floorRequestedBy: (Player | InvalidEnum.PLAYER_ID)[] = [];

// Timer that makes the elevator move faster after players start surfing the object.
let elevatorBoostTimer: NodeJS.Timeout | null = null;
let elevatorTurnTimer: NodeJS.Timeout | null = null;

// Private:
function elevator_Initialize() {
  // Initializes the elevator.
  obj_Elevator = new DynamicObject({
    modelId: 18755,
    x: 1786.6781,
    y: -1303.459472,
    z: constants.GROUND_Z_COORD + constants.ELEVATOR_OFFSET,
    rx: 0.0,
    ry: 0.0,
    rz: 270.0,
  });
  obj_Elevator.create();
  obj_ElevatorDoors[0] = new DynamicObject({
    modelId: 18757,
    x: constants.X_DOOR_CLOSED,
    y: -1303.459472,
    z: constants.GROUND_Z_COORD,
    rx: 0.0,
    ry: 0.0,
    rz: 270.0,
  });
  obj_ElevatorDoors[0].create();
  obj_ElevatorDoors[1] = new DynamicObject({
    modelId: 18756,
    x: constants.X_DOOR_CLOSED,
    y: -1303.459472,
    z: constants.GROUND_Z_COORD,
    rx: 0.0,
    ry: 0.0,
    rz: 270.0,
  });
  obj_ElevatorDoors[1].create();

  label_Elevator = new Dynamic3DTextLabel({
    text: "{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to use elevator",
    color: 0xccccccaa,
    x: 1784.9822,
    y: -1302.0426,
    z: 13.6491,
    drawDistance: 4.0,
    worldId: 0,
    testLos: true,
  });
  label_Elevator.create();

  for (let i = 0; i < constants.FloorNames.length; i++) {
    obj_FloorDoors[i] = [
      new DynamicObject({
        modelId: 18757,
        x: constants.X_DOOR_CLOSED,
        y: -1303.171142,
        z: getDoorsZCoordForFloor(i),
        rx: 0.0,
        ry: 0.0,
        rz: 270.0,
      }),
      new DynamicObject({
        modelId: 18756,
        x: constants.X_DOOR_CLOSED,
        y: -1303.171142,
        z: getDoorsZCoordForFloor(i),
        rx: 0.0,
        ry: 0.0,
        rz: 270.0,
      }),
    ];
    obj_FloorDoors[i][0].create();
    obj_FloorDoors[i][1].create();

    const string = `{CCCCCC}[${constants.FloorNames[i]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to call`;

    const z = i === 0 ? 13.4713 : 13.4713 + 8.7396 + (i - 1) * 5.45155;

    label_Floors[i] = new Dynamic3DTextLabel({
      text: string,
      color: 0xccccccaa,
      x: 1783.9799,
      y: -1300.766,
      z,
      drawDistance: 10.5,
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
    -1303.171142,
    getDoorsZCoordForFloor(floorId),
    constants.DOORS_SPEED,
  );
  obj_FloorDoors[floorId][1].move(
    constants.X_DOOR_R_OPENED,
    -1303.171142,
    getDoorsZCoordForFloor(floorId),
    constants.DOORS_SPEED,
  );

  playSoundForPlayersInRange(
    6401,
    50.0,
    constants.X_DOOR_CLOSED,
    -1303.171142,
    getDoorsZCoordForFloor(floorId) + 5.0,
  );

  return true;
}

function floor_CloseDoors(floorId: number) {
  // Closes the doors at the specified floor.

  obj_FloorDoors[floorId][0].move(
    constants.X_DOOR_CLOSED,
    -1303.171142,
    getDoorsZCoordForFloor(floorId),
    constants.DOORS_SPEED,
  );
  obj_FloorDoors[floorId][1].move(
    constants.X_DOOR_CLOSED,
    -1303.171142,
    getDoorsZCoordForFloor(floorId),
    constants.DOORS_SPEED,
  );

  playSoundForPlayersInRange(
    6401,
    50.0,
    constants.X_DOOR_CLOSED,
    -1303.171142,
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
    1786.6781,
    -1303.459472,
    getElevatorZCoordForFloor(floorId),
    0.25,
  );
  obj_ElevatorDoors[0].move(
    constants.X_DOOR_CLOSED,
    -1303.459472,
    getDoorsZCoordForFloor(floorId),
    0.25,
  );
  obj_ElevatorDoors[1].move(
    constants.X_DOOR_CLOSED,
    -1303.459472,
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
    1786.6781,
    -1303.459472,
    getElevatorZCoordForFloor(floorId),
    constants.ELEVATOR_SPEED,
  );
  obj_ElevatorDoors[0].move(
    constants.X_DOOR_CLOSED,
    -1303.459472,
    getDoorsZCoordForFloor(floorId),
    constants.ELEVATOR_SPEED,
  );
  obj_ElevatorDoors[1].move(
    constants.X_DOOR_CLOSED,
    -1303.459472,
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

function getElevatorZCoordForFloor(floorId: number) {
  return (
    constants.GROUND_Z_COORD +
    constants.FloorZOffsets[floorId] +
    constants.ELEVATOR_OFFSET
  ); // A small offset for the elevator object itself.
}

function getDoorsZCoordForFloor(floorId: number) {
  return constants.GROUND_Z_COORD + constants.FloorZOffsets[floorId];
}

// Public:
// You can use INVALID_PLAYER_ID too.
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

async function showElevatorDialog(player: Player) {
  let info = "";
  for (let i = 0; i < elevatorQueue.length; i++) {
    if (floorRequestedBy[i] !== player) info += "{FF0000}";

    info += constants.FloorNames[i] + "\n";
  }
  const { listItem } = await new Dialog({
    style: DialogStylesEnum.LIST,
    caption: "Elevator",
    info,
    button1: "Accept",
    button2: "Cancel",
  }).show(player);

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

export const LSElevator: IFilterScript = {
  name: "ls_elevator",
  load() {
    const onMoved = DynamicObjectEvent.onMoved(({ object, next }) => {
      for (let i = 0; i < obj_FloorDoors.length; i++) {
        if (object === obj_FloorDoors[i][0]) {
          const { x } = obj_FloorDoors[i][0].getPos()!;
          if (x < constants.X_DOOR_L_OPENED - 0.5) {
            // Some floor doors have shut, move the elevator to next floor in queue:
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

        const { z } = obj_Elevator.getPos()!;
        label_Elevator = new Dynamic3DTextLabel({
          text: "{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to use elevator",
          color: 0xccccccaa,
          x: 1784.9822,
          y: -1302.0426,
          z: z - 0.9,
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
          if (
            pos.y < -1301.4 &&
            pos.y > -1303.2417 &&
            pos.x < 1786.2131 &&
            pos.x > 1784.1555
          ) {
            // He is using the elevator button
            showElevatorDialog(player);
            // Is he in a floor button?
          } else {
            if (
              pos.y > -1301.4 &&
              pos.y < -1299.1447 &&
              pos.x < 1785.6147 &&
              pos.x > 1781.9902
            ) {
              // He is most likely using it, check floor:
              let i = 20;
              while (pos.z < getDoorsZCoordForFloor(i) + 3.5 && i > 0) {
                i--;
              }

              if (i === 0 && pos.z < getDoorsZCoordForFloor(0) + 2.0) {
                i = -1;
              }

              if (i <= 19) {
                callElevator(player, i + 1);
                new GameText("~r~Elevator called", 3500, 4).forPlayer(player);
              }
            }
          }
        }

        return next();
      },
    );

    resetElevatorQueue();
    elevator_Initialize();

    return [onKeyStateChange, onMoved];
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

    elevator_Destroy();
  },
};
