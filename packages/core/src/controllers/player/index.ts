import { onPause, onResume, onFpsUpdate, onAndroidCheck } from "./checker";
import type {
  CmdBusCallback,
  CommandErrorRet,
  CommandErrors,
  CommandErrorTypes,
  ICmdOptions,
} from "./command";
import {
  CmdBus,
  onCommandError,
  onCommandPerformed,
  onCommandReceived,
  onCommandTextRaw,
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
  onWeaponShot,
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
  onWeaponShot,
  onAndroidCheck,
  onCommandTextRaw,
});

export { Dialog };

export type { CmdBusCallback, ICmdOptions, CommandErrorTypes, CommandErrorRet };

export { CommandErrors };
