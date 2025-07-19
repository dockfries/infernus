import { DynamicObject, Player } from "@infernus/core";
import { INTERNAL_MAP } from "../constants";
import { objParser } from "./object";
import { IMapLoadOptions, RemoveBuildingArgs } from "../interfaces";
import { materialTextParser } from "./materialText";
import { materialParser } from "./material";
import { removeBuildingParser } from "./removeBuilding";
import { processLineByLine } from "../utils";
import { MapLoaderError } from "../utils/error";

export async function mapReader(options: IMapLoadOptions) {
  let currentLine = 0;
  let materialTarget: DynamicObject | null = null;

  const removeBuilding: RemoveBuildingArgs = [];
  const objects: DynamicObject[] = [];

  function parseLine(lineStr: string) {
    currentLine++;

    const line = lineStr.split(" ");
    const operator = line[0];
    if (operator === "rmv") {
      removeBuilding.push(removeBuildingParser(line));
    } else if (operator === "mat") {
      if (!materialTarget) {
        throw new MapLoaderError({
          msg: `parseLine: no object target, cannot material`,
        });
      }
      materialParser(materialTarget, line);
    } else if (operator === "txt") {
      if (!materialTarget) {
        throw new MapLoaderError({
          msg: `parseLine: no object target, cannot materialText`,
        });
      }
      materialTextParser(materialTarget, line, options);
    } else {
      materialTarget = objParser(line, options);
      objects.push(materialTarget);
    }
  }

  let rl: ReturnType<typeof processLineByLine> | null = null;

  try {
    const { source } = options;
    if (typeof source === "string") {
      rl = processLineByLine(source);
      for await (const lineStr of rl) {
        parseLine(lineStr);
      }
    } else {
      let isDone = false;

      while (!isDone) {
        const lines = await source(() => {
          isDone = true;
        });

        if (!lines.length) {
          isDone = true;
          break;
        }

        for (const lineStr of lines as string[]) {
          parseLine(lineStr);
        }
      }
    }

    let removeBuildingIdx = -1;
    if (removeBuilding.length) {
      removeBuildingIdx = INTERNAL_MAP.removeBuilding.push(removeBuilding);
    }

    Player.getInstances().forEach((p) => {
      removeBuilding.forEach((rmv) => {
        p.removeBuilding(...rmv);
      });
    });

    return {
      objects,
      removeBuilding,
      removeBuildingIdx,
    };
  } catch (err) {
    objects.forEach((obj) => {
      if (obj.isValid()) {
        obj.destroy();
      }
    });
    objects.length = 0;
    removeBuilding.length = 0;

    if (err instanceof MapLoaderError) {
      err.context.msg = `lineNo: ${currentLine} ${err.context.msg}`;
    }

    throw err;
  } finally {
    if (rl) {
      rl.close();
    }
  }
}
