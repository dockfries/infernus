import { defineEvent, GameMode, I18n, Player, PlayerEvent } from "@infernus/core";
import { CefBrowser } from "../entities/cef";
import { CefCreateStatusEnum, CefInitReasonEnum } from "../enums";
import { playerBrowserPool } from "../entities/pool";

PlayerEvent.onDisconnect(({ player, next }) => {
  if (playerBrowserPool.has(player)) {
    CefBrowser.getPlayerInstances(player).forEach((b) => {
      b.destroy();
    });
    playerBrowserPool.delete(player);
  }
  return next();
});

GameMode.onInit(({ next }) => {
  samp.callPublic("patchCefRegisterEvent", "");
  return next();
});

GameMode.onExit(({ next }) => {
  CefBrowser.getInstances().forEach(([, group]) => group.forEach((g) => g.destroy()));
  playerBrowserPool.clear();
  return next();
});

const [onInitialize] = defineEvent({
  name: "OnCefInitialize",
  identifier: "iiis",
  beforeEach(playerId: number, success: number, reason: CefInitReasonEnum, message: string) {
    return {
      player: Player.getInstance(playerId)!,
      success: !!success,
      reason,
      message,
    };
  },
});

const [onDownloadStart] = defineEvent({
  name: "OnCefDownloadStart",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onDownloadFinish] = defineEvent({
  name: "OnCefDownloadFinish",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onReady] = defineEvent({
  name: "OnCefReady",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onBrowserCreated] = defineEvent({
  name: "OnCefBrowserCreated",
  identifier: "iiiis",
  beforeEach(
    playerId: number,
    browserId: number,
    success: number,
    code: CefCreateStatusEnum,
    reason: string,
  ) {
    const player = Player.getInstance(playerId)!;
    return {
      player,
      browser: CefBrowser.getInstance(browserId, player)!,
      success: !!success,
      code,
      reason,
    };
  },
});

const [onPressKey] = defineEvent({
  name: "OnCefPressKey",
  identifier: "iiiiii",
  beforeEach(
    playerId: number,
    key: number,
    scanCode: number,
    modifiers: number,
    down: number,
    repeat: number,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      key,
      scanCode,
      modifiers,
      down: !!down,
      repeat: !!repeat,
    };
  },
});

const [onChatInputState] = defineEvent({
  name: "OnCefChatInputState",
  identifier: "ii",
  beforeEach(playerId: number, open: number) {
    return {
      player: Player.getInstance(playerId)!,
      open: !!open,
    };
  },
});

const [onRecv] = defineEvent({
  name: "OnSampNodeCefRecv",
  identifier: "iiai",
  isNative: false,
  beforeEach(playerId: number, browserId: number, buffer: number[]) {
    const player = Player.getInstance(playerId)!;
    return {
      player,
      browser: CefBrowser.getInstance(browserId, player)!,
      data: I18n.decodeFromBuf(buffer),
    };
  },
});

export const CefEvent = {
  onInitialize,
  onDownloadStart,
  onDownloadFinish,
  onReady,
  onBrowserCreated,
  onPressKey,
  onChatInputState,
  onRecv,
};
