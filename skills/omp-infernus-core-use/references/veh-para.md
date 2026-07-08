# @infernus/veh-para — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Vehicle parachute system — allows players to deploy a parachute on vehicles.

```bash
pnpm add @infernus/core @infernus/colandreas @infernus/veh-para
```

Importing the package is enough to activate it (hooks register automatically). No manual initialization required.

```typescript
import "@infernus/veh-para";
// or
import { VehPara, VehParaEvent } from "@infernus/veh-para";
```

## VehPara

```typescript
// Enable/disable parachute on a vehicle
VehPara.toggle(vehicle, true);   // → void, vehicle number or Vehicle instance
VehPara.toggle(vehicle, false);

// Status checks
VehPara.isUsing(player);         // → boolean, is player currently parachuting
VehPara.isToggle(vehicle);       // → boolean, is parachute enabled on this vehicle

// Config
VehPara.setKey(KeysEnum.CROUCH); // change activation key (default: CROUCH)
```

## Events

```typescript
// Parachute successfully deployed
VehParaEvent.onOpened(({ player, vehicle, next }) => {
    return next();
});

// Player thrown from vehicle (landing or exit)
VehParaEvent.onThrown(({ player, vehicle, next }) => {
    return next();
});

// Failed to deploy (not airborne or zero speed)
VehParaEvent.onOpenFail(({ player, vehicle, next }) => {
    return next();
});
```

## Exception

`VehParaException` is thrown when trying to instantiate the `VehPara` class (it is a static-only class).

```typescript
import { VehParaException } from "@infernus/veh-para";
```
