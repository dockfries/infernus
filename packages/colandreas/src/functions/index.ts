import type { Vehicle } from "@infernus/core";
import { Player, GameMode } from "@infernus/core";
import { rayCastLine, rayCastMultiLine, removeBuilding } from "../natives";
import { FLOAT_INFINITY, WATER_OBJECT } from "../definitions";
import { degreesToRadians } from "../utils";

export function findZ_For2DCoord(x: number, y: number) {
  return rayCastLine(x, y, 700.0, x, y, -1000.0)?.z;
}

export function rayCastExplode(
  cX: number,
  cY: number,
  cZ: number,
  radius: number,
  intensity = 20.0,
) {
  const collisions: { x: number; y: number; z: number }[] = [];

  if (
    intensity < 1.0 ||
    intensity > 360.0 ||
    (360.0 / intensity - Math.floor(360.0 / intensity)) * intensity
  ) {
    return collisions;
  }

  let LAT: number, LON: number, x: number, y: number, z: number;
  for (let lat = -180.0, lon = -90.0; lat < 180.0; lat += intensity * 0.75) {
    for (lon = -90.0; lon < 90.0; lon += intensity) {
      LAT = (lat * Math.PI) / 180.0;
      LON = (lon * Math.PI) / 180.0;
      x = -radius * Math.cos(LAT) * Math.cos(LON);
      y = radius * Math.cos(LAT) * Math.sin(LON);
      z = radius * Math.sin(LAT);

      const result = rayCastLine(cX, cY, cZ, cX + x, cY + y, cZ + z);
      if (result) {
        collisions.push({ x, y, z });
      }
    }
  }

  return collisions;
}

function isOnSurface(instance: Player | Vehicle, tolerance: number) {
  const ret = instance.getPos();
  if (!ret.ret) return false;
  const { x, y, z } = ret;

  return Boolean(rayCastLine(x, y, z, x, y, z - tolerance));
}

export function isPlayerOnSurface(player: Player, tolerance = 1.5) {
  return isOnSurface(player, tolerance);
}

export function isVehicleOnSurface(vehicle: Vehicle, tolerance = 1.5) {
  return isOnSurface(vehicle, tolerance);
}

export function removeBarriers() {
  const barrierIDS = [
    4504, 4505, 4506, 4507, 4508, 4509, 4510, 4511, 4512, 4513, 4514, 4515,
    4516, 4517, 4518, 4519, 4520, 4521, 4522, 4523, 4524, 4525, 4526, 4527,
    16436, 16437, 16438, 16439, 1662,
  ];

  barrierIDS.forEach((b) => {
    removeBuilding(b, 0.0, 0.0, 0.0, 4242.6407);
  });

  return true;
}

export function removeBreakableBuildings() {
  const breakableIDs = [
    625, 626, 627, 628, 629, 630, 631, 632, 633, 642, 643, 644, 646, 650, 716,
    717, 737, 738, 792, 858, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890,
    891, 892, 893, 894, 895, 904, 905, 941, 955, 956, 959, 961, 990, 993, 996,
    1209, 1211, 1213, 1219, 1220, 1221, 1223, 1224, 1225, 1226, 1227, 1228,
    1229, 1230, 1231, 1232, 1235, 1238, 1244, 1251, 1255, 1257, 1262, 1264,
    1265, 1270, 1280, 1281, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289,
    1290, 1291, 1293, 1294, 1297, 1300, 1302, 1315, 1328, 1329, 1330, 1338,
    1350, 1351, 1352, 1370, 1373, 1374, 1375, 1407, 1408, 1409, 1410, 1411,
    1412, 1413, 1414, 1415, 1417, 1418, 1419, 1420, 1421, 1422, 1423, 1424,
    1425, 1426, 1428, 1429, 1431, 1432, 1433, 1436, 1437, 1438, 1440, 1441,
    1443, 1444, 1445, 1446, 1447, 1448, 1449, 1450, 1451, 1452, 1456, 1457,
    1458, 1459, 1460, 1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469,
    1470, 1471, 1472, 1473, 1474, 1475, 1476, 1477, 1478, 1479, 1480, 1481,
    1482, 1483, 1514, 1517, 1520, 1534, 1543, 1544, 1545, 1551, 1553, 1554,
    1558, 1564, 1568, 1582, 1583, 1584, 1588, 1589, 1590, 1591, 1592, 1645,
    1646, 1647, 1654, 1664, 1666, 1667, 1668, 1669, 1670, 1672, 1676, 1684,
    1686, 1775, 1776, 1949, 1950, 1951, 1960, 1961, 1962, 1975, 1976, 1977,
    2647, 2663, 2682, 2683, 2885, 2886, 2887, 2900, 2918, 2920, 2925, 2932,
    2933, 2942, 2943, 2945, 2947, 2958, 2959, 2966, 2968, 2971, 2977, 2987,
    2988, 2989, 2991, 2994, 3006, 3018, 3019, 3020, 3021, 3022, 3023, 3024,
    3029, 3032, 3036, 3058, 3059, 3067, 3083, 3091, 3221, 3260, 3261, 3262,
    3263, 3264, 3265, 3267, 3275, 3276, 3278, 3280, 3281, 3282, 3302, 3374,
    3409, 3460, 3516, 3794, 3795, 3797, 3853, 3855, 3864, 3884, 11103, 12840,
    16627, 16628, 16629, 16630, 16631, 16632, 16633, 16634, 16635, 16636, 16732,
    17968,
  ];

  breakableIDs.forEach((b) => {
    removeBuilding(b, 0.0, 0.0, 0.0, 4242.6407);
  });

  return true;
}

function isInWater(instance: Player | Vehicle) {
  const pos = instance.getPos();
  if (!pos.ret) return false;
  const { x, y, z } = pos;

  const {
    collisions,
    z: retZ,
    modelIds,
  } = rayCastMultiLine(x, y, z + 1000.0, x, y, z - 1000.0, 10);

  if (collisions <= 0) return false;

  let depth = FLOAT_INFINITY;
  let instanceDepth = FLOAT_INFINITY;

  for (let i = 0, j = 0; i < collisions; i++) {
    if (modelIds[i] !== WATER_OBJECT) continue;

    for (j = 0; j < collisions; j++) {
      if (retZ[j] < depth) depth = retZ[j];
    }

    depth = retZ[i] - depth;
    if (depth < 0.001 && depth > -0.001) depth = 100.0;
    instanceDepth = retZ[i] - z;

    if (instanceDepth < -2.0) return false;

    return { depth, instanceDepth };
  }

  return false;
}

export function isPlayerInWater(player: Player) {
  const ret = isInWater(player);
  if (ret)
    return {
      depth: ret.depth,
      playerDepth: ret.instanceDepth,
    };
  return ret;
}

export function isVehicleInWater(vehicle: Vehicle) {
  const ret = isInWater(vehicle);
  if (ret)
    return {
      depth: ret.depth,
      vehicleDepth: ret.instanceDepth,
    };
  return ret;
}

function isNearWater(instance: Player | Vehicle, dist: number, height: number) {
  const pos = instance.getPos();
  if (!pos.ret) return false;

  const { x, y, z } = pos;

  for (let i = 0; i < 6; i++)
    if (
      rayCastLine(
        x + dist * Math.sin(degreesToRadians(i * 60.0)),
        y + dist * Math.cos(degreesToRadians(i * 60.0)),
        z + height,
        x + dist * Math.sin(degreesToRadians(i * 60.0)),
        y + dist * Math.cos(degreesToRadians(i * 60.0)),
        z - height,
      )?.ret === WATER_OBJECT
    )
      return true;
  return false;
}

export function isPlayerNearWater(player: Player, dist = 3.0, height = 3.0) {
  return isNearWater(player, dist, height);
}

export function isVehicleNearWater(vehicle: Vehicle, dist = 3.0, height = 3.0) {
  return isNearWater(vehicle, dist, height);
}

function isFacingWater(
  instance: Player | Vehicle,
  dist: number,
  height: number,
) {
  const pos = instance.getPos();
  const r =
    instance instanceof Player
      ? instance.getFacingAngle()
      : instance.getZAngle();

  if (!pos.ret || !r.ret) return false;

  const { x, y, z } = pos;

  if (
    rayCastLine(
      x + dist * Math.sin(degreesToRadians(-r.angle)),
      y + dist * Math.cos(degreesToRadians(-r.angle)),
      z,
      x + dist * Math.sin(degreesToRadians(-r.angle)),
      y + dist * Math.cos(degreesToRadians(-r.angle)),
      z - height,
    )?.ret === WATER_OBJECT
  )
    return true;
  return false;
}

export function isPlayerFacingWater(player: Player, dist = 3.0, height = 3.0) {
  return isFacingWater(player, dist, height);
}

export function isVehicleFacingWater(
  vehicle: Vehicle,
  dist = 3.0,
  height = 3.0,
) {
  return isFacingWater(vehicle, dist, height);
}

function isBlocked(instance: Player | Vehicle, dist: number, height: number) {
  const pos = instance.getPos();
  const a =
    instance instanceof Player
      ? instance.getFacingAngle()
      : instance.getZAngle();

  if (!pos.ret || !a.ret) return false;

  const { x, y } = pos;
  let { z } = pos;
  z -= 1.0 + height;

  const endX = x + dist * Math.sin(degreesToRadians(-a.angle));
  const endY = y + dist * Math.cos(degreesToRadians(-a.angle));
  return Boolean(rayCastLine(x, y, z, endX, endY, z));
}

export function isPlayerBlocked(player: Player, dist = 1.5, height = 0.5) {
  return isBlocked(player, dist, height);
}

export function isVehicleBlocked(vehicle: Vehicle, dist = 1.5, height = 0.5) {
  return isBlocked(vehicle, dist, height);
}

export function getRoomHeight(x: number, y: number, z: number) {
  const fRet = rayCastLine(x, y, z, x, y, z - 1000.0);

  if (!fRet) return 0.0;

  const { x: fx, y: fy, z: fz } = fRet;

  const cRet = rayCastLine(x, y, z, x, y, z + 1000.0);

  if (!cRet) return 0.0;

  const { x: cx, y: cy, z: cz } = cRet;

  return Math.sqrt(
    (fx - cx) * (fx - cx) + (fy - cy) * (fy - cy) + (fz - cz) * (fz - cz),
  );
}

export function getRoomCenter(x: number, y: number, z: number) {
  const pt1 = rayCastLine(
    x,
    y,
    z,
    x + 1000.0 * Math.cos(degreesToRadians(0.0)),
    y + 1000.0 * Math.sin(degreesToRadians(0.0)),
    z,
  );

  const pt2 = rayCastLine(
    x,
    y,
    z,
    x + 1000.0 * Math.cos(degreesToRadians(120.0)),
    y + 1000.0 * Math.sin(degreesToRadians(120.0)),
    z,
  );

  const pt3 = rayCastLine(
    x,
    y,
    z,
    x + 1000.0 * Math.cos(degreesToRadians(-120.0)),
    y + 1000.0 * Math.sin(degreesToRadians(-120.0)),
    z,
  );

  if (!pt1 || !pt2 || !pt3) return -1.0;

  const { x: pt1x, y: pt1y } = pt1;
  const { x: pt2x, y: pt2y } = pt2;
  const { x: pt3x, y: pt3y } = pt3;

  const yDelta_a = pt2y - pt1y,
    xDelta_a = pt2x - pt1x,
    yDelta_b = pt3y - pt2y,
    xDelta_b = pt3x - pt2x;

  let m_x = 0,
    m_y = 0;

  if (Math.abs(xDelta_a) <= 0.000000001 && Math.abs(yDelta_b) <= 0.000000001) {
    m_x = 0.5 * (pt2x + pt3x);
    m_y = 0.5 * (pt1y + pt2y);
    const size = GameMode.vectorSize(m_x - pt1x, m_y - pt1y, 0.0);
    return { size, m_x, m_y };
  }

  const aSlope = yDelta_a / xDelta_a,
    bSlope = yDelta_b / xDelta_b;

  if (Math.abs(aSlope - bSlope) <= 0.000000001) return -1.0;

  m_x =
    (aSlope * bSlope * (pt1y - pt3y) +
      bSlope * (pt1x + pt2x) -
      aSlope * (pt2x + pt3x)) /
    (2.0 * (bSlope - aSlope));
  m_y = (-1.0 * (m_x - (pt1x + pt2x) / 2.0)) / aSlope + (pt1y + pt2y) / 2.0;

  const size = GameMode.vectorSize(m_x - pt1x, m_y - pt1y, 0.0);

  return { size, m_x, m_y };
}
