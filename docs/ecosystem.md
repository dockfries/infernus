# Ecosystem

The `@infernus/*` ecosystem is designed to bridge Pawn include libraries into the Node.js world. It wraps existing Pawn capabilities into Node.js packages, enabling you to use functionality previously only available in Pawn through TypeScript/JavaScript.

`@infernus/*` provides the following ecosystem packages:

| Package                     | Description                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `@infernus/core`            | Node.js library for scripting Open Multiplayer                                                                   |
| `@infernus/cef`             | A wrapper of the omp-cef component for samp-node                                                                 |
| `@infernus/colandreas`      | A wrapper of the SA-MP ColAndreas plugin for samp-node                                                           |
| `@infernus/create-app`      | Command line interface for rapid infernus development                                                            |
| `@infernus/distance`        | A wrapper of the distance library for samp-node                                                                  |
| `@infernus/drift-detection` | A wrapper of the driftDetection library for samp-node                                                            |
| `@infernus/e-selection`     | A wrapper of the eSelection library for samp-node                                                                |
| `@infernus/fcnpc`           | A wrapper of the FCNPC plugin for samp-node                                                                      |
| `@infernus/fs`              | A collection of all built-in filterscripts                                                                       |
| `@infernus/gps`             | A wrapper of the GPS plugin for samp-node                                                                        |
| `@infernus/map-loader`      | A tool for obj conversion, parsing, and loading                                                                  |
| `@infernus/mapandreas`      | A pure TypeScript heightmap query implementation, no native plugin required                                      |
| `@infernus/s-art`           | A wrapper of the popular s-art library for rendering pixel images in-game using DynamicObject with material text |
| `@infernus/nex-ac`          | A wrapper of the nex-ac library for samp-node                                                                    |
| `@infernus/progress`        | A progress bar based on `LD_SPAC:white` for precise control                                                      |
| `@infernus/qrcode`          | Generate simple qrcode objects for infernus                                                                      |
| `@infernus/query`           | Simple API for sending SA-MP queries with TypeScript                                                             |
| `@infernus/raknet`          | A wrapper of the open.mp raknet plugin for samp-node                                                             |
| `@infernus/rec`             | File format converter from `.rec` to `.json` and vice versa                                                      |
| `@infernus/samp-voice`      | A wrapper of the SA-MP voice library for samp-node                                                               |
| `@infernus/shared`          | Shared utilities and types for infernus packages (internal)                                                      |
| `@infernus/streamer`        | A wrapper of the SA-MP streamer plugin (v2.9.6, **private**)                                                     |
| `@infernus/types`           | Minimized samp-node API types for infernus (internal)                                                            |
| `@infernus/weapon-config`   | A wrapper of the weapon-config library for samp-node                                                             |

## Examples

| Project                                                             | Description                                                     |
| ------------------------------------------------------------------- | --------------------------------------------------------------- |
| [omp-gm-grandlarc](https://github.com/dockfries/omp-gm-grandlarc)   | The GrandLarceny sample game mode written with infernus-starter |
| [omp-gm-rivershell](https://github.com/dockfries/omp-gm-rivershell) | The RiverShell sample game mode written with infernus-starter   |
| [fme](https://github.com/dockfries/fme)                             | Fusez Map Editor Version 3 — a map editor for samp-node         |
| [nte](https://github.com/dockfries/nte)                             | Nexor's TextDraw Editor for samp-node                           |

## Design Philosophy

### Avoid Filterscripts

We do not recommend using any Filterscripts alongside Infernus. Pawn filterscripts were designed as independent script modules running alongside GameModes, but in the Infernus environment this introduces unnecessary complexity.

Our recommendations:

- Rewrite existing filterscripts using Infernus and integrate them directly into your GameMode.
- Do not write any GameMode logic in Pawn (except for necessary polyfill code).
- In short, **implement everything through Infernus**.

This keeps all logic unified in the Node.js/TypeScript environment, avoiding fragmentation between Pawn and Node.js.

## Compatibility

### Polyfill-Free Edition

Due to underlying implementation constraints of plugins, `samp-node`, `sampgdk`, and `omp`, certain plugin native functions cannot be called directly via `samp-node`. For example, `raknet`'s native functions previously required a `polyfill` workaround.

Starting from **v0.14.0+**, `@infernus/raknet` provides a **polyfill-free edition** — the `#include <polyfill/raknet>` directive is **no longer required**. Use our maintained [dockfries/Pawn.RakNet](https://github.com/dockfries/Pawn.RakNet) to get started.

> **⚠️ The polyfill-free edition is experimental** — bugs may be present. If you rely on the polyfill-based approach, please stay on `@infernus/raknet@0.13.x` with the original Pawn.RakNet.

### 64-bit Experimental Support

`samp-node` now provides 64-bit builds for experimental use. They require a 64-bit OMP server with matching 64-bit plugins:

- [streamer](https://github.com/dockfries/samp-streamer-plugin/releases/tag/v2.9.6)
- [gps](https://github.com/dockfries/samp-gps-plugin/releases/tag/v1.4.1)
- [raknet](https://github.com/dockfries/Pawn.RakNet/releases/tag/1.6.1-omp-rc1)
- [ColAndreas](https://github.com/dockfries/ColAndreas/releases/tag/v1.6.0)
- [sampvoice](https://github.com/dockfries/sampvoice)

> Note that `@infernus/create-app` does not support downloading these 64-bit dependencies at this time.

When using the 64-bit raknet plugin, you may need to manually recompile the polyfill to match the Pawn.RakNet version and avoid version mismatch warnings.

Before running `pnpm install`, determine whether your samp-node is 32-bit (x86) or 64-bit (x64) and set the environment variables accordingly. If you have already run `pnpm install`, delete the `node_modules` folder first before reinstalling.

```sh
# bash
export npm_config_arch=ia32
export npm_config_target_arch=ia32

# powershell
# $env:npm_config_arch="ia32";
# $env:npm_config_target_arch="ia32";

# cmd
# set npm_config_arch=ia32
# set npm_config_target_arch=ia32
```

Ensure these environment variables are set every time you run `pnpm install`. They are not required for 64-bit samp-node.
