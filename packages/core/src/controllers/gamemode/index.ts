import {
  onInit,
  onExit,
  onIncomingConnection,
  onRconCommand,
  onRconLoginAttempt,
} from "./event";

import f from "./functions";

export const GameMode = {
  onInit,
  onExit,
  onIncomingConnection,
  onRconCommand,
  onRconLoginAttempt,
  ...f,
};
