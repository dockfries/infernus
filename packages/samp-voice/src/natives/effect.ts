import { SV_NULL } from "../constants";
import { SvFilterEnum } from "../enums";
import { SampVoiceException } from "../exceptions";
import { effectPools } from "./pool";
import { SampVoiceStream } from "./stream";

export abstract class SampVoiceEffect {
  private _ptr: number = SV_NULL;

  get ptr() {
    return this._ptr;
  }

  constructor(ptr: number) {
    if (typeof ptr !== "number") {
      throw new SampVoiceException(`Invalid effect pointer: ${ptr}`);
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

  appendFilter(filter: SvFilterEnum, ...args: number[]) {
    if (this._ptr === SV_NULL) return false;
    this.checkFilter(filter, ...args);
    let paramTypes = "iiir[";
    switch (filter) {
      case SvFilterEnum.CHORUS:
        paramTypes += "ffffifi";
        break;

      case SvFilterEnum.COMPRESSOR:
        paramTypes += "ffffff";
        break;

      case SvFilterEnum.DISTORTION:
        paramTypes += "fffff";
        break;

      case SvFilterEnum.ECHO:
        paramTypes += "ffffi";
        break;

      case SvFilterEnum.FLANGER:
        paramTypes += "ffffifi";
        break;

      case SvFilterEnum.GARGLE:
        paramTypes += "ii";
        break;

      case SvFilterEnum.I3DL2REVERB:
        paramTypes += "iifffififfff";
        break;

      case SvFilterEnum.PARAMEQ:
        paramTypes += "fff";
        break;

      case SvFilterEnum.REVERB:
        paramTypes += "ffff";
        break;
    }
    paramTypes += "]";
    return !!samp.callNative("SvEffectAppendFilter", paramTypes, this._ptr, filter, ...args);
  }

  removeFilter(filter: SvFilterEnum, priority: number) {
    if (this._ptr === SV_NULL) return false;
    return !!samp.callNative("SvEffectRemoveFilter", "iii", this._ptr, filter, priority);
  }

  private checkFilter(filter: SvFilterEnum, ...args: number[]) {
    switch (filter) {
      case SvFilterEnum.CHORUS:
        if (args.length !== 8) {
          throw new SampVoiceException(
            `Invalid number of arguments for CHORUS filter: ${args.length}`,
          );
        }
        break;

      case SvFilterEnum.COMPRESSOR:
        if (args.length !== 7) {
          throw new SampVoiceException(
            `Invalid number of arguments for COMPRESSOR filter: ${args.length}`,
          );
        }
        break;

      case SvFilterEnum.DISTORTION:
        if (args.length !== 6) {
          throw new SampVoiceException(
            `Invalid number of arguments for DISTORTION filter: ${args.length}`,
          );
        }
        break;

      case SvFilterEnum.ECHO:
        if (args.length !== 6) {
          throw new SampVoiceException(
            `Invalid number of arguments for ECHO filter: ${args.length}`,
          );
        }
        break;

      case SvFilterEnum.FLANGER:
        if (args.length !== 8) {
          throw new SampVoiceException(
            `Invalid number of arguments for FLANGER filter: ${args.length}`,
          );
        }
        break;

      case SvFilterEnum.GARGLE:
        if (args.length !== 3) {
          throw new SampVoiceException(
            `Invalid number of arguments for GARGLE filter: ${args.length}`,
          );
        }
        break;

      case SvFilterEnum.I3DL2REVERB:
        if (args.length !== 13) {
          throw new SampVoiceException(
            `Invalid number of arguments for I3DL2REVERB filter: ${args.length}`,
          );
        }
        break;

      case SvFilterEnum.PARAMEQ:
        if (args.length !== 4) {
          throw new SampVoiceException(
            `Invalid number of arguments for PARAMEQ filter: ${args.length}`,
          );
        }
        break;

      case SvFilterEnum.REVERB:
        if (args.length !== 5) {
          throw new SampVoiceException(
            `Invalid number of arguments for REVERB filter: ${args.length}`,
          );
        }
        break;

      default:
        throw new SampVoiceException(`Unsupported filter: ${filter}`);
    }
  }

  static getInstance(ptr: number) {
    return effectPools.get(ptr);
  }

  static getInstances() {
    return [...effectPools.values()];
  }
}
