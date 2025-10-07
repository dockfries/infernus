import { npcRecordPool } from "core/utils/pools";

export class NpcRecord {
  private _filePath: string = "";
  private _id: number = -1;

  get id() {
    return this._id;
  }

  get filePath() {
    return this._filePath;
  }

  constructor(filePathOrId: string | number) {
    if (typeof filePathOrId === "string") {
      this._filePath = filePathOrId;
      this._id = samp.callNative(
        "NPC_LoadRecord",
        "s",
        this._filePath,
      ) as number;
    } else {
      this._id = filePathOrId;
    }
    if (npcRecordPool.has(this._id)) {
      return npcRecordPool.get(this._id)!;
    }
  }

  unload() {
    const ret = !!samp.callNative("NPC_UnloadRecord", "i", this._id);
    if (ret) {
      this._id = -1;
      this._filePath = "";
      npcRecordPool.delete(this._id);
    }
    return ret;
  }

  isValid() {
    return NpcRecord.isValid(this._id);
  }

  static isValid(recordId: number) {
    return !!samp.callNative("NPC_IsValidRecord", "i", recordId);
  }
  static getCount() {
    return samp.callNative("NPC_GetRecordCount", "") as number;
  }
  static unloadAll() {
    const ret = !!samp.callNative("NPC_UnloadAllRecords", "");
    if (ret) {
      npcRecordPool.clear();
    }
    return ret;
  }
  static getInstance(id: number) {
    return npcRecordPool.get(id);
  }
  static getInstances() {
    return [...npcRecordPool.values()];
  }
}
