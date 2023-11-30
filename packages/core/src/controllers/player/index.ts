import { onPause, onResume } from "./checker";
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
import { onCheckResponse } from "./entity";

export { Player } from "./entity";

export const PlayerEvent = {
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
  onDialogResponse,
};

export { CmdBus, Dialog };

export type { CmdBusCallback, CommandErrors };
