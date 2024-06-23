export const NUM_SHIP_ROUTE_POINTS = 25;
export const SHIP_HULL_ID = 9585; // massive cargo ship's hull. This is used as the main object
export const SHIP_MOVE_SPEED = 10.0;
export const SHIP_DRAW_DISTANCE = 300.0;
export const NUM_SHIP_ATTACHMENTS = 10;

export const gShipHullOrigin = [-2409.8438, 1544.9453, 7.0]; // so we can convert world space to model space for attachment positions

export const gShipAttachmentModelIds = [
  9586, // Ship main platform
  9761, // Ship rails
  9584, // Bridge exterior
  9698, // Bridge interior
  9821, // Bridge interior doors
  9818, // Bridge radio desk
  9819, // Captain's desk
  9822, // Captain's seat
  9820, // Bridge ducts and lights
  9590, // Cargo bay area
];

export const gShipAttachmentPos = [
  // these are world space positions used on the original cargo ship in the game
  // they will be converted to model space before attaching
  [-2412.125, 1544.9453, 17.0469],
  [-2411.3906, 1544.9453, 27.0781],
  [-2485.0781, 1544.9453, 26.1953],
  [-2473.5859, 1543.7734, 29.0781],
  [-2474.3594, 1547.2422, 24.75],
  [-2470.2656, 1544.9609, 33.8672],
  [-2470.4531, 1551.1172, 33.1406],
  [-2470.9375, 1550.75, 32.9063],
  [-2474.625, 1545.0859, 33.0625],
  [-2403.5078, 1544.9453, 8.7188],
];

// Pirate ship route points (position/rotation)
export const gShipRoutePoints = [
  [-1982.57, 2052.56, 0.0, 0.0, 0.0, 144.84],
  [-2178.63, 2103.67, 0.0, 0.0, 0.0, 189.24],
  [-2366.64, 2020.28, 0.0, 0.0, 0.0, 215.22],
  [-2539.06, 1892.52, 0.0, 0.0, 0.0, 215.22],
  [-2722.79, 1787.85, 0.0, 0.0, 0.0, 205.62],
  [-2918.51, 1729.6, 0.0, 0.0, 0.0, 190.5],
  [-3124.7, 1758.03, 0.0, 0.0, 0.0, 156.36],
  [-3316.51, 1850.08, 0.0, 0.0, 0.0, 153.36],
  [-3541.12, 1977.99, 0.0, 0.0, 0.0, 145.74],
  [-3772.54, 2140.7, 0.0, 0.0, 0.0, 144.96],
  [-4078.78, 2272.93, 0.0, 0.0, 0.0, 167.52],
  [-4382.22, 2222.52, 0.0, 0.36, 0.06, 206.7],
  [-4578.11, 2013.7, 0.0, 0.36, 0.54, 244.8],
  [-4603.54, 1718.89, 0.0, 1.92, -0.36, 283.26],
  [-4463.49, 1504.5, 0.0, 0.92, -0.36, 316.32],
  [-4228.0, 1380.52, 0.0, 0.92, -0.36, 342.54],
  [-3950.14, 1346.96, 0.0, 0.02, -0.06, 359.64],
  [-3646.69, 1344.57, 0.0, 0.02, -0.06, 359.64],
  [-3350.01, 1410.39, 0.0, 0.02, -0.06, 384.48],
  [-2854.63, 1651.56, 0.0, 0.02, -0.06, 378.54],
  [-2590.84, 1667.61, 0.0, 0.02, -0.06, 356.28],
  [-2345.84, 1633.19, 0.0, 0.02, -0.06, 350.28],
  [-2106.14, 1639.23, 0.0, 0.02, -0.06, 378.36],
  [-1943.63, 1743.98, 0.0, 0.02, -0.06, 411.42],
  [-1891.39, 1907.57, 0.0, 0.02, -0.06, 457.14],
];
