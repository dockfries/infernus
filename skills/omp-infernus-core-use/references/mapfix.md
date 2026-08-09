# @infernus/mapfix — API Reference

> Importing the package registers a `GameMode.onInit` handler that creates all mapfix objects. To
> toggle individual fix places you must call `toggleMapFixPlace(...)` at **module top level, before
> `GameMode.onInit` fires** — calling it inside an event callback is too late for the current round
> and only applies on the next GMX restart (the next `OnGameModeInit`).

Wraps the popular [MapFix include](https://github.com/NexiusTailer/MapFix), which re-creates misplaced default objects in San Andreas (665 objects across 156 fix places).

```bash
pnpm add @infernus/core @infernus/mapfix
```

## Side-effect import

Importing `@infernus/mapfix` registers a `GameMode.onInit` handler that creates all fix objects and an `GameMode.onExit` handler that destroys them. All places are enabled by default.

```typescript
import "@infernus/mapfix";
```

## toggleMapFixPlace

```typescript
import { toggleMapFixPlace } from "@infernus/mapfix";

// Disable a fix place — MUST run at module top level, not inside GameMode.onInit
toggleMapFixPlace(1, false);

// Re-enable it
toggleMapFixPlace(1, true);
```
