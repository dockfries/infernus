export enum FightingStylesEnum {
  NORMAL,
  BOXING,
  KUNGFU,
  KNEEHEAD,
  GRABKICK,
  ELBOW,
}

export enum MapIconStylesEnum {
  LOCAL,
  GLOBAL,
  LOCAL_CHECKPOINT,
  GLOBAL_CHECKPOINT,
}

export enum CameraCutStylesEnum {
  MOVE = 1,
  CUT,
}

export enum CameraModesEnum {
  BEHINDCAR = 3,
  FOLLOWPED = 4,
  SNIPER = 7,
  ROCKETLAUNCHER = 8,
  FIXED = 15,
  _1STPERSON = 16,
  CAM_ON_A_STRING = 18,
  BEHINDBOAT = 22,
  CAMERA = 46,
  ROCKETLAUNCHER_HS = 51,
  AIMWEAPON = 53,
  AIMWEAPON_FROMCAR = 55,
  DW_HELI_CHASE = 56,
  DW_CAM_MAN = 57,
  DW_BIRDY = 58,
  DW_PLANE_SPOTTER = 59,
  DW_PLANECAM1 = 62,
  DW_PLANECAM2 = 63,
  DW_PLANECAM3 = 64,
}

export enum SpectateModesEnum {
  NORMAL = 1,
  FIXED,
  SIDE,
}

export enum PlayerStateEnum {
  NONE,
  ONFOOT,
  DRIVER,
  PASSENGER,
  EXIT_VEHICLE,
  ENTER_VEHICLE_DRIVER,
  ENTER_VEHICLE_PASSENGER,
  WASTED,
  SPAWNED,
  SPECTATING,
}

export enum BodyPartsEnum {
  TORSO = 3,
  GROIN,
  LEFT_ARM,
  RIGHT_ARM,
  LEFT_LEG,
  RIGHT_LEG,
  HEAD,
}

export enum BoneIdsEnum {
  Spine = 1,
  Head,
  LeftUpperArm,
  RightUpperArm,
  LeftHand,
  RightHand,
  LeftThigh,
  RightThigh,
  LeftFoot,
  RightFoot,
  RightCalf,
  LeftCalf,
  LeftForearm,
  RightForearm,
  LeftClavicle,
  RightClavicle,
  Neck,
  Jaw,
}

export enum ForceSyncEnum {
  UNKNOWN = -1,
  NONE = 0,
  ALL = 1,
  OTHER = 2,
}
