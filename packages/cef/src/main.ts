import { DynamicObject, Player, defineEvent } from "@infernus/core";
import { CefDefault, CefNatives, CefValueType } from "./enums";
import type { CefOptions, CefExtOptions } from "./interfaces";
import { patchCefNatives } from "./utils";

export * from "./enums";

export * from "./interfaces";

export class Cef {
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
      const cef = Cef.instances.get(this.playerId + "_" + browserId);
      if (cef) return cef;
      this.browserId = browserId;
      Cef.instances.set(this.playerId + "_" + browserId, this);
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
      samp.callPublic(
        "PatchCefCreateExtBrowser",
        "iissi",
        this.playerId,
        this.browserId,
        texture,
        url,
        scale,
      );
    } else {
      const { hidden, focused } = options;
      samp.callPublic(
        "PatchCefCreateBrowser",
        "iisii",
        this.playerId,
        this.browserId,
        url,
        +hidden,
        +focused,
      );
    }
  }

  destroy() {
    const res = Boolean(
      patchCefNatives(CefNatives.DestroyBrowser, this.playerId, this.browserId),
    );
    if (res) {
      Cef.instances.delete(this.playerId + "_" + this.browserId);
    }
    return res;
  }

  show() {
    const res = Boolean(
      patchCefNatives(CefNatives.HideBrowser, this.playerId, this.browserId, 0),
    );
    return res;
  }

  hide() {
    const res = Boolean(
      patchCefNatives(CefNatives.HideBrowser, this.playerId, this.browserId, 1),
    );
    return res;
  }

  appendToObject(object: DynamicObject | number) {
    const res = patchCefNatives(
      CefNatives.AppendToObject,
      this.playerId,
      this.browserId,
      object instanceof DynamicObject ? object.id : object,
    );
    return Boolean(res);
  }

  removeFromObject(object: DynamicObject | number) {
    const res = patchCefNatives(
      CefNatives.RemoveFromObject,
      this.playerId,
      this.browserId,
      object instanceof DynamicObject ? object.id : object,
    );
    return Boolean(res);
  }

  toggleDevTools(enabled: boolean) {
    const res = patchCefNatives(
      CefNatives.ToggleDevTools,
      this.playerId,
      this.browserId,
      +enabled,
    );
    return Boolean(res);
  }

  setAudioSettings(
    maxDistance: number = CefDefault.MaxDist,
    referenceDistance: number = CefDefault.RefDist,
  ) {
    const res = samp.callPublic(
      "PatchCefSetAudioSettings",
      "iiff",
      this.playerId,
      this.browserId,
      maxDistance.toFixed(2),
      referenceDistance.toFixed(2),
    );
    return Boolean(res);
  }

  focusBrowser(focused: boolean) {
    const res = patchCefNatives(
      CefNatives.FocusBrowser,
      this.playerId,
      this.browserId,
      +focused,
    );
    return Boolean(res);
  }

  alwaysListenKeys(listen: boolean) {
    const res = patchCefNatives(
      CefNatives.AlwaysListenKeys,
      this.playerId,
      this.browserId,
      +listen,
    );
    return Boolean(res);
  }

  loadUrl(url: string) {
    const res = samp.callPublic(
      "PatchCefLoadUrl",
      "iis",
      this.playerId,
      this.browserId,
      url,
    );
    return Boolean(res);
  }

  static playerHasPlugin(player: Player | number) {
    const res = patchCefNatives(
      CefNatives.PlayerHasPlugin,
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
        if (typeof arg === "string") return [CefValueType.String, arg];
        if (typeof arg === "number") {
          if (Number.isNaN(arg)) {
            throw new Error("samp-cef: NaN is not allowed");
          }
          if (Number.isInteger(arg)) return [CefValueType.Integer, arg];
          if (arg % 1 !== 0) return [CefValueType.Float, arg];
        }
        throw new Error("samp-cef: Unsupported type");
      })
      .flat();

    if (argsWithType.length / 2 > 5) {
      throw new Error("samp-cef: maximum of five parameters can be sent back");
    }

    const res = samp.callPublic(
      "PatchCefEmitEvent",
      "isai",
      pid,
      event,
      argsWithType,
      argsWithType.length / 2,
    );
    return Boolean(res);
  }

  static subscribe(event: string, callbackName: string) {
    const res = samp.callPublic("PatchCefSubscribe", "ss", event, callbackName);
    return Boolean(res);
  }

  static getInstance(player: Player | number, browserId: number) {
    const pid = player instanceof Player ? player.id : player;
    return Cef.instances.get(pid + "_" + browserId);
  }
  static getInstances() {
    return [...Cef.instances.values()];
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
