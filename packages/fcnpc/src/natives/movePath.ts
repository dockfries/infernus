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
  addPoints(points: [number, number, number][]): number[] {
    const results: number[] = [];
    points.forEach((point) => {
      const result = this.addPoint(point[0], point[1], point[2]);
      results.push(result);
    });
    return results;
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
