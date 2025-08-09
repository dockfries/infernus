import { INVALID_CONNECTION_ID } from "../constants";
import { GpsError } from "../enums";
import { GpsException } from "../utils";
import { MapNode } from "./node";

export class GpsConnection {
  constructor(public connectionId = INVALID_CONNECTION_ID) {}
  create(source: MapNode, target: MapNode): this {
    const [connectionId, ret]: number[] = samp.callNative(
      "CreateConnection",
      "iiI",
      source.nodeId,
      target.nodeId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    this.connectionId = connectionId;
    return this;
  }

  destroy(): this {
    const ret = samp.callNative("DestroyConnection", "i", this.connectionId);
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    this.connectionId = INVALID_CONNECTION_ID;
    return this;
  }

  getSource(): MapNode {
    const [nodeId, ret]: number[] = samp.callNative(
      "GetConnectionSource",
      "iI",
      this.connectionId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return new MapNode(nodeId);
  }

  getTarget(): MapNode {
    const [nodeId, ret]: number[] = samp.callNative(
      "GetConnectionTarget",
      "iI",
      this.connectionId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return new MapNode(nodeId);
  }

  static getMapNode(node: MapNode, index: number): GpsConnection {
    const [connectionId, ret]: number[] = samp.callNative(
      "GetMapNodeConnection",
      "iiI",
      node.nodeId,
      index,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return new GpsConnection(connectionId);
  }

  static getBetweenMapNodes(node: MapNode, target: MapNode): GpsConnection {
    const [connectionId, ret]: number[] = samp.callNative(
      "GetConnectionBetweenMapNodes",
      "iiI",
      node.nodeId,
      target.nodeId,
    );
    if (ret !== GpsError.None) {
      throw new GpsException(ret);
    }
    return new GpsConnection(connectionId);
  }
}
