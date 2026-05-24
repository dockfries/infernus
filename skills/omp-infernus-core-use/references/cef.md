# @infernus/cef — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [omp-cef](https://github.com/aurora-mp/omp-cef). CEF browser overlay in-game. Requires a [polyfill](https://github.com/dockfries/infernus-starter/blob/main/gamemodes/polyfill/cef.inc).

```bash
pnpm add @infernus/core @infernus/cef
```

## CefBrowser

```typescript
import { CefBrowser, CefEvent } from "@infernus/cef";

// Create — type can be "2dPlayer", "3dWorld", or "2dWorld"
const browser = new CefBrowser({
    type: "2dPlayer",
    player, url: "http://example.com",
    width: 800, height: 600,
    focused: true,
    controlsChat: false,
});
browser.create();

// Methods
browser.setVisible(visible);              // show/hide
browser.setPos();                         // reposition
browser.loadUrl(url);
browser.setResolution(width, height);
browser.reloadBrowser(ignoreCache?);
browser.focusBrowser(focused);
browser.enableDevTools(enabled);
browser.emitEvent(eventName, data);       // emit JS event in browser
browser.sendEvent(data);                  // simplified emit
browser.attachToObject(objectMp);
browser.detachFromObject(objectMp);
browser.setMuted(mute);
browser.setAudioMode(mode);
browser.setAudioSettings(maxDist, refDist);
browser.getId();                          // → number
browser.getType();                        // → "2dPlayer" | "3dWorld" | "2dWorld"
browser.getUrl();                         // → string
browser.getTextureName();                 // → string
browser.isFocused();                      // → boolean
browser.isMuted();                        // → boolean
browser.destroy();

// Static resource management
CefBrowser.addResource(resourceName);
CefBrowser.removeResource(resourceName);
```

## CefEvent

```typescript
CefEvent.onCreate(({ browser, player, next }) => { return next(); });
CefEvent.onDestroy(({ browser, player, next }) => { return next(); });
CefEvent.onUrlChange(({ browser, player, url, next }) => { return next(); });
CefEvent.onReceivedEvent(({ browser, player, data, next }) => { return next(); });
CefEvent.onLoadBegin(({ browser, player, next }) => { return next(); });
CefEvent.onLoadEnd(({ browser, player, next }) => { return next(); });
CefEvent.onLoadError(({ browser, player, errorCode, errorMsg, url, next }) => { return next(); });
CefEvent.onCursorChange(({ browser, player, cursorType, next }) => { return next(); });
```

## Enums

```typescript
enum CefInitReasonEnum { OK, TIMEOUT, VERSION_MISMATCH, IP_MISMATCH, HANDSHAKE_FAILED, UNKNOWN }
enum CefCreateStatusEnum { SUCCESS, ERROR_GENERIC, ERROR_ID_ALREADY_IN_USE }
enum CefAudioModeEnum { WORLD, UI }
enum CefHudComponentEnum { ALL, AMMO, ARMOUR, BREATH, CROSSHAIR, HEALTH, MONEY, RADAR, WANTED_STARS, WEAPON }
```

## Types

```typescript
type CefBrowserSourceInfo = CefBrowserOptions | CefWorldBrowserOptions | CefWorld2DBrowserOptions;
interface CefBrowserOptions { type: "2dPlayer"; player: Player; url: string; width?: number; height?: number; focused: boolean; controlsChat?: boolean; }
interface CefWorldBrowserOptions { type: "3dWorld"; player: Player; url: string; width?: number; height?: number; textureName: string; }
interface CefWorld2DBrowserOptions { type: "2dWorld"; player: Player; url: string; width?: number; height?: number; worldX: number; worldY: number; worldZ: number; offsetZ?: number; pivotX?: number; pivotY?: number; }
```
