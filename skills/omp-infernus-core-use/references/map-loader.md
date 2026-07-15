# @infernus/map-loader — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Load SA:MP map files (.map) into DynamicObjects.

```bash
pnpm add @infernus/core @infernus/map-loader
```

## loadMap / unloadMap

```typescript
import {
  loadMap,
  unloadMap,
  reloadMap,
  reloadMaps,
  getMapCount,
  getMapIDFromObject,
  getMapInfoFromID,
} from "@infernus/map-loader";

const mapId = await loadMap({
  source: "./maps/my_map.map", // file path or async callback
  xOffset: 0,
  yOffset: 0,
  zOffset: 0,
  worldId: -1,
  interiorId: -1,
  streamDistance: 300,
  drawDistance: 0,
  onLoaded(objects, removedBuildings) {
    console.log(`Loaded ${objects.length} objects`);
  },
  onUnloaded(removedBuildings) {},
});

unloadMap(mapId);
reloadMap(mapId);
reloadMaps(); // reload all loaded maps
getMapCount(); // → number
getMapIDFromObject(dynamicObject); // → number
getMapInfoFromID(id); // → IMapInfo | undefined
```

## Convert / Export

```typescript
import { mapConverter, mapExporter } from "@infernus/map-loader";

mapConverter({ input: "./source.map", output: "./output.map" });
mapExporter({ output: "./exported.map", removeOutput: true });
```

## Interfaces

```typescript
interface IMapLoadOptions {
  source: string | ((done: () => void) => Promise<string[]>);
  xOffset?: number;
  yOffset?: number;
  zOffset?: number;
  playerId?: number | number[];
  worldId?: number | number[];
  areaId?: number | number[];
  interiorId?: number | number[];
  priority?: number;
  streamDistance?: number;
  drawDistance?: number;
  overwrite?: boolean;
  charset?: string;
  onLoaded?: (objects: DynamicObject[], removedBuilding: RemoveBuildingArgs) => void;
  onUnloaded?: (removedBuilding: RemoveBuildingArgs) => void;
}
```
