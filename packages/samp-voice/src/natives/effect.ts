import { SV_NULL } from "../constants";
import { effectPools } from "./pool";
import { SampVoiceStream } from "./stream";

export abstract class SampVoiceEffect {
  private _ptr: number = SV_NULL;

  get ptr() {
    return this._ptr;
  }

  constructor(ptr: number) {
    if (typeof ptr !== "number") {
      throw new Error(`Invalid effect pointer: ${ptr}`);
    }
    if (effectPools.has(ptr)) {
      return effectPools.get(ptr)!;
    }
    this._ptr = ptr;
  }

  attachStream(stream: SampVoiceStream) {
    if (this._ptr === SV_NULL) return;
    samp.callNative("SvEffectAttachStream", "ii", this._ptr, stream);
  }

  detachStream(stream: SampVoiceStream) {
    if (this._ptr === SV_NULL) return;
    samp.callNative("SvEffectDetachStream", "ii", this._ptr, stream);
  }

  delete() {
    if (this._ptr === SV_NULL) return;
    samp.callNative("SvEffectDelete", "i", this._ptr);
    effectPools.delete(this._ptr);
    this._ptr = SV_NULL;
  }

  static getInstance(ptr: number) {
    return effectPools.get(ptr);
  }

  static getInstances() {
    return [...effectPools.values()];
  }
}
