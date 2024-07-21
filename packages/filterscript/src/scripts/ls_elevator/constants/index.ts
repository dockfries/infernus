export const ELEVATOR_SPEED = 5.0; // Movement speed of the elevator.
export const DOORS_SPEED = 5.0; // Movement speed of the doors.
export const ELEVATOR_WAIT_TIME = 5000; // Time in ms that the elevator will wait in each floor before continuing with the queue.
// Be sure to give enough time for doors to open.

// Private:
export const X_DOOR_CLOSED = 1786.627685;
export const X_DOOR_R_OPENED = 1785.027685;
export const X_DOOR_L_OPENED = 1788.227685;
export const GROUND_Z_COORD = 14.511476;
export const ELEVATOR_OFFSET = 0.059523;

export const FloorNames = [
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
  "Thirteenth Floor",
  "Fourteenth Floor",
  "Fifteenth Floor",
  "Sixteenth Floor",
  "Seventeenth Floor",
  "Eighteenth Floor",
  "Nineteenth Floor",
  "Penthouse",
] as const;

export const FloorZOffsets = [
  0.0, // 0.0,
  8.5479, // 8.5479,
  13.99945, // 8.5479 + (5.45155 * 1.0),
  19.451, // 8.5479 + (5.45155 * 2.0),
  24.90255, // 8.5479 + (5.45155 * 3.0),
  30.3541, // 8.5479 + (5.45155 * 4.0),
  35.80565, // 8.5479 + (5.45155 * 5.0),
  41.2572, // 8.5479 + (5.45155 * 6.0),
  46.70875, // 8.5479 + (5.45155 * 7.0),
  52.1603, // 8.5479 + (5.45155 * 8.0),
  57.61185, // 8.5479 + (5.45155 * 9.0),
  63.0634, // 8.5479 + (5.45155 * 10.0),
  68.51495, // 8.5479 + (5.45155 * 11.0),
  73.9665, // 8.5479 + (5.45155 * 12.0),
  79.41805, // 8.5479 + (5.45155 * 13.0),
  84.8696, // 8.5479 + (5.45155 * 14.0),
  90.32115, // 8.5479 + (5.45155 * 15.0),
  95.7727, // 8.5479 + (5.45155 * 16.0),
  101.22425, // 8.5479 + (5.45155 * 17.0),
  106.6758, // 8.5479 + (5.45155 * 18.0),
  112.12735, // 8.5479 + (5.45155 * 19.0)
] as const;

export const ELEVATOR_STATE_IDLE = 0;
export const ELEVATOR_STATE_WAITING = 1;
export const ELEVATOR_STATE_MOVING = 2;

export const INVALID_FLOOR = -1;
