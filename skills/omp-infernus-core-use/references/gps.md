# @infernus/gps — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [SA-MP GPS plugin](https://github.com/AmyrAhmady/samp-gps-plugin) with built-in [WazeGPS](https://github.com/devbluen/WazeGPS-Samp). Requires a [polyfill](https://github.com/dockfries/infernus-starter/blob/main/gamemodes/polyfill/gps.inc).

```bash
pnpm add @infernus/core @infernus/gps
```

## MapNode

```typescript
import { MapNode, GpsPath, GpsConnection } from "@infernus/gps";

// Create
const node = new MapNode();
node.create(x, y, z);

node.destroy();
node.isValid();                                    // → boolean
node.getPos();                                     // → { x, y, z, ret: GpsError }
node.getConnectionCount();                         // → number
node.getDistanceBetween(otherNode);                // → number
node.getAngleBetween(otherNode);                   // → number
node.getDistanceFromPoint(x, y, z);                // → number
node.getAngleFromPoint(x, y);                      // → number
node.getHighest();                                 // → number
node.getRandom();                                  // → MapNode

MapNode.getClosestToPoint(x, y, z, ignoredNode?);  // → MapNode
MapNode.saveMapNodesToFile(fileName);               // → boolean
```

## GpsPath

```typescript
const path = new GpsPath(pathId);

path.destroy();
path.isValid(); // → boolean
path.getSize(); // → number
path.getLength(); // → number
path.getNode(index); // → MapNode
path.getNodeIndex(node); // → number

GpsPath.findSync(node, target); // → GpsPath (sync)
GpsPath.find(node, target); // → Promise<GpsPath> (async)
```

## GpsConnection

```typescript
const conn = new GpsConnection();
conn.create(sourceNode, targetNode);
conn.destroy();
conn.getSource(); // → MapNode
conn.getTarget(); // → MapNode

GpsConnection.getMapNode(node, index); // → GpsConnection
GpsConnection.getBetweenMapNodes(node, target); // → GpsConnection
```

## Waze GPS (Navigation)

```typescript
import { setPlayerWaze, stopWazeGPS, isValidWazeGPS, WazeEvent } from "@infernus/gps";

setPlayerWaze(player, x, y, z, color?, updateTime?);  // → Promise<boolean>
stopWazeGPS(player);                                    // → boolean
isValidWazeGPS(player);                                 // → boolean

WazeEvent.onPlayerRouteFinish(({ player, finishedRoute, next }) => { return next(); });
WazeEvent.onPlayerRouteUpdate(({ player, currentRoute, next }) => { return next(); });
```

## Exception

`GpsException` is thrown on invalid node/path/connection operations, including failed lookups.

```typescript
import { GpsException } from "@infernus/gps";
```

## Constants & Enums

```typescript
INVALID_MAP_NODE_ID = -1;
INVALID_PATH_ID = -1;
INVALID_CONNECTION_ID = -1;
MAX_WAZE_DOTS = 100;
WAZE_UPDATE_TIME = 3100;

enum GpsError {
  None,
  InvalidParams,
  InvalidPath,
  InvalidNode,
  InvalidConnection,
  Internal,
}
```
