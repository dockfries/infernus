export enum EntityCheck {
  NONE = 0,
  PLAYER = 1,
  NPC = 2,
  ACTOR = 4,
  VEHICLE = 8,
  OBJECT = 16,
  POBJECT_ORIG = 32,
  POBJECT_TARG = 64,
  MAP = 128,
  ALL = 255,
}

export enum EntityMode {
  AUTO = -1,
  NONE = 0,
  COLANDREAS = 1,
}

export enum MoveType {
  AUTO = -1,
  WALK = 0,
  RUN = 1,
  SPRINT = 2,
  DRIVE = 3,
}

export enum MoveMode {
  AUTO = -1,
  NONE = 0,
  MAPANDREAS = 1,
  COLANDREAS = 2,
}

export enum MovePathFinding {
  AUTO = -1,
  NONE = 0,
  Z = 1,
  RAYCAST = 2,
}

export enum MoveSpeed {
  AUTO = -1.0,
  WALK = 0.1552086,
  RUN = 0.56444,
  SPRINT = 0.926784,
}
