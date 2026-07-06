import type { Player } from "@infernus/core";
import { SV_CHANNELS_ALL } from "../constants";

export const SampVoice = Object.freeze({
  debug(mode: boolean) {
    samp.callNative("SvDebug", "i", +mode);
  },
  enableDebug() {
    this.debug(true);
  },
  disableDebug() {
    this.debug(false);
  },
  checkDebug() {
    return !!samp.callNative("SvCheckDebug", "");
  },
  init(bitRate: number) {
    samp.callNative("SvInit", "i", bitRate);
  },
  getVersion(player: Player) {
    return samp.callNative("SvGetVersion", "i", player.id) as number;
  },
  hasMicro(player: Player) {
    return !!samp.callNative("SvHasMicro", "i", player.id);
  },
  startRecord(player: Player) {
    return !!samp.callNative("SvStartRecord", "i", player.id);
  },
  stopRecord(player: Player) {
    return !!samp.callNative("SvStopRecord", "i", player.id);
  },
  addKey(player: Player, keyId: number) {
    return !!samp.callNative("SvAddKey", "ii", player.id, keyId);
  },
  setKeyWithChannels(player: Player, keyId: number, channels: number = SV_CHANNELS_ALL) {
    return !!samp.callNative("SvSetKeyWithChannels", "iii", player.id, keyId, channels);
  },
  hasKey(player: Player, keyId: number) {
    return !!samp.callNative("SvHasKey", "ii", player.id, keyId);
  },
  removeKey(player: Player, keyId: number) {
    return !!samp.callNative("SvRemoveKey", "ii", player.id, keyId);
  },
  removeAllKeys(player: Player) {
    samp.callNative("SvRemoveAllKeys", "i", player.id);
  },
  mutePlayerStatus(player: Player) {
    return !!samp.callNative("SvMutePlayerStatus", "i", player.id);
  },
  mutePlayerEnable(player: Player) {
    samp.callNative("SvMutePlayerEnable", "i", player.id);
  },
  mutePlayerDisable(player: Player) {
    samp.callNative("SvMutePlayerDisable", "i", player.id);
  },
  enableListener(player: Player) {
    return !!samp.callNative("SvEnableListener", "i", player.id);
  },
  disableListener(player: Player) {
    return !!samp.callNative("SvDisableListener", "i", player.id);
  },
  checkListener(player: Player) {
    return !!samp.callNative("SvCheckListener", "i", player.id);
  },
  enableSpeaker(player: Player, channelMask: number = SV_CHANNELS_ALL) {
    return !!samp.callNative("SvEnableSpeaker", "ii", player.id, channelMask);
  },
  disableSpeaker(player: Player, channelMask: number = SV_CHANNELS_ALL) {
    return !!samp.callNative("SvDisableSpeaker", "ii", player.id, channelMask);
  },
  checkSpeaker(player: Player, channelMask: number = SV_CHANNELS_ALL) {
    return !!samp.callNative("SvCheckSpeaker", "i", player.id, channelMask);
  },
});
