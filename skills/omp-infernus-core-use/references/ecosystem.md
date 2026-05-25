# Ecosystem & Polyfill Reference

## Runtime Requirements

| Component | Notes |
|-----------|-------|
| [open.mp server](https://github.com/openmultiplayer/open.mp/releases) | Game server, latest stable recommended |
| [samp-node](https://github.com/dockfries/samp-node) | open.mp plugin, embeds Node.js (32-bit) |
| Node.js | Typically 20.x, must match what samp-node was compiled against |
| @infernus/core | TypeScript wrappers |

**Critical:** Infernus only works inside the samp-node + open.mp environment. It cannot run standalone.

## EOL / omp-node Migration

As noted in the [official docs](https://dockfries.github.io/infernus/introduction), Infernus is being gradually archived in favor of **omp-node**, a next-generation runtime that replaces both samp-node and Infernus. For new projects, consider evaluating omp-node first. Infernus remains functional and maintained for existing projects.

## Polyfill Requirements

Some packages require a PAWN polyfill to be compiled into the server gamemode. The polyfills are maintained in [infernus-starter/gamemodes](https://github.com/dockfries/infernus-starter/tree/main/gamemodes).

| Package | Polyfill Required | Polyfill File |
|---------|------------------|---------------|
| `@infernus/core` | Yes (for i18n) | `polyfill.amx` |
| `@infernus/raknet` | Yes | `raknet.inc` |
| `@infernus/cef` | Yes | `cef.inc` |
| `@infernus/gps` | Yes | `gps.inc` |
| All other packages | No | — |

To install: `#include` the `.inc` file in your gamemode's `.pwn`, compile to `.amx`, and place alongside your main gamemode.

## Packages Summary

### Core
| Package | npm | Wraps | Key Export |
|---------|-----|-------|------------|
| `@infernus/core` | public | open.mp natives | Player, Vehicle, GameMode, etc. |

### Plugin Wrappers
| Package | npm | Wraps | Key Export |
|---------|-----|-------|------------|
| `@infernus/streamer` | private | [samp-streamer-plugin](https://github.com/samp-incognito/samp-streamer-plugin) | DynamicObject, DynamicArea |
| `@infernus/raknet` | public | [Pawn.RakNet](https://github.com/katursis/Pawn.RakNet) | BitStream, IPacket |
| `@infernus/fcnpc` | public | [FCNPC](https://github.com/ziggi/FCNPC) | FCNPC class |
| `@infernus/colandreas` | public | [ColAndreas](https://github.com/Pottus/ColAndreas) | rayCastLine, CA_Object |
| `@infernus/cef` | public | [omp-cef](https://github.com/aurora-mp/omp-cef) | CefBrowser |
| `@infernus/samp-voice` | public | [samp-voice](https://github.com/CocaColaBear/samp-voice) | SampVoice, stream classes |
| `@infernus/nex-ac` | public | [nex-ac](https://github.com/NexiusTailer/nex-ac) | Anti-cheat events |
| `@infernus/gps` | public | [samp-gps-plugin](https://github.com/AmyrAhmady/samp-gps-plugin) | MapNode, WazeEvent |
| `@infernus/mapandreas` | public | [MapAndreas](https://github.com/Pottus/MapAndreas) | MapAndreas.findZFor2DCoord |

### Internal Utilities
| Package | npm | Description |
|---------|-----|-------------|
| `@infernus/progress` | public | Progress bar TextDraw |
| `@infernus/qrcode` | public | QR code via DynamicObject materials |
| `@infernus/map-loader` | public | Load .map files into DynamicObjects |
| `@infernus/weapon-config` | public | Weapon damage configuration |
| `@infernus/drift-detection` | public | Drift detection events |
| `@infernus/e-selection` | public | Enhanced model selection menu |
| `@infernus/distance` | public | Entity-to-entity distance functions |
| `@infernus/query` | public | UDP server query |
| `@infernus/rec` | public | Recording data blocks |

### Tooling
| Package | Description |
|---------|-------------|
| `@infernus/create-app` | CLI scaffolding: `npx infernus create my-server` |
| `@infernus/fs` | Built-in filterscript rewrites |

## Version Compatibility

When upgrading, check that all `@infernus/*` packages are on compatible versions. The root `package.json` version matches `@infernus/core`. Other packages may lag behind — check each package's `package.json` for the current version.
