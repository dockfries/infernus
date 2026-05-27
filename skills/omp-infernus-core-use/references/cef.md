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
browser.setPos(x, y, z);                  // 2dWorld only — reposition
browser.reloadBrowser(ignoreCache?);
browser.focusBrowser(focused);
browser.enableDevTools(enabled);
browser.emitEvent(eventName, data);       // emit JS event in browser
browser.attachToObject(objectMp);
browser.detachFromObject(objectMp);
browser.setMuted(mute);
browser.setAudioMode(mode);
browser.setAudioSettings(maxDist, refDist);
browser.getId();                          // → number
browser.getType();                        // → "2dPlayer" | "3dWorld" | "2dWorld"
browser.getUrl();                         // → string
browser.getWidth();                       // → number
browser.getHeight();                      // → number
browser.getPlayer();                      // → Player
browser.isValid();                        // → boolean
browser.destroy();

// Static
CefBrowser.isValid(player, browserId);
CefBrowser.hasPlugin(player);             // check if player has CEF plugin
CefBrowser.addResource(resourceName);
CefBrowser.getInstance(browserId, player);
CefBrowser.getInstances();                // → [Player, Map<number, CefBrowser>][]
CefBrowser.getPlayerInstances(player);    // → CefBrowser[]
CefBrowser.toggleHudComponent(player, componentId, toggle);
CefBrowser.toggleSpawnScreen(player, toggle);
CefBrowser.clearChat(player);
CefBrowser.toggleChatInput(player, toggle);
CefBrowser.isChatInputOpen(player);       // → boolean
CefBrowser.enableKey(player, key, enabled);
CefBrowser.setKeyCapture(player, enabled);
CefBrowser.exitGame(player);
```

## CefEvent

```typescript
CefEvent.onInitialize(({ player, success, reason, message, next }) => { return next(); });
CefEvent.onDownloadStart(({ player, next }) => { return next(); });
CefEvent.onDownloadFinish(({ player, next }) => { return next(); });
CefEvent.onReady(({ player, next }) => { return next(); });
CefEvent.onBrowserCreated(({ player, browser, success, code, reason, next }) => { return next(); });
CefEvent.onPressKey(({ player, key, scanCode, modifiers, down, repeat, next }) => { return next(); });
CefEvent.onChatInputState(({ player, open, next }) => { return next(); });
CefEvent.onRecv(({ player, browser, raw, data, buffer, next }) => { return next(); });
```

## Enums

```typescript
enum CefInitReasonEnum { OK, TIMEOUT, VERSION_MISMATCH, IP_MISMATCH, HANDSHAKE_FAILED, UNKNOWN }
enum CefCreateStatusEnum { SUCCESS, ERROR_GENERIC, ERROR_ID_ALREADY_IN_USE }
enum CefAudioModeEnum { WORLD, UI }
enum CefHudComponentEnum { ALL, AMMO, ARMOUR, BREATH, CROSSHAIR, HEALTH, MONEY, RADAR, WANTED_STARS, WEAPON }
```

## Exception

`CefException` is thrown on browser creation failure, invalid resource operations, or native errors.

```typescript
import { CefException } from "@infernus/cef";
```

## Types

```typescript
type CefBrowserSourceInfo = CefBrowserOptions | CefWorldBrowserOptions | CefWorld2DBrowserOptions;

interface CefCommonOptions { player: Player; url: string; width?: number; height?: number; }
interface CefBrowserOptions extends CefCommonOptions { type: "2dPlayer"; focused: boolean; controlsChat?: boolean; }
interface CefWorldBrowserOptions extends CefCommonOptions { type: "3dWorld"; textureName: string; }
interface CefWorld2DBrowserOptions extends CefCommonOptions { type: "2dWorld"; worldX: number; worldY: number; worldZ: number; offsetZ?: number; pivotX?: number; pivotY?: number; }
```
