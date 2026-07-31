import { INVALID_MAP_NODE_ID } from "../constants";
import { GpsError } from "../enums";
import { GpsException } from "../utils";

export class MapNode {
  constructor(public nodeId = INVALID_MAP_NODE_ID) {}

  create(x: number, y: number, z: number): this {
    const [nodeId]: number[] = samp.callNative("CreateMapNode", "fffI", x, y, z);
    this.nodeId = nodeId;
    return this;
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
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

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
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

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  getConnectionCount(): number {
    const [count, ret]: number[] = samp.callNative("GetMapNodeConnectionCount", "iI", this.nodeId);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return count;
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
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

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
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

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
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

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
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

  static getHighest(): number {
    const nodeId: number = samp.callNative("GetHighestMapNodeID", "");
    return nodeId;
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  static getRandom(): MapNode {
    const nodeId: number = samp.callNative("GetRandomMapNode", "I");
    if (nodeId === INVALID_MAP_NODE_ID) {
      throw new GpsException(GpsError.InvalidNode);
    }
    return new MapNode(nodeId);
  }

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
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

  /**
   * @throws {GpsException} When the native call fails (error code in the message).
   */
  static saveMapNodesToFile(fileName: string) {
    const ret: number = samp.callNative("SaveMapNodesToFile", "s", fileName);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return true;
  }
}
