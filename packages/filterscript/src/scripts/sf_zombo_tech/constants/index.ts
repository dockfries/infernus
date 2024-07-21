// Movement speed of the elevator
export const ELEVATOR_SPEED = 5.0;

// Movement speed of the doors
export const DOORS_SPEED = 5.0;

// Time in ms that the elevator will wait in each floor before continuing with the queue...
// be sure to give enough time for doors to open
export const ELEVATOR_WAIT_TIME = 5000;

// Position defines
export const X_DOOR_CLOSED = -1951.603027;
export const X_DOOR_L_OPENED = X_DOOR_CLOSED + 1.6;
export const X_DOOR_R_OPENED = X_DOOR_CLOSED - 1.6;
export const GROUND_Z_COORD = 47.451492;
export const X_ELEVATOR_POS = -1951.603027;
export const Y_ELEVATOR_POS = 636.418334;

// Elevator state defines
export const ELEVATOR_STATE_IDLE = 0;
export const ELEVATOR_STATE_WAITING = 1;
export const ELEVATOR_STATE_MOVING = 2;

// Invalid floor define
export const INVALID_FLOOR = -1;

// Elevator floor names for the 3D text labels
export const FloorNames = ["Ground Floor", "ZomboTech Lab"];

// Elevator floor Z heights
export const FloorZOffsets = [
  0.0, // Ground Floor
  -21.628007, // ZomboTech Lab   -21.598007
];
