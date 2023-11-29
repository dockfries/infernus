import {
  CmdBus,
  CmdBusCallback,
  CommandErrors,
  onCommandError,
  onCommandPerformed,
  onCommandReceived,
} from "./command";
import { onConnect, onDisconnect, onPause } from "./event";

export { Player } from "./entity";

export const PlayerEvent = {
  onConnect,
  onDisconnect,
  onPause,
  onCommandReceived,
  onCommandPerformed,
  onCommandError,
  CommandErrors,
};

export { CmdBus, CmdBusCallback };
