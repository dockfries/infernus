/* eslint-disable prefer-const */
import fs from "node:fs";
import {
  E_STREAMER,
  Streamer,
  StreamerItemTypes,
  DynamicObject,
} from "@infernus/core";
import {
  FONT_SPACE_PLACEHOLDER,
  NEWLINE_PLACEHOLDER,
  TXT_SPACE_PLACEHOLDER,
} from "../constants";
import { IMapExporterOptions } from "../interfaces";
import { formatHex, replaceTexture } from "../utils";

export async function mapExporter(options: IMapExporterOptions) {
  const { output, removeOutput } = options;

  if (removeOutput !== false && fs.existsSync(output)) {
    fs.unlinkSync(output);
  }

  const ws = fs.createWriteStream(output, { flags: "a" });

  try {
    const upperBound = Streamer.getUpperBound(StreamerItemTypes.OBJECT);

    for (let i = 1; i <= upperBound; i++) {
      if (!DynamicObject.isValid(i)) continue;

      const model = Streamer.getIntData(
        StreamerItemTypes.OBJECT,
        i,
        E_STREAMER.MODEL_ID,
      );
      const world = Streamer.getIntData(
        StreamerItemTypes.OBJECT,
        i,
        E_STREAMER.WORLD_ID,
      );

      const obj = new DynamicObject(i);

      const { x, y, z } = obj.getPos();
      const { rx, ry, rz } = obj.getRot();

      const objOutput: string =
        [
          model,
          x.toFixed(6),
          y.toFixed(6),
          z.toFixed(6),
          rx.toFixed(6),
          ry.toFixed(6),
          rz.toFixed(6),
          world,
        ].join(" ") + "\n";
      const matArr: string[] = [];
      const txtArr: string[] = [];

      for (let idx = 0; idx < 15; idx++) {
        if (obj.isMaterialUsed(idx)) {
          let { modelId, materialColor, txdName, textureName } =
            obj.getMaterial(idx);

          const replaced = replaceTexture(modelId, txdName, textureName);
          modelId = replaced.modelId;
          txdName = replaced.textureLib;
          textureName = replaced.textureName;

          if (textureName.includes(" ")) {
            textureName = textureName.replaceAll(" ", TXT_SPACE_PLACEHOLDER);
          }

          matArr.push(
            [
              "mat",
              idx,
              modelId,
              txdName,
              textureName,
              formatHex(materialColor, 8),
            ].join(" "),
          );
        }
      }

      for (let idx = 0; idx < 15; idx++) {
        if (obj.isMaterialTextUsed(idx)) {
          let {
            text,
            materialSize,
            fontFace,
            fontSize,
            bold,
            fontColor,
            backColor,
            textAlignment,
          } = obj.getMaterialText(idx);

          text = text.replace(/\n|\\n/g, NEWLINE_PLACEHOLDER);
          fontFace = fontFace.replaceAll(" ", FONT_SPACE_PLACEHOLDER);

          txtArr.push(
            [
              "txt",
              idx,
              materialSize,
              fontFace,
              fontSize,
              bold,
              formatHex(fontColor),
              formatHex(backColor, 8),
              textAlignment,
              text,
            ].join(" "),
          );
        }
      }

      const matOutput = matArr.join("\n");
      const txtOutput = txtArr.join("\n");

      const converted =
        objOutput +
        matOutput +
        (matArr.length ? "\n" : "") +
        txtOutput +
        (txtArr.length ? "\n" : "");

      if (!ws.write(converted)) {
        await new Promise<void>((resolve) => ws.once("drain", resolve));
      }
    }
  } finally {
    await new Promise<void>((resolve, reject) => {
      ws.once("error", reject);
      ws.once("finish", resolve);
      ws.once("close", resolve);
      ws.end();
    });
  }
}
