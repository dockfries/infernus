import type { Player } from "@infernus/core";
import { SV_NULL } from "../constants";
import { streamPools } from "./pool";
import { SvParameterEnum } from "../enums";

export abstract class SampVoiceStream {
  private _ptr: number = SV_NULL;
  private _type: string = "";

  get ptr() {
    return this._ptr;
  }

  get type() {
    return this._type;
  }

  constructor(ptr: number, type: string) {
    if (typeof ptr !== "number") {
      throw new Error(`Invalid stream pointer: ${ptr}`);
    }
    if (streamPools.has(ptr)) {
      return streamPools.get(ptr)!;
    }
    this._ptr = ptr;
    this._type = type;
    streamPools.set(this._ptr, this);
  }

  attachListener(player: Player) {
    if (this._ptr === SV_NULL) return false;
    return !!samp.callNative(
      "SvAttachListenerToStream",
      "ii",
      this.ptr,
      player.id,
    );
  }

  hasListenerIn(player: Player) {
    if (this._ptr === SV_NULL) return false;
    return !!samp.callNative(
      "SvHasListenerInStream",
      "ii",
      this.ptr,
      player.id,
    );
  }

  detachListener(player: Player) {
    if (this._ptr === SV_NULL) return false;
    return !!samp.callNative(
      "SvDetachListenerFromStream",
      "ii",
      this.ptr,
      player.id,
    );
  }

  detachAllListeners() {
    if (this._ptr === SV_NULL) return;
    samp.callNative("SvDetachAllListenersFromStream", "i", this.ptr);
  }

  attachSpeaker(player: Player) {
    if (this._ptr === SV_NULL) return false;
    return !!samp.callNative(
      "SvAttachSpeakerToStream",
      "ii",
      this.ptr,
      player.id,
    );
  }

  hasSpeakerIn(player: Player) {
    if (this._ptr === SV_NULL) return false;
    return !!samp.callNative("SvHasSpeakerInStream", "ii", this.ptr, player.id);
  }

  detachSpeaker(player: Player) {
    if (this._ptr === SV_NULL) return false;
    return !!samp.callNative(
      "SvDetachSpeakerFromStream",
      "ii",
      this.ptr,
      player.id,
    );
  }

  detachAllSpeakers() {
    if (this._ptr === SV_NULL) return;
    samp.callNative("SvDetachAllSpeakersFromStream", "i", this.ptr);
  }

  parameterSet(parameter: SvParameterEnum, value: number) {
    if (this._ptr === SV_NULL) return;
    samp.callNative("SvStreamParameterSet", "iif", this.ptr, parameter, value);
  }

  parameterReset(parameter: SvParameterEnum) {
    if (this._ptr === SV_NULL) return;
    samp.callNative("SvStreamParameterReset", "ii", this.ptr, parameter);
  }

  parameterHas(parameter: SvParameterEnum) {
    if (this._ptr === SV_NULL) return false;
    return !!samp.callNative("SvStreamParameterHas", "ii", this.ptr, parameter);
  }

  parameterGet(parameter: SvParameterEnum) {
    if (this._ptr === SV_NULL) return 0.0;
    return samp.callNativeFloat(
      "SvStreamParameterGet",
      "ii",
      this.ptr,
      parameter,
    ) as number;
  }

  parameterSlideFromTo(
    parameter: SvParameterEnum,
    startValue: number,
    endValue: number,
    time: number,
  ) {
    if (this._ptr === SV_NULL) return;
    samp.callNative(
      "SvStreamParameterSlideFromTo",
      "iiffi",
      this.ptr,
      parameter,
      startValue,
      endValue,
      time,
    );
  }

  parameterSlideTo(parameter: SvParameterEnum, endValue: number, time: number) {
    if (this._ptr === SV_NULL) return;
    samp.callNative(
      "SvStreamParameterSlideTo",
      "iifi",
      this.ptr,
      parameter,
      endValue,
      time,
    );
  }

  parameterSlide(parameter: SvParameterEnum, deltaValue: number, time: number) {
    if (this._ptr === SV_NULL) return;
    samp.callNative(
      "SvStreamParameterSlide",
      "iifi",
      this.ptr,
      parameter,
      deltaValue,
      time,
    );
  }

  delete() {
    if (this._ptr === SV_NULL) return;
    samp.callNative("SvDeleteStream", "i", this.ptr);
    streamPools.delete(this.ptr);
    this._ptr = SV_NULL;
  }

  static getInstance(ptr: number) {
    return streamPools.get(ptr);
  }

  static getInstances(type?: string) {
    if (type) {
      return [...streamPools.values()].filter((stream) => stream.type === type);
    }
    return [...streamPools.values()];
  }
}
