import { defineEvent } from "../bus";
import { I18n } from "../i18n";

export const [onInit] = defineEvent({ name: "OnGameModeInit" });
export const [onExit] = defineEvent({ name: "OnGameModeExit" });

export const [onIncomingConnection] = defineEvent({
  name: "OnIncomingConnection",
  beforeEach(playerId: number, ipAddress: string, port: number) {
    return { playerId, ipAddress, port };
  },
});

export const [onRconCommand] = defineEvent({
  name: "OnRconCommandI18n",
  identifier: "ai",
  beforeEach(buffer: number[]) {
    return { buffer, cmd: I18n.decodeFromBuf(buffer) };
  },
});

export const [onRconLoginAttempt] = defineEvent({
  name: "OnRconLoginAttemptI18n",
  identifier: "aiaii",
  beforeEach(ip: number[], password: number[], success: number) {
    return {
      ip: I18n.decodeFromBuf(ip),
      password: I18n.decodeFromBuf(password),
      success: Boolean(success),
      ipBuffer: ip,
      passwordBuffer: password,
    };
  },
});
