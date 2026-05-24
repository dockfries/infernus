# PAWN → Infernus Migration Guide

## Callbacks → Event Middleware

```pawn
// PAWN
public OnPlayerConnect(playerid) {
    printf("Player %d connected", playerid);
    return 1;
}
```

```typescript
// Infernus
PlayerEvent.onConnect(({ player, next }) => {
    console.log(`Player ${player.id} connected`);
    return next();
});
```

**Key changes:**
- `playerid` (number) → `player` (Player instance with `.id`, methods, etc.)
- `return 1` → `return next()` (continue chain) or `return true`/`false` (override default)
- Multiple listeners can register on the same event

## Functions → Methods

```pawn
// PAWN
SetPlayerHealth(playerid, 100.0);
GetPlayerName(playerid, name, sizeof(name));
SendClientMessage(playerid, 0xFFFFFFFF, "Hello");
SetVehiclePos(vehicleid, 0.0, 0.0, 5.0);
```

```typescript
// Infernus
player.setHealth(100.0);
const { name } = player.getName();
player.sendClientMessage("#fff", "Hello");
vehicle.setPos(0, 0, 5);
```

## Function → Static Method

```pawn
// PAWN
SetWeather(10);
SetWorldTime(12);
```

```typescript
// Infernus
GameMode.setWeather(10);
GameMode.setWorldTime(12);
```

## Create Entity Pattern

```pawn
// PAWN — creation is immediate
new vehicleid = CreateVehicle(411, 0.0, 0.0, 5.0, 0.0, -1, -1, -1);
new actorid = CreateActor(0, 0.0, 0.0, 5.0, 0.0);
```

```typescript
// Infernus — two-phase: new + .create()
const veh = new Vehicle({ modelId: 411, x: 0, y: 0, z: 5, zAngle: 0, color: [-1, -1] });
veh.create();
const actor = new Actor({ skin: 0, x: 0, y: 0, z: 0, rotation: 0 });
actor.create();
```

## Object Creation

```pawn
// PAWN
new obj = CreateObject(1337, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 200.0);
```

```typescript
// Infernus
const obj = new ObjectMp({ modelId: 1337, x: 0, y: 0, z: 10, rx: 0, ry: 0, rz: 0 });
obj.create();
```

## Strings — No Buffer Management

```pawn
// PAWN — must allocate buffers
new name[MAX_PLAYER_NAME];
GetPlayerName(playerid, name, sizeof(name));
```

```typescript
// Infernus — returns { name, ret }
const result = player.getName();
console.log(result.name);
```

## Colors

```pawn
// PAWN — hex ARGB number
SendClientMessage(playerid, 0xFFFFFFFF, "text");
SendClientMessage(playerid, 0xFF0000FF, "red");
```

```typescript
// Infernus — multiple formats
player.sendClientMessage("#fff", "text");       // CSS hex
player.sendClientMessage("#ff0000", "red");
player.sendClientMessage(-1, "white");           // native number
player.sendClientMessage("(255,0,0,255)", "red"); // CSS rgba
```

## Commands

```pawn
// PAWN — manual strcmp
public OnPlayerCommandText(playerid, cmdtext[]) {
    if(!strcmp(cmdtext, "/help", true)) {
        SendClientMessage(playerid, -1, "Help!");
        return 1;
    }
    return 0;
}
```

```typescript
// Infernus — declarative
PlayerEvent.onCommandText("help", ({ player, next }) => {
    player.sendClientMessage(-1, "Help!");
    return next();
});
// Supports aliases, subcommands, guards, case sensitivity
PlayerEvent.onCommandText(["msg", "message"], ({ player, subcommand, next }) => {
    return next();
});
```

## Dialogs

```pawn
// PAWN — callback-based with manual ID management
ShowPlayerDialog(playerid, 1, DIALOG_STYLE_LIST, "Title", "Item 1\nItem 2", "Select", "Cancel");

public OnDialogResponse(playerid, dialogid, response, listitem, inputtext[]) {
    if(dialogid == 1) { ... }
    return 1;
}
```

```typescript
// Infernus — Promise-based, auto ID
const dlg = new Dialog({ style: DialogStylesEnum.LIST, caption: "Title", info: "Item 1\nItem 2", button1: "Select", button2: "Cancel" });
const { response, listItem, inputText } = await dlg.show(player);
```

## Timers

```pawn
// PAWN — SetTimer
SetTimer("MyFunction", 1000, true);
```

```typescript
// Infernus — standard JS
setInterval(() => { console.log("tick"); }, 1000);
setTimeout(() => { console.log("done"); }, 1000);
```

## Common PAWN → Infernus Mapping Table

| PAWN | Infernus |
|------|----------|
| `SetPlayerHealth(playerid, health)` | `player.setHealth(health)` |
| `GetPlayerPos(playerid, &x, &y, &z)` | `const {x,y,z} = player.getPos()` |
| `SetSpawnInfo(playerid, ...)` | `GameMode.addPlayerClass(...)` |
| `CreateVehicle(...)` | `new Vehicle(config).create()` |
| `CreateObject(...)` | `new ObjectMp(config).create()` |
| `SetTimer(func, ms, repeat)` | `setTimeout` / `setInterval` |
| `strcmp(cmd, "/help")` | `PlayerEvent.onCommandText("help", ...)` |
| `ShowPlayerDialog(...)` | `new Dialog(config).show(player)` |
| `GetPlayerName(playerid, buf, size)` | `player.getName().name` |
| `PlayerTextDrawCreate(...)` | `new TextDraw(config, player).create()` |
| `GangZoneCreate(...)` | `new GangZone(config).create()` |
| `CreatePickup(...)` | `new Pickup(config).create()` |
| `Create3DTextLabel(...)` | `new TextLabel(config).create()` |
| `CreateMenu(...)` | `new Menu(config).create()` |
