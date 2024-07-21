// Movement speed of the elevator
export const ELEVATOR_SPEED = 5.0;

// Movement speed of the doors
export const DOORS_SPEED = 5.0;

// Time in ms that the elevator will wait in each floor before continuing with the queue...
// be sure to give enough time for doors to open
export const ELEVATOR_WAIT_TIME = 5000;

// Dialog ID for the LS Apartments building elevator dialog
export const DIALOG_ID = 876;

// Position defines
export const Y_DOOR_CLOSED = -1180.535917;
export const Y_DOOR_R_OPENED = Y_DOOR_CLOSED - 1.6;
export const Y_DOOR_L_OPENED = Y_DOOR_CLOSED + 1.6;

export const GROUND_Z_COORD = 20.879316;

export const ELEVATOR_OFFSET = 0.059523;

export const X_ELEVATOR_POS = 1181.622924;
export const Y_ELEVATOR_POS = -1180.554687;

// Elevator state defines
export const ELEVATOR_STATE_IDLE = 0;
export const ELEVATOR_STATE_WAITING = 1;
export const ELEVATOR_STATE_MOVING = 2;

// Invalid floor define
export const INVALID_FLOOR = -1;

// Used for chat text messages
export const COLOR_MESSAGE_YELLOW = 0xffdd00aa;

// Elevator floor names for the 3D text labels
export const FloorNames = [
  "Car Park",
  "Ground Floor",
  "First Floor",
  "Second Floor",
  "Third Floor",
  "Fourth Floor",
  "Fifth Floor",
  "Sixth Floor",
  "Seventh Floor",
  "Eighth Floor",
  "Ninth Floor",
];

// Elevator floor Z heights
export const FloorZOffsets = [
  0.0, // Car Park
  13.604544, // Ground Floor
  18.808519, // First Floor = 13.604544 + 5.203975
  24.012494, // Second Floor = 18.808519 + 5.203975
  29.216469, // Third Floor = 24.012494 + 5.203975
  34.420444, // Fourth Floor = 29.216469 + 5.203975
  39.624419, // Fifth Floor = 34.420444 + 5.203975
  44.828394, // Sixth Floor = 39.624419 + 5.203975
  50.032369, // Seventh Floor = 44.828394 + 5.203975
  55.236344, // Eighth Floor = 50.032369 + 5.203975
  60.440319, // Ninth Floor = 55.236344 + 5.203975
];
