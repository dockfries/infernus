import fs from "node:fs/promises";
import { processLineByLine } from "../utils";
import { objConverter } from "./object";
import { materialConverter } from "./material";
import { materialTextConverter } from "./materialText";
import { removeBuildingConverter } from "./removeBuilding";
import { IMapConverterOptions } from "../interfaces";
import { MapLoaderError } from "../utils/error";

export async function mapConverter(options: IMapConverterOptions) {
  const { input, output } = options;

  const rl = processLineByLine(input);

  const CONVERTS = [
    [/^.*Create(Dynamic)?Object(Ex)?\(/, objConverter],
    [/^.*Set(Dynamic)?ObjectMaterial\(/, materialConverter],
    [/^.*Set(Dynamic)?ObjectMaterialText\(/, materialTextConverter],
    [/^.*RemoveBuildingForPlayer\(/, removeBuildingConverter],
  ] as const;

  let currentLine = 0;

  try {
    for await (const line of rl) {
      currentLine++;

      let funcMatched: RegExpMatchArray | null = null;

      const matched = CONVERTS.find((item) => {
        funcMatched = line.match(item[0]);
        return funcMatched;
      });

      if (!matched) {
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, converter] = matched;

      let converted = "";

      if (converter === objConverter) {
        const obj = objConverter(funcMatched!, line);
        converted = [
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
        ].join(" ");
      } else if (converter === materialConverter) {
        const mat = materialConverter(line);
        converted = [
          "mat",
          mat.index,
          mat.modelId,
          mat.textureLib,
          mat.textureName,
          mat.color,
        ].join(" ");
      } else if (converter === materialTextConverter) {
        const txt = materialTextConverter(line);
        converted = [
          "txt",
          txt.materialIndex,
          txt.materialSize,
          txt.fontFace,
          txt.materialSize,
          +txt.bold,
          txt.fontColor,
          txt.backColor,
          txt.textAlignment,
          txt.text,
        ].join(" ");
      } else if (converter === removeBuildingConverter) {
        const rmv = removeBuildingConverter(line);
        converted = [
          "rmv",
          rmv.modelId,
          rmv.centerX.toFixed(6),
          rmv.centerY.toFixed(6),
          rmv.centerZ.toFixed(6),
          rmv.radius.toFixed(2),
        ].join(" ");
      }
      converted += "\n";

      if (converted.includes("NaN")) {
        throw new MapLoaderError({
          msg: `Invalid Value Converted: NaN`,
          details: line,
        });
      }

      await fs.appendFile(output, converted);
    }
  } catch (err) {
    if (err instanceof MapLoaderError) {
      err.context.msg = `lineNo: ${currentLine} ${err.context.msg}`;
      throw new MapLoaderError(err.context);
    }

    throw err;
  }
}
