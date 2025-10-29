import type { Player } from "@infernus/core";

export const SampVoice = Object.freeze({
  debug(mode: boolean) {
    samp.callNative("SvDebug", "i", +mode);
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
});
