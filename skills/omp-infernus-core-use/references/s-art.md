# @infernus/s-art — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Render pixel images using dynamic objects.

```bash
pnpm add @infernus/core @infernus/s-art
```

## SArt

```typescript
import { SArt, type CreateArtParams, type IArtType } from "@infernus/s-art";

// Create
const art = new SArt({
    image: "path/to/image.png",   // string | Buffer
    type: 1,                       // art type index (0-3 built-in)
    pos: [0, 0, 10],
    rot: [0, 0, 0],
    resize: { width: 300, height: 300 },  // optional
    // Optional DynamicObject params:
    worldId?: number,
    interiorId?: number,
    playerId?: number,
    streamDistance?: number,
    drawDistance?: number,
});

await art.create();                // → Promise<void> (async!)
```

### Methods

```typescript
art.create();             // → Promise, loads image, creates DynamicObject blocks
art.destroy();            // → void, destroys all objects
art.getObjects();         // → DynamicObject[]
```

### Static

```typescript
SArt.getInstance(id);     // → SArt | undefined
SArt.getInstances();      // → SArt[]
SArt.setType(type, schema);  // register custom art type
SArt.getType(type);          // → IArtType | undefined
```

## Interfaces

```typescript
interface CreateArtParams {
    image: string | Buffer;
    type: number;
    pos: [number, number, number];
    rot: [number, number, number];
    resize?: { width: number; height: number };
    worldId?: number;
    interiorId?: number;
    playerId?: number;
    streamDistance?: number;
    drawDistance?: number;
}

interface IArtType {
    modelId: number;   // SA-MP object model ID
    ws: number;        // panel width (world units)
    hs: number;        // panel height (world units)
}
```

## Built-in Art Types

| Index | modelId | Description |
|-------|---------|-------------|
| `0` | `19464` | Largest panel |
| `1` | `19372` | **Default**, medium panel |
| `2` | `2814` | Small square |
| `3` | `18887` | Smallest panel, rotated layout |

Custom types can be added via `SArt.setType()`.

## Constants

```typescript
ART_CHUNK = 15;            // pixels per DynamicObject block
MAX_ART_BLOCKS = 1000;     // max objects per artwork
```

## Exception

`SArtException` is thrown on image load failure or when block count exceeds `MAX_ART_BLOCKS`.

```typescript
import { SArtException } from "@infernus/s-art";
```
