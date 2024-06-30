import type { DynamicObject, KeysEnum } from "@infernus/core";
import type { CameraMode } from "../enums";

// Enumeration for storing data about the player
export interface NoClipOptions {
  cameraMode: CameraMode;
  flyObject?: DynamicObject;
  mode: number;
  lrOld: KeysEnum;
  udOld: KeysEnum;
  lastMove: number;
  accelMul: number;
}
