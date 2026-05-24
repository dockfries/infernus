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

Wraps [MapAndreas plugin](https://github.com/Pottus/MapAndreas). Height map queries.

```typescript
import { MapAndreas, MapAndreasMode } from "@infernus/mapandreas";

GameMode.onInit(({ next }) => {
    MapAndreas.init(MapAndreasMode.FULL, "SA_Full.and");
    return next();
});
MapAndreas.findZFor2DCoord(x, y);      // → { z, ret }
MapAndreas.findAverageZ(x, y);         // → { z, ret }
MapAndreas.unload();
```

## @infernus/fs

Built-in filterscript rewrites. Each is an `IFilterScript`:

```typescript
import { A51Base } from "@infernus/fs";
GameMode.use(A51Base, { debug: true });
```

Check `packages/filterscript/src/scripts/` for the full list.

## @infernus/create-app

CLI scaffolding tool. Run without installing:

```bash
npx infernus create my-server       # scaffold new project
cd my-server && pnpm install && pnpm dev
```

Full command reference:

| Command | Description |
|---------|-------------|
| `create <name>` | Scaffold a new project from [infernus-starter](https://github.com/dockfries/infernus-starter) |
| `add <package>` | Add a dependency (e.g. `npx infernus add @infernus/raknet`) |
| `install` | Install all project dependencies |
| `remove <package>` | Remove a dependency |
| `update` | Update all `@infernus/*` packages to latest |
| `cache clean` | Clear the download cache |
| `config` | View or edit CLI configuration (GitHub token, etc.) |
