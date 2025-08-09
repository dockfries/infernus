export class FCNPCNode {
  constructor(public readonly id: number) {}
  open() {
    return !!samp.callNative("FCNPC_OpenNode", "i", this.id);
  }
  close() {
    return !!samp.callNative("FCNPC_CloseNode", "i", this.id);
  }
  isOpen() {
    return !!samp.callNative("FCNPC_IsNodeOpen", "i", this.id);
  }
  getType(): number {
    return samp.callNative("FCNPC_GetNodeType", "i", this.id);
  }
  setPoint(pointId: number) {
    return !!samp.callNative("FCNPC_SetNodePoint", "ii", this.id, pointId);
  }
  getPointPosition(pointId: number) {
    const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
      "FCNPC_GetNodePointPosition",
      "iFFF",
      this.id,
      pointId,
    );
    return { x, y, z, ret };
  }
  getPointCount(): number {
    return samp.callNative("FCNPC_GetNodePointCount", "i", this.id);
  }
  getInfo() {
    const [vehNodes, pedNodes, naviNode, ret]: [
      number,
      number,
      number,
      number,
    ] = samp.callNative("FCNPC_GetNodeInfo", "iIII", this.id);
    return { vehNodes, pedNodes, naviNode, ret };
  }
}
