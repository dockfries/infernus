import { SampVoiceStream } from "./stream";

export class SampVoiceLocalStream extends SampVoiceStream {
  constructor(ptr: number, type: string) {
    super(ptr, type);
  }

  updateDistance(distance: number) {
    samp.callNative("SvUpdateDistanceForLStream", "if", this.ptr, distance);
  }

  updatePosition(x: number, y: number, z: number) {
    samp.callNative("SvUpdatePositionForLPStream", "ifff", this.ptr, x, y, z);
  }
}
