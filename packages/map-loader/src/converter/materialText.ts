import {
  ObjectMaterialAlignmentEnum,
  ObjectMaterialTextSizeEnum,
} from "@infernus/core";
import { ensureLength } from "../utils/error";

export function materialTextConverter(line: string) {
  const funcMatch = line.match(/^.*Set(Dynamic)?ObjectMaterialText\(/);

  if (!funcMatch) throw new Error("");

  const params = line
    .replace(/^.*Set(Dynamic)?ObjectMaterialText\(|\);\s*(\w+)?/g, "")
    .split(",")
    .map((param) => param.trim().replace(/"/g, ""));

  ensureLength("materialTextConverter", params, 9, params.length);

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    objectId,
    text,
    materialIndex,
    materialSize,
    fontFace,
    bold,
    fontColor,
    backColor,
    textAlignment = ObjectMaterialAlignmentEnum.LEFT,
  ] = params;

  const ENUM_VALUE = {
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

  let _materialSize = +materialSize;

  if (materialSize in ENUM_VALUE) {
    _materialSize =
      ENUM_VALUE[materialSize as unknown as keyof typeof ENUM_VALUE];
  }

  let _textAlignment = +textAlignment;

  if (textAlignment in ENUM_VALUE) {
    _textAlignment =
      ENUM_VALUE[textAlignment as unknown as keyof typeof ENUM_VALUE];
  }

  return {
    text,
    materialIndex: +materialIndex,
    materialSize: _materialSize,
    fontFace,
    bold: Boolean(bold),
    fontColor,
    backColor,
    textAlignment: _textAlignment,
  };
}
