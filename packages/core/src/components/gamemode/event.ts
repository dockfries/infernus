import { defineEvent } from "../../utils/bus";
import { I18n } from "../../utils/i18n";

export const INTERNAL_FLAGS = {
  skip: false,
};

export const [onSampGdkInit] = defineEvent({
  name: "OnGameModeInit",
  identifier: "",
});

export const [onInit, triggerOnInit] = defineEvent({
  name: "OnGameModeInitReal",
  isNative: false,
});

onSampGdkInit(() => {
  INTERNAL_FLAGS.skip = false;
  Promise.resolve().then(() => {
    if (INTERNAL_FLAGS.skip) return;
    triggerOnInit();
  });
});

export const [onExit] = defineEvent({
  name: "OnGameModeExit",
  identifier: "",
});

onExit(({ next }) => {
  INTERNAL_FLAGS.skip = true;
  return next();
});

export const [onIncomingConnection] = defineEvent({
  name: "OnIncomingConnection",
  identifier: "isi",
  defaultValue: false,
  beforeEach(playerId: number, ipAddress: string, port: number) {
    return { playerId, ipAddress, port };
  },
});

export const [onRconCommand] = defineEvent({
  name: "OnRconCommandI18n",
  identifier: "ai",
  defaultValue: false,
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
      success: !!success,
      ipBuffer: ip,
      passwordBuffer: password,
    };
  },
});
