# @infernus/drift-detection — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Drift/drift-angle detection system.

```bash
pnpm add @infernus/core @infernus/drift-detection
```

## Drift (static API)

```typescript
import { Drift, DriftEvent } from "@infernus/drift-detection";

// Configuration
Drift.setMinAngle(angle);       // 12-80 valid range
Drift.getMinAngle();            // default 12
Drift.setMinSpeed(speed);       // default 45
Drift.getMinSpeed();
Drift.setTimeoutTicks(ticks);   // default 6
Drift.getTimeoutTicks();

Drift.enableDetection(player?);     // global or per-player
Drift.disableDetection(player?);
Drift.isDetectionEnabled(player?);

Drift.enableDamageCheck(player?);
Drift.disableDamageCheck(player?);
Drift.isDamageCheckEnabled(player?);

Drift.isPlayerDrifting(player);     // → boolean
```

## DriftEvent

```typescript
DriftEvent.onPlayerStart(({ player, next }) => { return next(); });
DriftEvent.onPlayerUpdate(({ player, driftAngle, speed, time, next }) => { return next(); });
DriftEvent.onPlayerEnd(({ player, reason, distance, time, next }) => { return next(); });
// reason: DriftEndReasonEnum (TIMEOUT, DAMAGED, OTHER)
```

## Enums & Constants

```typescript
enum DriftEndReasonEnum { TIMEOUT, DAMAGED, OTHER }
enum DriftStateEnum { NONE, DRIFTING }
enum DriftOptionsEnum { DRIFT_CHECK_ENABLED = 1, DAMAGE_CHECK_ENABLED = 2 }

MIN_DRIFT_ANGLE = 12;
MAX_DRIFT_ANGLE = 80;
MIN_DRIFT_SPEED = 45;
DRIFT_PROCESS_INTERVAL = 250;
DRIFT_TIMEOUT_INTERVAL = 6;
```
