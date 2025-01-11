import { INVALID_CONNECTION_ID } from "../constants";
import { GpsError } from "../enums";
import { GpsException } from "../utils";
import { MapNode } from "./node";

export class GpsConnection {
  constructor(public connectionId = INVALID_CONNECTION_ID) {}
  create(source: MapNode, target: MapNode): this {
    const [connectionId, retVal]: number[] = samp.callNative(
      "CreateConnection",
      "iiI",
      source.nodeId,
      target.nodeId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    this.connectionId = connectionId;
    return this;
  }

  destroy(): this {
    const retVal = samp.callNative("DestroyConnection", "i", this.connectionId);
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    this.connectionId = INVALID_CONNECTION_ID;
    return this;
  }

  getSource(): MapNode {
    const [nodeId, retVal]: number[] = samp.callNative(
      "GetConnectionSource",
      "iI",
      this.connectionId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return new MapNode(nodeId);
  }

  getTarget(): MapNode {
    const [nodeId, retVal]: number[] = samp.callNative(
      "GetConnectionTarget",
      "iI",
      this.connectionId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return new MapNode(nodeId);
  }

  static getMapNode(node: MapNode, index: number): GpsConnection {
    const [connectionId, retVal]: number[] = samp.callNative(
      "GetMapNodeConnection",
      "iiI",
      node.nodeId,
      index,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return new GpsConnection(connectionId);
  }

  static getBetweenMapNodes(node: MapNode, target: MapNode): GpsConnection {
    const [connectionId, retVal]: number[] = samp.callNative(
      "GetConnectionBetweenMapNodes",
      "iiI",
      node.nodeId,
      target.nodeId,
    );
    if (retVal !== GpsError.None) {
      throw new GpsException(retVal);
    }
    return new GpsConnection(connectionId);
  }
}
