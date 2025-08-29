export enum NPCPlaybackEnum {
  NONE = 1,
  DRIVER,
  ONFOOT,
}

export enum NPCRecordStatusEnum {
  NONE,
  START,
  PAUSE,
}

export enum NPCMoveTypeEnum {
  UNKNOWN = -1,
  NONE = 0,
  WALK = 1,
  JOG = 2,
  SPRINT = 3,
  DRIVE = 4,
  AUTO = 5,
}

export enum NPCEntityCheckEnum {
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

export enum NPCMoveSpeedEnum {
  AUTO = -1.0,
  WALK = 0.1552086,
  JOG = 0.56444,
  SPRINT = 0.926784,
}
