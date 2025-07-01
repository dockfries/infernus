import qrcode from "qrcode-generator";
import { DynamicObject, type IDynamicCommon } from "@infernus/core";

export interface IQRMaterial {
  charset: string;
  materialIndex: number;
  materialSize: number;
  fontSize: number;
  bold: number;
  fontColor: string | number;
  backColor: string | number;
  textAlignment: number;
}

export interface IQRObject extends IDynamicCommon {
  modelId?: number;
  charset?: string;
  rx?: number;
  ry?: number;
  rz?: number;
  drawDistance?: number;
}

export type TypeNumber =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

const DEFAULT_MATERIAL = {
  charset: "",
  materialSize: 100,
  materialIndex: 0,
  fontSize: 6,
  bold: 1,
  fontColor: 0xffffffff,
  backColor: 0xff000000,
  textAlignment: 1,
} as const;

export function generateQRText(
  text: string,
  typeNumber: TypeNumber = 0,
  errorCorrectionLevel: ErrorCorrectionLevel = "L",
): string {
  if (!text.trim()) throw new Error("Text cannot be empty");

  const qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(text);
  qr.make();

  const QRLines = qr.createASCII().split("\n");

  return QRLines.map((line, index) => {
    const lineParts: [string[], string[]] = [[], []];

    for (let i = 0; i < line.length; i++) {
      const char = line.charAt(i);
      switch (char) {
        case "█":
          lineParts[0].push("g");
          lineParts[1].push("g");
          break;
        case "▄":
          lineParts[0].push("c");
          lineParts[1].push("g");
          break;
        case "▀":
          lineParts[0].push("g");
          lineParts[1].push(index < QRLines.length - 1 ? "c" : "");
          break;
        default:
          lineParts[0].push("c");
          lineParts[1].push("c");
      }
    }

    return lineParts[0].join("") + "\n" + lineParts[1].join("");
  }).join("\n");
}

export function createQRObject(
  qrText: string,
  object: IQRObject,
  material: Partial<IQRMaterial> = {},
): DynamicObject {
  const {
    modelId = 19371,
    x,
    y,
    z,
    rx = 0,
    ry = 0,
    rz = 0,
    drawDistance,
    playerId,
  } = object;

  const obj = new DynamicObject({
    modelId,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    drawDistance,
    playerId,
  }).create();

  return setObjectQRMaterial(obj, qrText, material);
}

export function setObjectQRMaterial(
  obj: DynamicObject,
  qrText: string,
  material: Partial<IQRMaterial> = {},
): DynamicObject {
  const param = { ...DEFAULT_MATERIAL, ...material };
  obj.setMaterialText(
    param.charset,
    param.materialIndex,
    qrText,
    param.materialSize,
    "Webdings",
    param.fontSize,
    param.bold,
    param.fontColor,
    param.backColor,
    param.textAlignment,
  );
  return obj;
}
