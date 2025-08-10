import { GangZone, Player, PlayerEvent, defineEvent } from "@infernus/core";
import { MapNode } from "./node";
import { GpsPath } from "./path";
import { MAX_WAZE_DOTS, WAZE_UPDATE_TIME } from "../constants";
import { IWazeGps } from "../interfaces";

const wazeGPS = new Map<Player, IWazeGps>();

const [onPlayerRouteFinish, triggerPlayerRouteFinish] = defineEvent({
  name: "OnPlayerRouteFinish",
  isNative: false,
  beforeEach(player: Player, finishedRoute: IWazeGps) {
    return { player, finishedRoute };
  },
});

const [onPlayerRouteUpdate, triggerPlayerRouteUpdate] = defineEvent({
  name: "OnPlayerRouteUpdate",
  isNative: false,
  beforeEach(player: Player, currentRoute: IWazeGps) {
    return { player, currentRoute };
  },
});

export const WazeEvent = Object.freeze({
  onPlayerRouteFinish,
  onPlayerRouteUpdate,
});

PlayerEvent.onDisconnect(({ player, next }) => {
  resetWazeGps(player);
  return next();
});

async function updateWaze(player: Player, x: number, y: number, z: number) {
  if (player.getInterior() !== 0) return stopWazeGPS(player);

  const wazeGPS_ = wazeGPS.get(player);
  if (!wazeGPS_) return false;

  const wazeGPS_Position = wazeGPS_.position;

  if (
    player.isInRangeOfPoint(
      30.0,
      wazeGPS_Position[0],
      wazeGPS_Position[1],
      wazeGPS_Position[2],
    )
  ) {
    return stopWazeGPS(player);
  }

  const pos = player.getPos();

  if (!pos.ret) {
    return stopWazeGPS(player);
  }

  wazeGPS_.tickPosition = [pos.x, pos.y, pos.z];

  wazeGPS.set(player, wazeGPS_);

  const start = MapNode.getClosestToPoint(pos.x, pos.y, pos.z);
  const target = MapNode.getClosestToPoint(x, y, z);
  return GpsPath.find(start, target)
    .then((path) => {
      const oldRoutes = wazeGPS_.routes.slice();
      wazeGPS_.routes = [];
      onPlayerWazeRouters(path, player);
      destroyWazeRoutesGPS(player, oldRoutes);
      return true;
    })
    .catch((err) => {
      throw err;
    });
}

function onPlayerWazeRouters(path: GpsPath, player: Player) {
  if (!path.isValid()) return true;
  const wazeGPS_ = wazeGPS.get(player);
  if (!wazeGPS_ || !wazeGPS_.timer) return true;

  const size = path.getSize();
  if (size === 1) return stopWazeGPS(player);

  const pos = player.getPos();
  if (!pos.ret) return true;

  const node = MapNode.getClosestToPoint(pos.x, pos.y, pos.z);
  let { x, y } = node.getPos();

  const _size = MAX_WAZE_DOTS > size ? size : MAX_WAZE_DOTS;

  for (let i = 0; i < _size; i++) {
    const node = path.getNode(i);
    const index = path.getNodeIndex(node);
    const { x: X, y: Y } = node.getPos();

    if (i === index)
      if (!createWazePointer(player, x, y, X, Y, wazeGPS_.color)) break;

    x = X + 0.5;
    y = Y + 0.5;
  }

  triggerPlayerRouteUpdate(player, wazeGPS_);
  return true;
}

function gdbp(
  x: number,
  y: number,
  z: number,
  pointX: number,
  pointY: number,
  pointZ: number,
): number {
  const deltaX = x - pointX;
  const deltaY = y - pointY;
  const deltaZ = z - pointZ;
  const sumOfSquares = deltaX ** 2 + deltaY ** 2 + deltaZ ** 2;
  return Math.sqrt(sumOfSquares);
}

export function isValidWazeGPS(player: Player) {
  const wazeGps_ = wazeGPS.get(player);
  if (!wazeGps_) return false;
  return !!wazeGps_.timer;
}

function resetWazeGps(player: Player) {
  stopWazeGPS(player);
  if (wazeGPS.has(player)) {
    wazeGPS.delete(player);
  }
}

export function setPlayerWaze(
  player: Player,
  x: number,
  y: number,
  z: number,
  color: string | number = 0x8a44e4ff,
  updateTime = WAZE_UPDATE_TIME,
) {
  resetWazeGps(player);

  const wazeGPS_: IWazeGps = {
    timer: null,
    color,
    routes: [],
    position: [x, y, z],
    tickPosition: [0, 0, 0],
  };

  if (!wazeGPS_.timer) {
    wazeGPS_.timer = setInterval(() => {
      updateWaze(player, x, y, z);
    }, updateTime);
  }

  wazeGPS.set(player, wazeGPS_);

  // Force First Update
  return updateWaze(player, x, y, z);
}

export function stopWazeGPS(player: Player) {
  const wazeGPS_ = wazeGPS.get(player);
  if (!wazeGPS_) return false;

  if (wazeGPS_.timer) {
    clearInterval(wazeGPS_.timer);
    wazeGPS_.timer = null;
    wazeGPS.set(player, wazeGPS_);
    triggerPlayerRouteFinish(player, wazeGPS_);
  }

  destroyWazeRoutesGPS(player);
  return true;
}

function destroyWazeRoutesGPS(player: Player, oldRoutes?: IWazeGps["routes"]) {
  const wazeGPS_ = wazeGPS.get(player);
  if (!wazeGPS_) return false;

  const routes = oldRoutes || wazeGPS_.routes;
  routes.forEach((route) => {
    route.destroy();
  });
  routes.length = 0;

  wazeGPS.set(player, wazeGPS_);
  return true;
}

function createWazePointer(
  player: Player,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string | number,
) {
  const dis = 12.5;
  const gdPointers = gdbp(x1, y1, 0.0, x2, y2, 0.0);
  const points = Math.round(gdPointers / dis);

  const wazeGPS_ = wazeGPS.get(player);
  if (!wazeGPS_) return false;

  let flag = true;
  for (let i = 1; i <= points; i++) {
    const index = i - 1;

    if (index >= MAX_WAZE_DOTS) {
      flag = false;
      break;
    }

    const x = x1 + ((x2 - x1) / points) * i;
    const y = y1 + ((y2 - y1) / points) * i;

    const route = new GangZone({
      minX: x - dis / 2 - 5,
      minY: y - dis / 2 - 5,
      maxX: x + dis / 2 + 5,
      maxY: y + dis / 2 + 5,
      player,
    });
    route.create();
    route.showForPlayer(color);
    wazeGPS_.routes.push(route);
  }
  wazeGPS.set(player, wazeGPS_);
  return flag;
}
