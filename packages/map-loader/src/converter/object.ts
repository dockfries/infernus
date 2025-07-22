import { StreamerDistances } from "@infernus/core";
import { ensureLength } from "../utils/error";
import { paramsSplit } from "../utils";

export function objConverter(funcMatch: RegExpMatchArray, line: string) {
  let funcName = "CreateObject";

  if (funcMatch[2]) {
    funcName = "CreateDynamicObjectEx";
  } else if (funcMatch[1]) {
    funcName = "CreateDynamicObject";
  }

  const params = paramsSplit(
    line.replace(/^.*Create(Dynamic)?Object(Ex)?\(|\);\s*\/?\*?\w*.*$/g, ""),
  );

  ensureLength("objConverter", params, 7, params.length);

  if (funcName === "CreateObject") {
    const [modelId, x, y, z, rX, rY, rZ, drawDistance] = params;

    let _drawDistance = +drawDistance;

    if (!drawDistance || drawDistance === "STREAMER_OBJECT_DD") {
      _drawDistance = StreamerDistances.OBJECT_DD;
    }

    return {
      modelId: +modelId,
      x: +x,
      y: +y,
      z: +z,
      rX: +rX,
      rY: +rY,
      rZ: +rZ,
      worldId: -1,
      interiorId: -1,
      playerId: -1,
      streamerDistance: StreamerDistances.OBJECT_SD,
      drawDistance: _drawDistance,
      areaId: -1,
      priority: 0,
    };
  } else if (funcName === "CreateDynamicObject") {
    const [
      modelId,
      x,
      y,
      z,
      rX,
      rY,
      rZ,
      worldId = -1,
      interiorId = -1,
      playerId = -1,
      streamerDistance = StreamerDistances.OBJECT_SD,
      drawDistance,
      areaId = -1,
      priority = 0,
    ] = params;

    let _drawDistance = +drawDistance;

    if (!drawDistance || drawDistance === "STREAMER_OBJECT_DD") {
      _drawDistance = StreamerDistances.OBJECT_DD;
    }

    let _streamerDistance = +streamerDistance;

    if (!streamerDistance || streamerDistance === "STREAMER_OBJECT_SD") {
      _streamerDistance = StreamerDistances.OBJECT_DD;
    }

    return {
      modelId: +modelId,
      x: +x,
      y: +y,
      z: +z,
      rX: +rX,
      rY: +rY,
      rZ: +rZ,
      worldId: +worldId,
      interiorId: +interiorId,
      playerId: +playerId,
      streamerDistance: _streamerDistance,
      drawDistance: _drawDistance,
      areaId: +areaId,
      priority: +priority,
    };
  } else {
    const [
      modelId,
      x,
      y,
      z,
      rX,
      rY,
      rZ,
      streamerDistance,
      drawDistance,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      worldId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      interiorId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      playerId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      areaId,
      priority = 0,
    ] = params;

    let _drawDistance = +drawDistance;

    if (!drawDistance || drawDistance === "STREAMER_OBJECT_DD") {
      _drawDistance = StreamerDistances.OBJECT_DD;
    }

    let _streamerDistance = +streamerDistance;

    if (!streamerDistance || streamerDistance === "STREAMER_OBJECT_SD") {
      _streamerDistance = StreamerDistances.OBJECT_DD;
    }

    return {
      modelId: +modelId,
      x: +x,
      y: +y,
      z: +z,
      rX: +rX,
      rY: +rY,
      rZ: +rZ,
      worldId: -1,
      interiorId: -1,
      playerId: -1,
      streamerDistance: _streamerDistance,
      drawDistance: _drawDistance,
      areaId: -1,
      priority: +priority,
    };
  }
}
