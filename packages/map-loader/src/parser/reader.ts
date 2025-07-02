import fs from "node:fs";
import readline from "node:readline";
import { DynamicObject, Player } from "@infernus/core";
import { INTERNAL_MAP } from "../constants";
import { objParser } from "./object";
import { IMapLoadOptions, InternalMapConfig } from "../interfaces";

function processLineByLine(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  return readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
}

export async function mapReader(options: IMapLoadOptions) {
  let materialObj: DynamicObject | null = null;

  let lineCount = 0;

  const rl = processLineByLine(options.filePath);

  const rmvs: InternalMapConfig["rmvs"][0] = [];
  const objects: DynamicObject[] = [];

  try {
    for await (const lineStr of rl) {
      lineCount++;
      const line = lineStr.split(" ");
      const operator = line[0];
      if (operator === "rmv") {
        // rmvParser
        rmvs.push(line);
      } else if (operator === "mat") {
        // matParser(materialObj)
        if (!materialObj) {
          throw new Error(`no object found, cannot material`);
        }
        // materialObj.setMaterial()
      } else if (operator === "txt") {
        // txtParser(materialObj)
        if (!materialObj) {
          throw new Error(`no object found, cannot materialText`);
        }
      } else {
        materialObj = objParser(line, options);
        objects.push(materialObj);
      }
    }

    let rmvIdx = -1;
    if (rmvs.length) {
      rmvIdx = INTERNAL_MAP.rmvs.push(rmvs);
    }

    Player.getInstances().forEach((p) => {
      rmvs.flat().forEach((rmv) => {
        p.removeBuilding(...rmv);
      });
    });

    return {
      objects,
      rmvs,
      rmvIdx,
    };
  } catch (err) {
    objects.forEach((obj) => {
      if (obj.isValid()) {
        obj.destroy();
      }
    });
    objects.length = 0;
    rmvs.length = 0;
    throw new Error(
      `[MapLoader]: Error -> filePath:${options.filePath} line: ${lineCount} \n` +
        JSON.stringify(err),
    );
  }
}

export function paginateMapReader() {
  // let materialObj: DynamicObject | null = null;

  return {
    read() {
      // todo parseLine
    },
    done() {
      // materialObj = null;
      // INTERNAL_MAP.loadedMaps.set(++INTERNAL_MAP.uniqId, {});
    },
  };
}
