import { GpsError } from "./enums";

export * from "./enums";

export class Gps {
  nodeId: number = -1;

  createMapNode(x: number, y: number, z: number): number {
    const [nodeId]: number[] = samp.callNative(
      "GPS_CreateMapNode",
      "fffI",
      x,
      y,
      z,
    );

    this.nodeId = nodeId;

    return nodeId;
  }

  destroyMapNode(nodeId: number): GpsError.InvalidNode | GpsError.None {
    const ret = samp.callNative("GPS_DestroyMapNode", "i", nodeId);

    if (!ret) return GpsError.InvalidNode;

    this.nodeId = -1;
    return GpsError.None;
  }

  isValidMapNode(nodeId: number): boolean {
    return Boolean(samp.callNative("GPS_IsValidMapNode", "i", nodeId));
  }

  getMapNodePos(nodeId: number) {
    const values: number[] = samp.callNative(
      "GPS_GetMapNodePos",
      "iFFF",
      nodeId,
    );

    if (values.length < 3) return GpsError.InvalidNode;

    const [x, y, z] = values;

    return { x, y, z };
  }

  createConnection(source: Gps, target: Gps): GpsError.InvalidNode | number {
    if (
      !this.isValidMapNode(source.nodeId) ||
      !this.isValidMapNode(target.nodeId)
    )
      return GpsError.InvalidNode;

    const [connectionId] = samp.callNative(
      "GPS_CreateConnection",
      "iiI",
      source.nodeId,
      target.nodeId,
    );

    return connectionId;
  }

  destroyConnection(
    connectionId: number,
  ): GpsError.InvalidConnection | GpsError.None {
    const ret = samp.callNative("GPS_DestroyConnection", "i", connectionId);

    if (!ret) return GpsError.InvalidConnection;

    return GpsError.None;
  }

  getConnectionSource(
    connectionId: number,
  ): GpsError.InvalidConnection | number {
    const [nodeId] = samp.callNative(
      "GPS_GetConnectionSource",
      "iI",
      connectionId,
    );

    if (!nodeId) return GpsError.InvalidConnection;

    return nodeId;
  }

  getConnectionTarget(
    connectionId: number,
  ): GpsError.InvalidConnection | number {
    const [nodeId] = samp.callNative(
      "GPS_GetConnectionTarget",
      "iI",
      connectionId,
    );

    if (!nodeId) return GpsError.InvalidConnection;

    return nodeId;
  }

  getMapNodeConnectionCount(nodeId: number): GpsError.InvalidNode | number {
    if (!this.isValidMapNode(nodeId)) return GpsError.InvalidNode;

    const [count] = samp.callNative(
      "GPS_GetMapNodeConnectionCount",
      "iI",
      nodeId,
    );

    return count;
  }

  getMapNodeConnection(
    nodeId: number,
    index: number,
  ): GpsError.InvalidNode | GpsError.InvalidNode | number {
    if (!this.isValidMapNode(nodeId)) return GpsError.InvalidNode;

    const [connectionId] = samp.callNative(
      "GPS_GetMapNodeConnection",
      "iiI",
      nodeId,
      index,
    );

    if (!connectionId) return GpsError.InvalidConnection;

    return connectionId;
  }

  getConnectionBetweenMapNodes(
    source: Gps,
    target: Gps,
  ): GpsError.InvalidNode | GpsError.InvalidConnection | number {
    if (
      !this.isValidMapNode(source.nodeId) ||
      !this.isValidMapNode(target.nodeId)
    )
      return GpsError.InvalidNode;

    const [connectionId] = samp.callNative(
      "GPS_GetConnectionBetweenMapNodes",
      "iiI",
      source.nodeId,
      target.nodeId,
    );

    if (!connectionId) return GpsError.InvalidConnection;

    return connectionId;
  }

  getDistanceBetweenMapNodes(
    first: Gps,
    second: Gps,
  ): GpsError.InvalidNode | number {
    if (
      !this.isValidMapNode(first.nodeId) ||
      !this.isValidMapNode(second.nodeId)
    )
      return GpsError.InvalidNode;

    const [distance] = samp.callNative(
      "GetDistanceBetweenMapNodes",
      "iiF",
      first.nodeId,
      second.nodeId,
    );

    return distance;
  }

  getAngleBetweenMapNodes(
    first: Gps,
    second: Gps,
  ): GpsError.InvalidNode | number {
    if (
      !this.isValidMapNode(first.nodeId) ||
      !this.isValidMapNode(second.nodeId)
    )
      return GpsError.InvalidNode;

    const [angle] = samp.callNative(
      "GPS_GetAngleBetweenMapNodes",
      "iiF",
      first.nodeId,
      second.nodeId,
    );

    return angle;
  }

  getMapNodeDistanceFromPoint(
    nodeId: number,
    x: number,
    y: number,
    z: number,
  ): GpsError.InvalidNode | number {
    if (!this.isValidMapNode(nodeId)) return GpsError.InvalidNode;

    const [distance] = samp.callNative(
      "GPS_GetMapNodeDistanceFromPoint",
      "ifffF",
      nodeId,
      x,
      y,
      z,
    );

    return distance;
  }

  getMapNodeAngleFromPoint(
    nodeId: number,
    x: number,
    y: number,
  ): GpsError.InvalidNode | number {
    if (!this.isValidMapNode(nodeId)) return GpsError.InvalidNode;

    const [angle] = samp.callNative(
      "GPS_GetMapNodeAngleFromPoint",
      "iffF",
      nodeId,
      x,
      y,
    );

    return angle;
  }

  getClosestMapNodeToPoint(
    x: number,
    y: number,
    z: number,
    ignoredNode = GpsError.InvalidNode,
  ): GpsError.InvalidNode | number {
    const [nodeId] = samp.callNative(
      "GPS_GetClosestMapNodeToPoint",
      "fffIi",
      x,
      y,
      z,
      ignoredNode,
    );

    if (!nodeId) return GpsError.InvalidNode;

    return nodeId;
  }

  getHighestMapNodeID(): number {
    return samp.callNative("GPS_GetHighestMapNodeID", "");
  }

  getRandomMapNode(): GpsError.InvalidNode | number {
    const [nodeId] = samp.callNative("GPS_GetRandomMapNode", "I");

    if (!nodeId) return GpsError.InvalidNode;

    return nodeId;
  }

  saveMapNodesToFile(fileName: string) {
    const ret = samp.callNative("GPS_SaveMapNodesToFile", "s", fileName);

    return !!ret;
  }

  findPath(
    source: Gps,
    target: Gps,
  ): GpsError.InvalidNode | GpsError.InvalidPath | number {
    if (
      !this.isValidMapNode(source.nodeId) ||
      !this.isValidMapNode(target.nodeId)
    )
      return GpsError.InvalidNode;

    const [pathId] = samp.callNative("GPS_FindPath", "iiI", source, target);

    if (!pathId) return GpsError.InvalidPath;

    return pathId;
  }

  findPathThreaded(
    source: Gps,
    target: Gps,
    callback: (...args: any[]) => void,
    format: string = "",
    ...args: any[]
  ): GpsError.InvalidNode | GpsError.InvalidPath | number {
    if (
      !this.isValidMapNode(source.nodeId) ||
      !this.isValidMapNode(target.nodeId)
    )
      return GpsError.InvalidNode;

    const [pathId] = samp.callNative(
      "GPS_FindPathThreaded",
      `iiss${format}`,
      source.nodeId,
      target.nodeId,
      callback.name,
      format,
      ...args,
    );

    if (!pathId) return GpsError.InvalidPath;

    return pathId;
  }

  isValidPath(pathId: number) {
    const ret = samp.callNative("GPS_IsValidPath", "i", pathId);

    return !!ret;
  }

  getPathSize(pathId: number): GpsError.InvalidPath | number {
    if (!this.isValidPath(pathId)) return GpsError.InvalidPath;

    const [size] = samp.callNative("GPS_GetPathSize", "iI", pathId);

    return size;
  }

  getPathNode(pathId: number, index: number): GpsError.InvalidPath | number {
    if (!this.isValidPath(pathId)) return GpsError.InvalidPath;

    const [nodeId] = samp.callNative("GPS_GetPathNode", "iiI", pathId, index);

    return nodeId;
  }

  getPathNodeIndex(
    pathId: number,
    nodeId: number,
  ): GpsError.InvalidPath | GpsError.InvalidNode | number {
    if (!this.isValidPath(pathId)) return GpsError.InvalidPath;
    if (!this.isValidMapNode(nodeId)) return GpsError.InvalidNode;

    const [index] = samp.callNative(
      "GPS_GetPathNodeIndex",
      "iiI",
      pathId,
      nodeId,
    );

    return index;
  }

  getPathLength(pathId: number): GpsError.InvalidPath | number {
    if (!this.isValidPath(pathId)) return GpsError.InvalidPath;

    const [length] = samp.callNative("GPS_GetPathLength", "iF", pathId);

    return length;
  }

  destroyPath(pathId: number): GpsError.InvalidPath | boolean {
    if (!this.isValidPath(pathId)) return GpsError.InvalidPath;

    const ret = samp.callNative("GPS_DestroyPath", "i");

    return !!ret;
  }
}
