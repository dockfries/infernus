# Troubleshooting Common Infernus Issues

## "samp is not defined" / "samp is undefined"

**Cause:** The code is running outside the samp-node environment — either in a standalone Node.js process or before samp-node has initialized.

**Fix:** Ensure the script is loaded by samp-node as a gamemode or filterscript. Module-level API calls won't work; put them inside `GameMode.onInit`.

## Game API calls don't work at module level

```typescript
// DON'T — these run before samp-node is ready
GameMode.setWeather(10);
new Vehicle(config).create();

// DO — wrap in event callbacks
GameMode.onInit(({ next }) => {
    GameMode.setWeather(10);
    new Vehicle(config).create();
    return next();
});
```

## Text displayed as "?" or garbled

**Cause:** Character set mismatch between the server and player client.

**Fix:** Set the player's `charset` correctly on connect:

```typescript
PlayerEvent.onConnect(({ player, next }) => {
    player.charset = "ISO-8859-1";  // default Western
    // or "windows-1251" for Russian, "gbk" for Chinese, etc.
    return next();
});
```

If you're using i18n, make sure `polyfill.amx` is compiled and installed in the server's gamemodes directory.

## `@infernus/raknet` / `@infernus/cef` / `@infernus/gps` doesn't work

**Cause:** These packages require a PAWN polyfill to be compiled into the gamemode.

**Fix:** Download and compile the corresponding `.inc` file from [infernus-starter/gamemodes](https://github.com/dockfries/infernus-starter/tree/main/gamemodes):
- `raknet.inc` → required for `@infernus/raknet`
- `cef.inc` → required for `@infernus/cef`
- `gps.inc` → required for `@infernus/gps`

The polyfill must be `#include`d in your gamemode's `.pwn` file and compiled to `.amx`.

## Server crashes on startup with samp-node

**Common causes:**
- samp-node version mismatch with open.mp server version
- Node.js version too new or too old (typically Node 20.x is safest)
- Missing `.dll`/`.so` dependencies for samp-node
- 32-bit vs 64-bit architecture conflict (samp-node is 32-bit)
- Conflicting plugins in `server.cfg`

**Check:** See the [samp-node releases](https://github.com/dockfries/samp-node/releases) page for compatible versions.

## Entity creation silently fails

**Cause:** Entity pool is full, or `new` was called but `.create()` was not.

**Fix:** Always call `.create()` after construction. Check the return value or catch exceptions:

```typescript
try {
    const veh = new Vehicle(config);
    veh.create();
} catch (e) {
    console.error(`Vehicle creation failed: ${e.message}`);
}
```

## Exception Classes

Each `@infernus/*` package provides a custom `*Exception` class (extends `Error`) for runtime errors. Check the package's reference page for the specific exception name and thrown conditions.

```typescript
import { CoreException } from "@infernus/core";
import { RakNetException } from "@infernus/raknet";

try {
    // game API calls
} catch (e) {
    if (e instanceof CoreException) {
        // handle core-specific error
    }
    if (e instanceof RakNetException) {
        // handle raknet-specific error
    }
}
```

Some exceptions are expected in normal operation (e.g. `ClientCheckException` on timeout, `DialogException` when the player closes a dialog or disconnects before responding). A common pattern is to suppress known benign exceptions at the process level:

```typescript
import {
    ClientCheckException,
    DialogException,
} from "@infernus/core";

process.on("uncaughtException", (err) => {
    const ignoreExceptions = [ClientCheckException, DialogException];
    if (ignoreExceptions.some((e) => err instanceof e)) {
        return;
    }
    console.error(err);
});
```

## Memory leak / events firing multiple times

**Cause:** Event listeners registered in a filterscript `load()` function were not returned as cleanup functions.

**Fix:** Always return an array of `off()` functions from `load()`:

```typescript
const MyScript: IFilterScript = {
    name: "my_script",
    load() {
        const off1 = PlayerEvent.onConnect(({ next }) => next());
        const off2 = PlayerEvent.onCommandText("foo", ({ next }) => next());
        return [off1, off2];   // ← required!
    },
    unload() {},
};
```
