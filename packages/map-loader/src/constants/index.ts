import {
  ObjectMaterialTextSizeEnum,
  ObjectMaterialAlignmentEnum,
} from "@infernus/core";
import { InternalMapConfig } from "../interfaces";

export const INTERNAL_MAP: InternalMapConfig = {
  removedBuilding: [],
  loadedMaps: new Map(),
};

export const INVALID_MAP_ID = -1;
export const TXT_SPACE_PLACEHOLDER = "putafuckingspacehere";
export const FONT_SPACE_PLACEHOLDER = "_";
export const NEWLINE_PLACEHOLDER = "~N~";
export const MAT_SIZE_VALUE = {
  OBJECT_MATERIAL_SIZE_32x32: ObjectMaterialTextSizeEnum._32x32,
  OBJECT_MATERIAL_SIZE_64x32: ObjectMaterialTextSizeEnum._64x32,
  OBJECT_MATERIAL_SIZE_64x64: ObjectMaterialTextSizeEnum._64x64,
  OBJECT_MATERIAL_SIZE_128x32: ObjectMaterialTextSizeEnum._128x32,
  OBJECT_MATERIAL_SIZE_128x64: ObjectMaterialTextSizeEnum._128x64,
  OBJECT_MATERIAL_SIZE_128x128: ObjectMaterialTextSizeEnum._128x128,
  OBJECT_MATERIAL_SIZE_256x32: ObjectMaterialTextSizeEnum._256x32,
  OBJECT_MATERIAL_SIZE_256x64: ObjectMaterialTextSizeEnum._256x64,
  OBJECT_MATERIAL_SIZE_256x128: ObjectMaterialTextSizeEnum._256x128,
  OBJECT_MATERIAL_SIZE_256x256: ObjectMaterialTextSizeEnum._256x256,
  OBJECT_MATERIAL_SIZE_512x64: ObjectMaterialTextSizeEnum._512x64,
  OBJECT_MATERIAL_SIZE_512x128: ObjectMaterialTextSizeEnum._512x128,
  OBJECT_MATERIAL_SIZE_512x256: ObjectMaterialTextSizeEnum._512x256,
  OBJECT_MATERIAL_SIZE_512x512: ObjectMaterialTextSizeEnum._512x512,
  OBJECT_MATERIAL_TEXT_ALIGN_LEFT: ObjectMaterialAlignmentEnum.LEFT,
  OBJECT_MATERIAL_TEXT_ALIGN_CENTER: ObjectMaterialAlignmentEnum.CENTER,
  OBJECT_MATERIAL_TEXT_ALIGN_RIGHT: ObjectMaterialAlignmentEnum.RIGHT,
};
