import { defineEvent } from "../bus";
import { I18n } from "../i18n";

const [onConnect] = defineEvent({
  name: "OnNpcConnect",
  beforeEach(myPlayerId: number) {
    return { myPlayerId };
  },
});

const [onDisconnect] = defineEvent({
  name: "OnNpcDisconnect",
  beforeEach(reason: string) {
    return { reason };
  },
});

const [onModeInit] = defineEvent({
  name: "OnNpcModeInit",
});

const [onModeExit] = defineEvent({
  name: "OnNpcModeExit",
});

const [onSpawn] = defineEvent({
  name: "OnNpcSpawn",
});

const [onClientMessage] = defineEvent({
  name: "OnClientMessageI18n",
  identifier: "iai",
  beforeEach(color: number, buffer: number[]) {
    return {
      color,
      buffer,
      string: I18n.decodeFromBuf(buffer, "utf8"),
    };
  },
});

export const NpcEvent = {
  onConnect,
  onDisconnect,
  onModeInit,
  onModeExit,
  onSpawn,
  onClientMessage,
};
