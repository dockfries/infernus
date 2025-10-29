import { defineEvent, Player } from "@infernus/core";

const [onPlayerActivationKeyPress] = defineEvent({
  name: "onPlayerActivationKeyPress",
  identifier: "ii",
  beforeEach(playerId: number, keyId: number) {
    return {
      player: Player.getInstance(playerId)!,
      keyId,
    };
  },
});

const [onPlayerActivationKeyRelease] = defineEvent({
  name: "onPlayerActivationKeyRelease",
  identifier: "ii",
  beforeEach(playerId: number, keyId: number) {
    return {
      player: Player.getInstance(playerId)!,
      keyId,
    };
  },
});

export const SampVoiceEvent = Object.freeze({
  onPlayerActivationKeyPress,
  onPlayerActivationKeyRelease,
});
