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

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  destroy(): this {
    const ret = samp.callNative("DestroyPath", "i", this.pathId);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return this;
  }

  isValid() {
    const ret = samp.callNative("IsValidPath", "i", this.pathId);
    return !!ret;
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  getSize(): number {
    const [size, ret]: number[] = samp.callNative("GetPathSize", "iI", this.pathId);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return size;
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  getLength(): number {
    const [length, ret]: number[] = samp.callNative("GetPathLength", "iF", this.pathId);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return length;
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  getNode(index: number): MapNode {
    const [nodeId, ret]: number[] = samp.callNative("GetPathNode", "iiI", this.pathId, index);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return new MapNode(nodeId);
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  getNodeIndex(node: MapNode): number {
    const [index, ret]: number[] = samp.callNative(
      "GetPathNodeIndex",
      "iiI",
      this.pathId,
      node.nodeId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return index;
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  static findSync(node: MapNode, target: MapNode): GpsPath {
    const [pathId, ret]: number[] = samp.callNative("FindPath", "iiI", node.nodeId, target.nodeId);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return new GpsPath(pathId);
  }

  // need polyfill support async
  static find(node: MapNode, target: MapNode): Promise<GpsPath> {
    return new Promise<GpsPath>((resolve, reject) => {
      const taskId = randomTaskId();
      const ret = samp.callPublic("FindPathAsync", "iii", node.nodeId, target.nodeId, taskId);

      if (ret !== GpsError.None) {
        return reject(new GpsException(ret));
      }

      let isOffExit = false;

      const offExit = GameMode.onExit(({ next }) => {
        const ret = next();
        offExit();
        isOffExit = true;
        if (taskIdQueue.has(taskId)) {
          taskIdQueue.delete(taskId);
        }
        reject(new GpsException(GpsError.Internal));
        return ret;
      });

      const offTask = onFindPathResponse(({ path, task, next }) => {
        if (task === taskId) {
          if (!isOffExit) {
            offExit();
          }
          const ret = next();
          offTask();
          if (taskIdQueue.has(taskId)) {
            taskIdQueue.delete(taskId);
          }
          resolve(new GpsPath(path));
          return ret;
        }
        return next();
      });
    });
  }
}
