import { I18n, InvalidEnum, ObjectMp, Player } from "@infernus/core";
import { CefBrowserSourceInfo } from "../interfaces";
import { CefException } from "../exceptions";
import { INVALID_CEF_ID } from "../constants";
import { CefAudioModeEnum, CefCreateStatusEnum, CefHudComponentEnum } from "../enums";
import { playerBrowserPool } from "./pool";

const MAX_CEF_ID = 65536;

function generateId() {
  const used = new Set<number>();

  for (const map of playerBrowserPool.values()) {
    for (const key of map.keys()) {
      used.add(key);
    }
  }

  if (used.size >= MAX_CEF_ID) {
    return INVALID_CEF_ID;
  }

  let id: number;
  do {
    id = Math.floor(Math.random() * MAX_CEF_ID);
  } while (used.has(id));

  return id;
}

export class CefBrowser {
  private sourceInfo: CefBrowserSourceInfo;
  private browserId: number = INVALID_CEF_ID;

  constructor(browserOptions: CefBrowserSourceInfo) {
    this.sourceInfo = browserOptions;
  }

  create() {
    if (this.isValid()) {
      throw new CefException("Browser is already created");
    }

    let ret: CefCreateStatusEnum;

    const { type, player, url, height = 0.0, width = 0.0 } = this.sourceInfo;

    const browserId = generateId();
    if (browserId === INVALID_CEF_ID) {
      throw new CefException("Failed to generate browser id");
    }

    if (type === "2dPlayer") {
      const { focused, controlsChat = true } = this.sourceInfo;
      ret = samp.callNative(
        "CEF_CreateBrowser",
        "iisiiff",
        player.id,
        browserId,
        url,
        focused,
        controlsChat,
        width,
        height,
      ) as CefCreateStatusEnum;
    } else if (type === "3dWorld") {
      const { textureName } = this.sourceInfo;
      ret = samp.callNative(
        "CEF_CreateWorldBrowser",
        "iissff",
        player.id,
        browserId,
        url,
        textureName,
        width,
        height,
      ) as CefCreateStatusEnum;
    } else {
      const { worldX, worldY, worldZ, offsetZ = 0.0, pivotX = 0.0, pivotY = 0.0 } = this.sourceInfo;
      ret = samp.callNative(
        "CEF_CreateWorld2DBrowser",
        "iisffffffff",
        player.id,
        browserId,
        url,
        worldX,
        worldY,
        worldZ,
        width,
        height,
        offsetZ,
        pivotX,
        pivotY,
      ) as CefCreateStatusEnum;
    }

    if (ret !== CefCreateStatusEnum.SUCCESS) {
      throw new CefException(`Failed to create browser with ret: ${ret}`);
    }

    this.browserId = browserId;

    if (!playerBrowserPool.has(player)) {
      playerBrowserPool.set(player, new Map<number, CefBrowser>());
    }
    playerBrowserPool.get(player)!.set(this.browserId, this);
  }

  setPos() {
    this.throwIfInvalid();

    if (this.sourceInfo.type !== "2dWorld") {
      throw new CefException("setPos can only be used with World2DBrowser");
    }

    const { player, worldX, worldY, worldZ } = this.sourceInfo;
    return samp.callNative(
      "CEF_SetWorld2DBrowserPos",
      "iifff",
      player.id,
      this.browserId,
      worldX,
      worldY,
      worldZ,
    ) as number;
  }

  setVisible(visible: boolean) {
    this.throwIfInvalid();
    return samp.callNative(
      "CEF_SetBrowserVisible",
      "iii",
      this.sourceInfo.player.id,
      this.browserId,
      visible,
    ) as number;
  }

  destroy() {
    this.throwIfInvalid();

    const { browserId } = this;
    const group = playerBrowserPool.get(this.sourceInfo.player);
    if (!group) return 0;
    group.delete(browserId);

    if (group.size === 0) {
      playerBrowserPool.delete(this.sourceInfo.player);
    }

    const ret = samp.callNative(
      "CEF_DestroyBrowser",
      "ii",
      this.sourceInfo.player.id,
      this.browserId,
    ) as number;

    this.browserId = INVALID_CEF_ID;

    return ret;
  }

  emitEvent(eventName: string, data: any) {
    this.throwIfInvalid();

    const buf = I18n.encodeToBuf(JSON.stringify(data), "utf8");

    return samp.callPublic(
      "patchCefEmitEvent",
      "iisa",
      this.sourceInfo.player.id,
      this.browserId,
      eventName,
      buf,
    ) as number;
  }

  reloadBrowser(ignoreCache = false) {
    this.throwIfInvalid();
    return samp.callNative(
      "CEF_ReloadBrowser",
      "iii",
      this.sourceInfo.player.id,
      this.browserId,
      ignoreCache,
    ) as number;
  }

  focusBrowser(focused: boolean) {
    this.throwIfInvalid();
    return samp.callNative(
      "CEF_FocusBrowser",
      "iii",
      this.sourceInfo.player.id,
      this.browserId,
      focused,
    ) as number;
  }

  enableDevTools(enabled: boolean) {
    this.throwIfInvalid();
    return samp.callNative(
      "CEF_EnableDevTools",
      "iii",
      this.sourceInfo.player.id,
      this.browserId,
      enabled,
    ) as number;
  }

  attachToObject(object: ObjectMp) {
    this.throwIfInvalid();
    if (!object.isValid()) {
      throw new CefException("Object is not valid");
    }
    if (!object.isGlobal()) {
      throw new CefException("Object is not global");
    }
    return samp.callNative(
      "CEF_AttachBrowserToObject",
      "iii",
      this.sourceInfo.player.id,
      this.browserId,
      object.id,
    ) as number;
  }

  detachFromObject(object: ObjectMp) {
    this.throwIfInvalid();
    if (!object.isValid()) {
      throw new CefException("Object is not valid");
    }
    if (!object.isGlobal()) {
      throw new CefException("Object is not global");
    }
    return samp.callNative(
      "CEF_DetachBrowserFromObject",
      "iii",
      this.sourceInfo.player.id,
      this.browserId,
      object.id,
    ) as number;
  }

  setMuted(mute: boolean) {
    this.throwIfInvalid();
    return samp.callNative(
      "CEF_SetBrowserMuted",
      "iii",
      this.sourceInfo.player.id,
      this.browserId,
      mute,
    ) as number;
  }

  setAudioMode(mode: CefAudioModeEnum) {
    this.throwIfInvalid();
    return samp.callNative(
      "CEF_SetBrowserAudioMode",
      "iii",
      this.sourceInfo.player.id,
      this.browserId,
      mode,
    ) as number;
  }

  setAudioSettings(maxDistance: number, referenceDistance: number) {
    this.throwIfInvalid();
    return samp.callNative(
      "CEF_SetBrowserAudioSettings",
      "iiff",
      this.sourceInfo.player.id,
      this.browserId,
      maxDistance,
      referenceDistance,
    ) as number;
  }

  getId() {
    return this.browserId;
  }

  getType() {
    return this.sourceInfo.type;
  }

  getWidth() {
    return this.sourceInfo.width;
  }

  getHeight() {
    return this.sourceInfo.height;
  }

  getPlayer() {
    return this.sourceInfo.player;
  }

  getUrl() {
    return this.sourceInfo.url;
  }

  isValid() {
    return CefBrowser.isValid(this.sourceInfo.player, this.browserId);
  }

  private throwIfInvalid(message?: string) {
    if (!this.isValid()) {
      throw new CefException(message || "Browser is not created");
    }
  }

  static isValid(player: Player, browserId: number) {
    const playerPool = playerBrowserPool.get(player);
    if (!playerPool) return false;
    return playerPool.has(browserId);
  }

  static hasPlugin(player: Player) {
    return !!samp.callNative("CEF_PlayerHasPlugin", "i", player.id);
  }

  static addResource(resourceName: string) {
    samp.callNative("CEF_AddResource", "s", resourceName);
  }

  static toggleHudComponent(player: Player, componentId: CefHudComponentEnum, toggle: boolean) {
    return samp.callNative(
      "CEF_ToggleHudComponent",
      "iii",
      player.id,
      componentId,
      toggle,
    ) as number;
  }

  static toggleSpawnScreen(player: Player, toggle: boolean) {
    return samp.callNative("CEF_ToggleSpawnScreen", "ii", player.id, toggle) as number;
  }

  static clearChat(player: Player) {
    return samp.callNative("CEF_ClearChat", "i", player.id) as number;
  }

  static toggleChatInput(player: Player, toggle: boolean) {
    return samp.callNative("CEF_ToggleChatInput", "ii", player.id, toggle) as number;
  }

  static isChatInputOpen(player: Player) {
    return !!samp.callNative("CEF_IsChatInputOpen", "i", player.id);
  }

  static enableKey(player: Player, key: number, enabled: boolean) {
    return samp.callNative("CEF_EnableKey", "iii", player.id, key, enabled) as number;
  }

  static setKeyCapture(player: Player, enabled: boolean) {
    return samp.callNative("CEF_SetKeyCapture", "ii", player.id, enabled) as number;
  }

  static exitGame(player: Player) {
    return samp.callNative("CEF_ExitGame", "i", player.id) as number;
  }

  static getInstance(browserId: number, player: Player) {
    return playerBrowserPool.get(player)?.get(browserId);
  }

  static getInstances() {
    return [...playerBrowserPool.entries()];
  }

  static getPlayerInstances(player: Player) {
    if (player.id === InvalidEnum.PLAYER_ID) return [];
    return [...(playerBrowserPool.get(player)?.values() || [])];
  }
}
