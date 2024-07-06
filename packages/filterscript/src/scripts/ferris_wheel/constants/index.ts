export const NUM_FERRIS_CAGES = 10;
export const FERRIS_WHEEL_ID = 18877;
export const FERRIS_CAGE_ID = 18879;
export const FERRIS_BASE_ID = 18878;
export const FERRIS_DRAW_DISTANCE = 300.0;
export const FERRIS_WHEEL_SPEED = 0.01;

export const FERRIS_WHEEL_Z_ANGLE = -90.0; // This is the heading the entire ferris wheel is at (beware of gimbal lock)

export const gFerrisOrigin = [832.8393, -2046.199, 27.09] as const;

// Cage offsets for attaching to the main wheel
export const gFerrisCageOffsets = [
  [0.0699, 0.06, -11.75],
  [-6.91, -0.0899, -9.5],
  [11.16, 0.0, -3.63],
  [-11.16, -0.0399, 3.6499],
  [-6.91, -0.0899, 9.4799],
  [0.0699, 0.06, 11.75],
  [6.9599, 0.01, -9.5],
  [-11.16, -0.0399, -3.63],
  [11.16, 0.0, 3.6499],
  [7.0399, -0.02, 9.36],
] as const;
