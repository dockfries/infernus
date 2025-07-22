import fs from "node:fs";
import { formatHex, isSamePath, processLineByLine } from "../utils";
import { objConverter } from "./object";
import { materialConverter } from "./material";
import { materialTextConverter } from "./materialText";
import { removeBuildingConverter } from "./removeBuilding";
import { IMapConverterOptions } from "../interfaces";
import { MapLoaderError } from "../utils/error";
import assert from "node:assert";

export async function mapConverter(options: IMapConverterOptions) {
  const { input, output, removeOutput } = options;

  assert(!isSamePath(input, output));

  const rl = processLineByLine(input);

  if (removeOutput !== false && fs.existsSync(output)) {
    fs.unlinkSync(output);
  }

  const ws = fs.createWriteStream(output, { flags: "a" });

  const CONVERTS = [
    /^.*Create(Dynamic)?Object(Ex)?\(/,
    /^.*Set(Dynamic)?ObjectMaterial\(/,
    /^.*Set(Dynamic)?ObjectMaterialText\(/,
    /^.*RemoveBuildingForPlayer\(/,
  ] as const;

  let currentLine = 0;

  try {
    for await (const line of rl) {
      currentLine++;

      let funcMatched: RegExpMatchArray | null = null;

      const matchedIdx = CONVERTS.findIndex((reg) => {
        funcMatched = line.match(reg);
        return funcMatched;
      });

      if (matchedIdx === -1) {
        continue;
      }

      let convertedArr: (string | number)[] = [];

      if (matchedIdx === 0) {
        const obj = objConverter(funcMatched!, line);
        convertedArr = [
          obj.modelId,
          obj.x.toFixed(6),
          obj.y.toFixed(6),
          obj.z.toFixed(6),
          obj.rX.toFixed(6),
          obj.rY.toFixed(6),
          obj.rZ.toFixed(6),
          obj.worldId,
          obj.interiorId,
          obj.playerId,
          obj.streamerDistance.toFixed(6),
          obj.drawDistance.toFixed(6),
          obj.areaId,
          obj.priority,
        ];
      } else if (matchedIdx === 1) {
        const mat = materialConverter(line);
        convertedArr = [
          "mat",
          mat.index,
          mat.modelId,
          mat.textureLib,
          mat.textureName,
          formatHex(mat.color, 8),
        ];
      } else if (matchedIdx === 2) {
        const txt = materialTextConverter(funcMatched!, line);
        convertedArr = [
          "txt",
          txt.materialIndex,
          txt.materialSize,
          txt.fontFace,
          txt.fontSize,
          +txt.bold,
          formatHex(+txt.fontColor),
          formatHex(+txt.backColor, 8),
          txt.textAlignment,
          txt.text,
        ];
      } else if (matchedIdx === 3) {
        const rmv = removeBuildingConverter(line);
        convertedArr = [
          "rmv",
          rmv.modelId,
          rmv.centerX.toFixed(6),
          rmv.centerY.toFixed(6),
          rmv.centerZ.toFixed(6),
          rmv.radius.toFixed(2),
        ];
      }

      if (convertedArr.some((val) => Number.isNaN(val) || val === "NaN")) {
        throw new MapLoaderError({
          msg: `Invalid Value Converted: NaN`,
          details: line,
        });
      }

      const converted = convertedArr.join(" ") + "\n";

      if (!ws.write(converted)) {
        await new Promise<void>((resolve) => ws.once("drain", resolve));
      }
    }
  } catch (err) {
    if (err instanceof MapLoaderError) {
      err.context.msg = `lineNo: ${currentLine} ${err.context.msg}`;
      throw new MapLoaderError(err.context);
    }

    throw err;
  } finally {
    await new Promise<void>((resolve, reject) => {
      ws.once("error", reject);
      ws.once("finish", resolve);
      ws.once("close", resolve);
      ws.end();
    });
  }
}
