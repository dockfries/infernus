import { defineEvent, GameMode } from "@infernus/core";
import { INVALID_PATH_ID } from "../constants";
import { GpsError } from "../enums";
import { GpsException } from "../utils";
import { MapNode } from "./node";

const [onFindPathResponse] = defineEvent({
  name: "OnFindPathResponse",
  identifier: "ii",
  beforeEach(path: number, task: number) {
    return { path, task };
  },
});

const taskIdQueue = new Set<number>();

function randomTaskId() {
  let taskId = null;
  while (!taskId) {
    const taskId_ = Math.ceil(Math.random() * 1024);
    if (!taskIdQueue.has(taskId_)) {
      taskId = taskId_;
      taskIdQueue.add(taskId_);
    }
  }
  return taskId;
}

export class GpsPath {
  constructor(public pathId = INVALID_PATH_ID) {}

  destroy(): this {
    const retVal = samp.callNative("DestroyPath", "i", this.pathId);
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return this;
  }

  isValid() {
    const ret = samp.callNative("IsValidPath", "i", this.pathId);
    return !!ret;
  }

  getSize(): number {
    const [size, retVal]: number[] = samp.callNative(
      "GetPathSize",
      "iI",
      this.pathId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return size;
  }

  getLength(): number {
    const [length, retVal]: number[] = samp.callNative(
      "GetPathLength",
      "iF",
      this.pathId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return length;
  }

  getNode(index: number): MapNode {
    const [nodeId, retVal]: number[] = samp.callNative(
      "GetPathNode",
      "iiI",
      this.pathId,
      index,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return new MapNode(nodeId);
  }

  getNodeIndex(node: MapNode): number {
    const [index, retVal]: number[] = samp.callNative(
      "GetPathNodeIndex",
      "iiI",
      this.pathId,
      node.nodeId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return index;
  }

  static findSync(node: MapNode, target: MapNode): GpsPath {
    const [pathId, retVal]: number[] = samp.callNative(
      "FindPath",
      "iiI",
      node.nodeId,
      target.nodeId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return new GpsPath(pathId);
  }

  // need polyfill support async
  static find(node: MapNode, target: MapNode): Promise<GpsPath> {
    return new Promise<GpsPath>((resolve, reject) => {
      const taskId = randomTaskId();
      const retVal = samp.callPublic(
        "FindPathAsync",
        "iii",
        node.nodeId,
        target.nodeId,
        taskId,
      );

      if (retVal !== GpsError.None) {
        return reject(new GpsException(retVal));
      }

      let isOffExit = false;

      const offExit = GameMode.onExit(({ next }) => {
        const retVal = next();
        offExit();
        isOffExit = true;
        if (taskIdQueue.has(taskId)) {
          taskIdQueue.delete(taskId);
        }
        reject(new GpsException(GpsError.Internal));
        return retVal;
      });

      const offTask = onFindPathResponse(({ path, task, next }) => {
        if (task === taskId) {
          if (!isOffExit) {
            offExit();
          }
          const retVal = next();
          offTask();
          if (taskIdQueue.has(taskId)) {
            taskIdQueue.delete(taskId);
          }
          resolve(new GpsPath(path));
          return retVal;
        }
        return next();
      });
    });
  }
}
