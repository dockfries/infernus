import { defineEvent } from "../bus";

const [onInit] = defineEvent({ name: "OnGameModeInit" });
const [onExit] = defineEvent({ name: "OnGameModeExit" });

const [onIncomingConnection] = defineEvent({
  name: "OnIncomingConnection",
  beforeEach(playerId: number, ipAddress: string, port: number) {
    return { playerId, ipAddress, port };
  },
});

const [onRconCommand] = defineEvent({
  name: "OnRconCommand",
  beforeEach(cmd: string) {
    return { cmd };
  },
});

const [onRconLoginAttempt] = defineEvent({
  name: "OnRconLoginAttempt",
  beforeEach(ip: string, password: string, success: boolean) {
    return { ip, password, success };
  },
});

export const GameMode = {
  onInit,
  onExit,
  onIncomingConnection,
  onRconCommand,
  onRconLoginAttempt,
};
