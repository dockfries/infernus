import { SV_NULL } from "../constants";
import { SampVoiceStream } from "./stream";

export class SampVoiceGlobalStream extends SampVoiceStream {
  constructor(color: number = SV_NULL, name: string) {
    super(
      samp.callNative("SvCreateGStream", "is", color, name),
      SampVoiceGlobalStream.name,
    );
  }
}
