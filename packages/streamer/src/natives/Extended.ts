import { StreamerDistances } from "../definitions/Distances";
import { MapIconStyles } from "./MapIcons";

export const CreateDynamicObjectEx = (
  modelid: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  streamdistance: number = StreamerDistances.OBJECT_SD,
  drawdistance: number = StreamerDistances.OBJECT_DD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicObjectEx",
    "iffffffffaaaaiiiii",
    modelid,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    streamdistance,
    drawdistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicPickupEx = (
  modelid: number,
  type: number,
  x: number,
  y: number,
  z: number,
  streamdistance: number = StreamerDistances.PICKUP_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicPickupEx",
    "iiffffaaaaiiiii",
    modelid,
    type,
    x,
    y,
    z,
    streamdistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicCPEx = (
  x: number,
  y: number,
  z: number,
  size: number,
  streamdistance: number = StreamerDistances.CP_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicCPEx",
    "fffffaaaaiiiii",
    x,
    y,
    z,
    size,
    streamdistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicRaceCPEx = (
  type: number,
  x: number,
  y: number,
  z: number,
  nextx: number,
  nexty: number,
  nextz: number,
  size: number,
  streamdistance: number = StreamerDistances.RACE_CP_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicRaceCPEx",
    "iffffffffaaaaiiiii",
    type,
    x,
    y,
    z,
    nextx,
    nexty,
    nextz,
    size,
    streamdistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicMapIconEx = (
  x: number,
  y: number,
  z: number,
  type: number,
  color: number,
  style = MapIconStyles.LOCAL,
  streamdistance: number = StreamerDistances.MAP_ICON_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicMapIconEx",
    "fffiiifaaaaiiiii",
    x,
    y,
    z,
    type,
    color,
    style,
    streamdistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamic3DTextLabelEx = (
  text: string,
  color: number,
  x: number,
  y: number,
  z: number,
  drawdistance: number,
  attachedplayer = 0xffff,
  attachedvehicle = 0xffff,
  testlos = false,
  streamdistance: number = StreamerDistances.TEXT_3D_LABEL_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamic3DTextLabelEx",
    "siffffiiifaaaaiiiii",
    text,
    color,
    x,
    y,
    z,
    drawdistance,
    attachedplayer,
    attachedvehicle,
    testlos,
    streamdistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicCircleEx = (
  x: number,
  y: number,
  size: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicCircleEx",
    "fffaaaiii",
    x,
    y,
    size,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicCylinderEx = (
  x: number,
  y: number,
  minz: number,
  maxz: number,
  size: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicCylinderEx",
    "fffffaaaiii",
    x,
    y,
    minz,
    maxz,
    size,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicSphereEx = (
  x: number,
  y: number,
  z: number,
  size: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicSphereEx",
    "ffffaaaiii",
    x,
    y,
    z,
    size,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicRectangleEx = (
  minx: number,
  miny: number,
  maxx: number,
  maxy: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicRectangleEx",
    "ffffaaaiii",
    minx,
    miny,
    maxx,
    maxy,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicCuboidEx = (
  minx: number,
  miny: number,
  minz: number,
  maxx: number,
  maxy: number,
  maxz: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicCuboidEx",
    "ffffffaaaiii",
    minx,
    miny,
    minz,
    maxx,
    maxy,
    maxz,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicCubeEx = (
  minx: number,
  miny: number,
  minz: number,
  maxx: number,
  maxy: number,
  maxz: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicCubeEx",
    "ffffffaaaiii",
    minx,
    miny,
    minz,
    maxx,
    maxy,
    maxz,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicPolygonEx = (
  points: number[],
  minz: number = Number.MIN_VALUE,
  maxz: number = Number.MAX_VALUE,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicPolygonEx",
    "affiaaaiii",
    points,
    minz,
    maxz,
    points.length,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicActorEx = (
  modelid: number,
  x: number,
  y: number,
  z: number,
  r: number,
  invulnerable = true,
  health = 100.0,
  streamdistance: number = StreamerDistances.ACTOR_SD,
  worlds: number[] = [0],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicActorEx",
    "iffffiffaaaaiiiii",
    modelid,
    x,
    y,
    z,
    r,
    invulnerable,
    health,
    streamdistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};
