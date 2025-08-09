export class FCNPCMovePath {
  id = -1;
  constructor() {}
  create() {
    this.id = samp.callNative("FCNPC_CreateMovePath", "");
    return this;
  }
  destroy() {
    return !!samp.callNative("FCNPC_DestroyMovePath", "i", this.id);
  }
  isValid() {
    return !!samp.callNative("FCNPC_IsValidMovePath", "i", this.id);
  }
  addPoint(x: number, y: number, z: number): number {
    return samp.callNative(
      "FCNPC_AddPointToMovePath",
      "ifff",
      this.id,
      x,
      y,
      z,
    );
  }
  // idk whether two-dimensional arrays can work.
  // If it doesn't work, manually forEach addPoint?
  // fcnpc source is just to help you make a loop
  addPoints(points: [number, number, number][]): number {
    return samp.callNative(
      "FCNPC_AddPointsToMovePath",
      "iai",
      this.id,
      points,
      points.length,
    );
  }
  // ibid
  addPoints2(pointsX: number[], pointsY: number[], pointsZ: number[]): number {
    if (pointsX.length !== pointsY.length || pointsX.length !== pointsZ.length)
      return 0;
    return samp.callNative(
      "FCNPC_AddPointsToMovePath2",
      "iaaai",
      this.id,
      pointsX,
      pointsY,
      pointsZ,
      pointsX.length,
    );
  }
  removePoint(pointId: number) {
    return !!samp.callNative(
      "FCNPC_RemovePointFromMovePath",
      "ii",
      this.id,
      pointId,
    );
  }
  isValidPoint(pointId: number) {
    return !!samp.callNative(
      "FCNPC_IsValidMovePathPoint",
      "ii",
      this.id,
      pointId,
    );
  }
  getPoint(pointId: number) {
    const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
      "FCNPC_GetMovePathPoint",
      "iiFFF",
      this.id,
      pointId,
      0,
      0,
      0,
    );
    return { x, y, z, ret };
  }
  getNumberOfPoints(): number {
    return samp.callNative("FCNPC_GetNumberMovePathPoint", "i", this.id);
  }
}
