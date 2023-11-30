import { defineEvent } from "../bus";

export const [onInit] = defineEvent({ name: "OnGameModeInit" });
export const [onExit] = defineEvent({ name: "OnGameModeExit" });

export const [onIncomingConnection] = defineEvent({
  name: "OnIncomingConnection",
  beforeEach(playerId: number, ipAddress: string, port: number) {
    return { playerId, ipAddress, port };
  },
});

export const [onRconCommand] = defineEvent({
  name: "OnRconCommand",
  beforeEach(cmd: string) {
    return { cmd };
  },
});

export const [onRconLoginAttempt] = defineEvent({
  name: "OnRconLoginAttempt",
  beforeEach(ip: string, password: string, success: boolean) {
    return { ip, password, success };
  },
});
