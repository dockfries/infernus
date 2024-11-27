import { IFilterScript } from "@infernus/core";

export interface I_OBJECT {
  OBJ_MOD: number;
  OBJ_MDL: number;
  OBJ_X: number;
  OBJ_Y: number;
  OBJ_Z: number;
  OBJ_RX: number;
  OBJ_RY: number;
  OBJ_RZ: number;
}

export interface I_OBJ_RATE {
  OBJ_RATE_ROT: number;
  OBJ_RATE_MOVE: number;
}

export interface P_CAMERA_D {
  MODE: number;
  RATE: number;
  POS_X: number;
  POS_Y: number;
  POS_Z: number;
  LOOK_X: number;
  LOOK_Y: number;
  LOOK_Z: number;
}
export interface CUR_VEHICLE {
  spawn: boolean;
  vModel: number;
  vInt: number;
}

export interface IFsDebugOptions {
  skinSelect?: boolean;
  vehicleSelect?: boolean;
  worldSelect?: boolean;
  cameraSelect?: boolean;
  objectSelect?: boolean;
  miscCommands?: boolean;
  adminsOnly?: boolean;
}

export interface IFsDebug extends IFilterScript {
  load(options?: IFsDebugOptions): ReturnType<IFilterScript["load"]>;
}
