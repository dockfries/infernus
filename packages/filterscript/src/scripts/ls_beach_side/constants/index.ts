// Movement speed of the elevator
export const ELEVATOR_SPEED = 5.0;

// Movement speed of the doors
export const DOORS_SPEED = 5.0;

// Time in ms that the elevator will wait in each floor before continuing with the queue...
// be sure to give enough time for doors to open
export const ELEVATOR_WAIT_TIME = 5000;

// Position defines
export const X_DOOR_R_OPENED = 289.542419;
export const X_DOOR_L_OPENED = 286.342407;
export const Y_DOOR_R_OPENED = -1609.640991;
export const Y_DOOR_L_OPENED = -1609.076049;

export const X_FDOOR_R_OPENED = 289.492431;
export const X_FDOOR_L_OPENED = 286.292419;
export const Y_FDOOR_R_OPENED = -1609.870971;
export const Y_FDOOR_L_OPENED = -1609.30603;

export const GROUND_Z_COORD = 18.755348; // (33.825077)
export const X_ELEVATOR_POS = 287.942413;
export const Y_ELEVATOR_POS = -1609.341064;

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
  "Tenth Floor",
  "Eleventh Floor",
  "Twelfth Floor",
] as const;

// Elevator floor Z heights
export const FloorZOffsets = [
  0.0, // Car Park
  15.069729, // Ground Floor
  29.130733, // First Floor
  33.630733, // Second Floor = 29.130733 + 4.5
  38.130733, // Third Floor = 33.630733 + 4.5
  42.630733, // Fourth Floor = 38.130733 + 4.5
  47.130733, // Fifth Floor = 42.630733 + 4.5
  51.630733, // Sixth Floor = 47.130733 + 4.5
  56.130733, // Seventh Floor = 51.630733 + 4.5
  60.630733, // Eighth Floor = 56.130733 + 4.5
  65.130733, // Ninth Floor = 60.630733 + 4.5
  69.630733, // Tenth Floor = 65.130733 + 4.5
  74.130733, // Eleventh Floor = 69.630733 + 4.5
  78.630733, // Twelfth Floor = 74.130733 + 4.5
] as const;
