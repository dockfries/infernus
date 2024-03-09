import { onPause, onResume, onFpsUpdate } from "./checker";
import type { CmdBusCallback, CommandErrors } from "./command";
import {
  CmdBus,
  onCommandError,
  onCommandPerformed,
  onCommandReceived,
} from "./command";
import {
  onClickMap,
  onClickPlayer,
  onConnect,
  onDeath,
  onDisconnect,
  onEnterExitModShop,
  onFinishedDownloading,
  onGiveDamage,
  onInteriorChange,
  onKeyStateChange,
  onRequestClass,
  onRequestDownload,
  onRequestSpawn,
  onSpawn,
  onStateChange,
  onStreamIn,
  onStreamOut,
  onTakeDamage,
  onText,
  onUpdate,
} from "./event";

import { Dialog, onDialogResponse } from "./dialog";
import { onCharsetChange, onLocaleChange, onCheckResponse } from "./entity";

export { Player } from "./entity";

export const PlayerEvent = Object.freeze({
  onConnect,
  onDisconnect,
  onPause,
  onResume,
  onUpdate,
  onText,
  onEnterExitModShop,
  onClickMap,
  onClickPlayer,
  onDeath,
  onGiveDamage,
  onKeyStateChange,
  onRequestClass,
  onRequestSpawn,
  onSpawn,
  onStateChange,
  onStreamIn,
  onStreamOut,
  onTakeDamage,
  onInteriorChange,
  onRequestDownload,
  onFinishedDownloading,
  onCheckResponse,
  onCommandReceived,
  onCommandPerformed,
  onCommandError,
  onCommandText: CmdBus.on,
  offCommandText: CmdBus.off,
  onDialogResponse,
  onLocaleChange,
  onCharsetChange,
  onFpsUpdate,
});

export { Dialog };

export type { CmdBusCallback, CommandErrors };
