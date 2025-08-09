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
    const ret = samp.callNative("DestroyMapNode", "i", this.nodeId);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    this.nodeId = INVALID_MAP_NODE_ID;
    return this;
  }

  isValid(): boolean {
    return !!samp.callNative("IsValidMapNode", "i", this.nodeId);
  }

  getPos() {
    const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
      "GetMapNodePos",
      "iFFF",
      this.nodeId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return { x, y, z, ret };
  }

  getConnectionCount(): number {
    const [count, ret]: number[] = samp.callNative(
      "GetMapNodeConnectionCount",
      "iI",
      this.nodeId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return count;
  }

  getDistanceBetween(second: MapNode): number {
    const [distance, ret]: number[] = samp.callNative(
      "GetDistanceBetweenMapNodes",
      "iiF",
      this.nodeId,
      second.nodeId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return distance;
  }

  getAngleBetween(second: MapNode): number {
    const [angle, ret]: number[] = samp.callNative(
      "GetAngleBetweenMapNodes",
      "iiF",
      this.nodeId,
      second.nodeId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return angle;
  }

  getDistanceFromPoint(x: number, y: number, z: number): number {
    const [distance, ret]: number[] = samp.callNative(
      "GetMapNodeDistanceFromPoint",
      "ifffF",
      this.nodeId,
      x,
      y,
      z,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return distance;
  }

  getAngleFromPoint(x: number, y: number): number {
    const [angle, ret]: number[] = samp.callNative(
      "GetMapNodeAngleFromPoint",
      "iffF",
      this.nodeId,
      x,
      y,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return angle;
  }

  getHighest(): number {
    const nodeId: number = samp.callNative("GetHighestMapNodeID", "");
    return nodeId;
  }

  getRandom(): MapNode {
    const [nodeId, ret]: number[] = samp.callNative("GetRandomMapNode", "I");
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return new MapNode(nodeId);
  }

  static getClosestToPoint(
    x: number,
    y: number,
    z: number,
    ignoredNode = INVALID_MAP_NODE_ID,
  ): MapNode {
    const [nodeId, ret]: number[] = samp.callNative(
      "GetClosestMapNodeToPoint",
      "fffIi",
      x,
      y,
      z,
      ignoredNode,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return new MapNode(nodeId);
  }

  static saveMapNodesToFile(fileName: string) {
    const ret = samp.callNative("SaveMapNodesToFile", "s", fileName);
    return !!ret;
  }
}
