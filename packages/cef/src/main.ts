import { DynamicObject, Player, defineEvent } from "@infernus/core";

export enum CefValueType {
  STRING,
  INTEGER,
  FLOAT,
}

export interface CefCommonOptions {
  player: Player | number;
  browserId?: number;
  url: string;
}

export interface CefOptions extends CefCommonOptions {
  hidden: boolean;
  focused: boolean;
}

export interface CefExtOptions extends CefCommonOptions {
  texture: string;
  scale: number;
}

export class Cef {
  static readonly MAX_DIST = 50.0;
  static readonly REF_DIST = 15.0;
  private static readonly MAX_BROWSER_ID = 32767;
  private static readonly instances = new Map<string, Cef>();
  readonly browserId: number = -1;
  readonly playerId: number = -1;
  constructor(options: CefOptions | CefExtOptions) {
    const { player, browserId, url } = options;
    this.playerId = player instanceof Player ? player.id : player;
    // it can be used by multiple players with same id
    // if not given, generate a random id
    if (browserId) {
      if (!Cef.instances.has(this.playerId + "_" + browserId)) {
        Cef.instances.set(this.playerId + "_" + browserId, this);
      }
      this.browserId = browserId;
    } else {
      let randId = -1;
      while (
        (randId === -1 || Cef.instances.has(this.playerId + "_" + randId)) &&
        Cef.instances.size < Cef.MAX_BROWSER_ID
      ) {
        randId = Math.floor(Math.random() * Cef.MAX_BROWSER_ID) + 1;
      }
      if (randId === -1) {
        throw new Error("samp-cef: Too many CEF browsers");
      }
      this.browserId = randId;
      Cef.instances.set(this.playerId + "_" + randId, this);
    }

    if ("texture" in options) {
      const { texture, scale } = options;
      samp.callNative(
        "cef_create_ext_browser",
        "iissi",
        this.playerId,
        this.browserId,
        texture,
        url,
        scale,
      );
    } else {
      const { hidden, focused } = options;
      samp.callNative(
        "cef_create_browser",
        "iisii",
        this.playerId,
        this.browserId,
        url,
        hidden,
        focused,
      );
    }
  }

  destroy() {
    const res = samp.callNative(
      "cef_destroy_browser",
      "ii",
      this.playerId,
      this.browserId,
    );
    if (res) {
      Cef.instances.delete(this.playerId + "_" + this.browserId);
    }
    return Boolean(res);
  }

  show() {
    const res = samp.callNative(
      "cef_hide_browser",
      "iii",
      this.playerId,
      this.browserId,
      false,
    );
    return Boolean(res);
  }

  hide() {
    const res = samp.callNative(
      "cef_hide_browser",
      "iii",
      this.playerId,
      this.browserId,
      true,
    );
    return Boolean(res);
  }

  appendToObject(object: DynamicObject | number) {
    const res = samp.callNative(
      "cef_append_to_object",
      "iii",
      this.playerId,
      this.browserId,
      object instanceof DynamicObject ? object.id : object,
    );
    return Boolean(res);
  }

  removeFromObject(object: DynamicObject | number) {
    const res = samp.callNative(
      "cef_remove_from_object",
      "iii",
      this.playerId,
      this.browserId,
      object instanceof DynamicObject ? object.id : object,
    );
    return Boolean(res);
  }

  toggleDevTools(enabled: boolean) {
    const res = samp.callNative(
      "cef_toggle_dev_tools",
      "iii",
      this.playerId,
      this.browserId,
      enabled,
    );
    return Boolean(res);
  }

  setAudioSettings(
    maxDistance = Cef.MAX_DIST,
    referenceDistance = Cef.REF_DIST,
  ) {
    const res = samp.callNative(
      "cef_set_audio_settings",
      "iiff",
      this.playerId,
      this.browserId,
      maxDistance,
      referenceDistance,
    );
    return Boolean(res);
  }

  focusBrowser(focused: boolean) {
    const res = samp.callNative(
      "cef_focus_browser",
      "iii",
      this.playerId,
      this.browserId,
      focused,
    );
    return Boolean(res);
  }

  alwaysListenKeys(listen: boolean) {
    const res = samp.callNative(
      "cef_always_listen_keys",
      "iii",
      this.playerId,
      this.browserId,
      listen,
    );
    return Boolean(res);
  }

  loadUrl(url: string) {
    const res = samp.callNative(
      "cef_load_url",
      "iis",
      this.playerId,
      this.browserId,
      url,
    );
    return Boolean(res);
  }

  static playerHasPlugin(player: Player | number) {
    const res = samp.callNative(
      "cef_player_has_plugin",
      "i",
      player instanceof Player ? player.id : player,
    );
    return Boolean(res);
  }

  static emitEvent(
    player: Player | number,
    event: string,
    ...args: (number | string)[]
  ) {
    const pid = player instanceof Player ? player.id : player;
    const argsWithType = args
      .map((arg) => {
        if (typeof arg === "string") return [CefValueType.STRING, arg];
        if (typeof arg === "number") {
          if (Number.isNaN(arg)) {
            throw new Error("samp-cef: NaN is not allowed");
          }
          if (Number.isInteger(arg)) return [CefValueType.INTEGER, arg];
          if (arg % 1 !== 0) return [CefValueType.FLOAT, arg];
        }
        throw new Error("samp-cef: Unsupported type");
      })
      .flat();
    const res = samp.callNative(
      "cef_emit_event",
      "isa",
      pid,
      event,
      argsWithType,
    );
    return Boolean(res);
  }

  static subscribe(event: string, callbackName: string) {
    const res = samp.callNative("cef_subscribe", "ss", event, callbackName);
    return Boolean(res);
  }

  static getInstance(player: Player | number, browserId: number) {
    const pid = player instanceof Player ? player.id : player;
    return Cef.instances.get(pid + "_" + browserId);
  }
  static getInstances() {
    return Cef.instances.values();
  }
}

const [onInitialize] = defineEvent({
  name: "OnCefInitialize",
  identifier: "ii",
  beforeEach(playerId: number, success: number) {
    return {
      player: Player.getInstance(playerId),
      success: Boolean(success),
    };
  },
});

const [onBrowserCreated] = defineEvent({
  name: "OnCefBrowserCreated",
  identifier: "iii",
  beforeEach(playerId: number, browserId: number, statusCode: number) {
    return {
      cef: Cef.getInstance(playerId, browserId)!,
      statusCode,
      playerId,
      browserId,
    };
  },
});

export const CefEvent = {
  onInitialize,
  onBrowserCreated,
};
