# Utility Packages

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

## @infernus/distance

Type-safe distance/range functions for all entity types. Follows pattern:

```
get{Entity}DistanceTo{Target}(entity, target)        → number
is{Entity}InRangeOf{Target}(entity, target, range)    → boolean
getClosest{Target}To{Entity}(entity)                  → Entity | null
```

Supports: Player, Vehicle, Actor, ObjectMp, DynamicActor, DynamicObject, and raw points.

```typescript
getPlayerDistanceToPlayer(p1, p2);
isVehicleInRangeOfPlayer(vehicle, player, 50.0);
getClosestPlayerToPlayer(player);
getPointDistanceToPoint3D(x1, y1, z1, x2, y2, z2);
```

## @infernus/mapandreas

Pure TypeScript heightmap query, no native plugin required. Reads raw binary heightmap files (Uint16Array grid, no header).

```typescript
import { MapAndreas, MapAndreasMode, MapAndreasError } from "@infernus/mapandreas";

GameMode.onInit(({ next }) => {
  await MapAndreas.init(MapAndreasMode.Full, "scriptfiles/SAFull.hmap");
  MapAndreas.findZFor2DCoord(x, y); // → { z, ret: MapAndreasError }
  MapAndreas.findAverageZ(x, y); // → { z, ret: MapAndreasError }
  MapAndreas.setZFor2DCoord(x, y, z); // → boolean
  MapAndreas.saveCurrentHMap(name); // → Promise<boolean>
  return next();
});

GameMode.onExit(({ next }) => {
  MapAndreas.unload();
  return next();
});
```

`MapAndreasException` is thrown on initialization failure (missing/invalid file), uninitialized access, or unknown mode.

```typescript
import { MapAndreasException } from "@infernus/mapandreas";
```

## @infernus/map-loader

`MapLoaderException` is thrown on invalid map ID operations, parse errors, or conversion failures.

```typescript
import { MapLoaderException } from "@infernus/map-loader";
```

## @infernus/fs

Built-in filterscript rewrites. Each is an `IFilterScript`:

```typescript
import { A51Base } from "@infernus/fs";
GameMode.use(A51Base, { debug: true });
```

Check `packages/filterscript/src/scripts/` for the full list.

## @infernus/create-app

CLI scaffolding tool for the samp-node + open.mp environment. Run without installing:

```bash
pnpm dlx @infernus/create-app@latest create my-server   # scaffold new project
cd my-server && pnpm install && pnpm dev
```

The CLI is published as `@infernus/create-app` with the `infernus` binary — use `pnpm dlx @infernus/create-app@latest <cmd>` (or install it globally and run `infernus <cmd>`). `npx infernus` does **not** resolve to this package.

Full command reference:

| Command                | Description                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `create <name>`        | Scaffold a new project from [infernus-starter](https://github.com/dockfries/infernus-starter)          |
| `add <dep...>`         | Add **Pawn plugin/component** dependencies (`owner/repo[@version]`), not npm packages; alias `install` |
| `install`              | Install all plugin/component dependencies listed in `pawn.json`                                        |
| `remove <dep...>`      | Remove plugin/component dependencies; aliases `rm`, `uninstall`                                        |
| `update <dep...>`      | Update plugin/component dependencies (no args = all in `pawn.json`) — **not** npm packages             |
| `clean <dep...>`       | Clear the download cache for specific deps, or `--all` for everything                                  |
| `config [key] [value]` | View or edit CLI config (GitHub token, etc.); `--list` prints all config items                         |

> This CLI manages the **server-side Pawn plugins/components** (samp-node, streamer, etc.) via `pawn.json`. npm dependencies of your gamemode are managed with `pnpm add/update` as usual.
