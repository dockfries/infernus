import { INVALID_MAP_NODE_ID } from "../constants";
import { GpsError } from "../enums";
import { GpsException } from "../utils";

export class MapNode {
  constructor(public nodeId = INVALID_MAP_NODE_ID) {}

  create(x: number, y: number, z: number): this {
    const [nodeId]: number[] = samp.callNative(
      "CreateMapNode",
      "fffI",
      x,
      y,
      z,
    );
    this.nodeId = nodeId;
    return this;
  }

  destroy(): this {
    const retVal = samp.callNative("DestroyMapNode", "i", this.nodeId);
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    this.nodeId = INVALID_MAP_NODE_ID;
    return this;
  }

  isValid(): boolean {
    return !!samp.callNative("IsValidMapNode", "i", this.nodeId);
  }

  getPos() {
    const [x, y, z, retVal]: [number, number, number, number] = samp.callNative(
      "GetMapNodePos",
      "iFFF",
      this.nodeId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return { x, y, z };
  }

  getConnectionCount(): number {
    const [count, retVal]: number[] = samp.callNative(
      "GetMapNodeConnectionCount",
      "iI",
      this.nodeId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return count;
  }

  getDistanceBetween(second: MapNode): number {
    const [distance, retVal]: number[] = samp.callNative(
      "GetDistanceBetweenMapNodes",
      "iiF",
      this.nodeId,
      second.nodeId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return distance;
  }

  getAngleBetween(second: MapNode): number {
    const [angle, retVal]: number[] = samp.callNative(
      "GetAngleBetweenMapNodes",
      "iiF",
      this.nodeId,
      second.nodeId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return angle;
  }

  getDistanceFromPoint(x: number, y: number, z: number): number {
    const [distance, retVal]: number[] = samp.callNative(
      "GetMapNodeDistanceFromPoint",
      "ifffF",
      this.nodeId,
      x,
      y,
      z,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return distance;
  }

  getAngleFromPoint(x: number, y: number): number {
    const [angle, retVal]: number[] = samp.callNative(
      "GetMapNodeAngleFromPoint",
      "iffF",
      this.nodeId,
      x,
      y,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return angle;
  }

  getHighest(): number {
    const nodeId: number = samp.callNative("GetHighestMapNodeID", "");
    return nodeId;
  }

  getRandom(): MapNode {
    const [nodeId, retVal]: number[] = samp.callNative("GetRandomMapNode", "I");
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return new MapNode(nodeId);
  }

  static getClosestToPoint(
    x: number,
    y: number,
    z: number,
    ignoredNode = INVALID_MAP_NODE_ID,
  ): MapNode {
    const [nodeId, retVal]: number[] = samp.callNative(
      "GetClosestMapNodeToPoint",
      "fffIi",
      x,
      y,
      z,
      ignoredNode,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return new MapNode(nodeId);
  }

  static saveMapNodesToFile(fileName: string) {
    const ret = samp.callNative("SaveMapNodesToFile", "s", fileName);
    return !!ret;
  }
}
