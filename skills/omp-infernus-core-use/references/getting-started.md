# Getting Started with Infernus

## What You Need

This skill is for writing gamemodes that run inside **open.mp** via the **samp-node** plugin. It cannot run standalone.

- [open.mp server](https://open.mp) — the game server
- [samp-node](https://github.com/dockfries/samp-node) — open.mp plugin that embeds Node.js
- **@infernus/core** — TypeScript wrappers

## Quickest Start

```bash
npx infernus create my-server
cd my-server
pnpm install
pnpm dev
```

This scaffolds a complete project from [infernus-starter](https://github.com/dockfries/infernus-starter). It includes:
- `gamemodes/` with polyfill and config
- `package.json` with `@infernus/core`
- Build scripts and development server

## Minimal Gamemode

```typescript
// src/index.ts
import { GameMode, PlayerEvent } from "@infernus/core";

// All game API calls MUST be inside events
GameMode.onInit(({ next }) => {
    GameMode.setWeather(0);
    GameMode.setWorldTime(12);
    GameMode.addPlayerClass(0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0);
    console.log("Gamemode initialized!");
    return next();
});

GameMode.onExit(({ next }) => {
    console.log("Gamemode exited");
    return next();
});

PlayerEvent.onConnect(({ player, next }) => {
    player.sendClientMessage("#fff", "Welcome to the server!");
    return next();
});

PlayerEvent.onSpawn(({ player, next }) => {
    player.setHealth(100);
    player.setArmour(50);
    return next();
});

PlayerEvent.onCommandText("help", ({ player, next }) => {
    player.sendClientMessage("#0f0", "Available commands: /help, /veh");
    return next();
});

PlayerEvent.onCommandText("veh", ({ player, next }) => {
    const veh = new Vehicle({ modelId: 411, x: 0, y: 0, z: 5, zAngle: 0, color: [-1, -1] });
    veh.create();
    veh.putPlayerIn(player, 0);
    return next();
});
```

## Project Structure (starter template)

```
my-server/
├── gamemodes/
│   ├── polyfill.amx          # Required for i18n byte-array callbacks
│   ├── raknet.inc            # Required if using @infernus/raknet
│   └── ...
├── src/
│   └── index.ts              # Entry point
├── package.json
└── tsconfig.json
```

## First-Time Setup Notes

1. **samp-node must be installed as an open.mp plugin.** Follow [infernus-starter](https://github.com/dockfries/infernus-starter) instructions or the starter template's README.
2. **Polyfill is required** for i18n features. Compile `gamemodes/polyfill.amx` from the starter.
3. **Node.js version** must be compatible with samp-node (typically Node 20.x).
4. **All game API calls** must be inside event callbacks. Module-level code runs before samp-node is ready.
