# @infernus/core — Entity API Reference

> **All API calls in this reference must be placed inside event callbacks** (`GameMode.onInit`, `PlayerEvent.onConnect`, `onCommandText`, etc.). They will silently fail at module/global context — samp-node is not ready until `OnGameModeInit`.

## Player

```typescript
import { Player, PlayerEvent } from "@infernus/core";

// Events
PlayerEvent.onConnect(({ player, next }) => { return next(); });
PlayerEvent.onDisconnect(({ player, reason, next }) => { return next(); }); // 0=timeout,1=quit,2=kicked
PlayerEvent.onSpawn(({ player, next }) => { return next(); });
PlayerEvent.onDeath(({ player, killer, reason, next }) => { return next(); });
PlayerEvent.onText(({ player, text, next }) => { return next(); });
PlayerEvent.onRequestClass(({ player, classId, next }) => { return next(); });
PlayerEvent.onRequestSpawn(({ player, next }) => { return next(); });
PlayerEvent.onStateChange(({ player, newState, oldState, next }) => { return next(); });
PlayerEvent.onKeyStateChange(({ player, newKeys, oldKeys, next }) => { return next(); });
PlayerEvent.onTakeDamage(({ player, damage, amount, weapon, bodyPart, next }) => { return next(); });
PlayerEvent.onGiveDamage(({ player, damage, amount, weapon, bodyPart, next }) => { return next(); });
PlayerEvent.onClickMap(({ player, fX, fY, fZ, next }) => { return next(); });
PlayerEvent.onClickPlayer(({ player, clickedPlayer, source, next }) => { return next(); });
PlayerEvent.onStreamIn(({ player, forPlayer, next }) => { return next(); });
PlayerEvent.onStreamOut(({ player, forPlayer, next }) => { return next(); });
PlayerEvent.onWeaponShot(({ player, weapon, hitType, hitId, fX, fY, fZ, next }) => { return next(); });
PlayerEvent.onInteriorChange(({ player, newInteriorId, oldInteriorId, next }) => { return next(); });
PlayerEvent.onEnterExitModShop(({ player, enterExit, interior, next }) => { return next(); });
PlayerEvent.onPause(({ player, next }) => { return next(); });
PlayerEvent.onResume(({ player, next }) => { return next(); });

// Methods
player.sendClientMessage("#fff", "text");
player.setHealth(100);          player.getHealth();
player.setArmour(50);           player.getArmour();
player.setPos(x, y, z);         player.getPos();       // { x, y, z }
player.setSkin(id);             player.getSkin();
player.setInterior(id);         player.getInterior();
player.setVirtualWorld(id);     player.getVirtualWorld();
player.setScore(n);             player.getScore();
player.getPing();               player.getMoney();
player.giveMoney(n);            player.resetMoney();
player.setColor("#f00");        player.getColor();
player.getName();               // { name, ret }
player.setName("NewName");
player.kick();                  player.ban();   player.banEx("reason", "utf8");
player.spawn();                 player.forceClassSelection();
player.toggleSpectating(b);     player.spectatePlayer(tp);  player.spectateVehicle(tv);
player.giveWeapon(w, ammo);     player.setWeaponAmmo(w, ammo);
player.getWeaponData(slot);     // { weapon, ammo }
player.resetWeapons();          player.getWeapon();   player.getAmmo();
player.setChatBubble("text", "#fff", dist, ms);
player.setCameraPos(x,y,z);     player.setCameraLookAt(x,y,z,cut);
player.setCameraBehind();       player.interpolateCameraPos(fX,fY,fZ,tX,tY,tZ,ms,cut);
player.isInAnyVehicle();        player.isStreamedIn(fp);   player.isAdmin();
player.getFps();                player.getSpecialAction();
player.getState();              player.getVersion();
player.applyAnimation(lib, name, speed, loop, lockX, lockY, freeze, time, forceSync);
player.clearAnimations();
player.removeBuilding(mid, x, y, z, radius);
player.setFightingStyle(s);     player.getFightingStyle();
player.setTeam(t);              player.getTeam();
player.setWeather(w);           player.getWeather();
player.setTime(h, m);           player.getTime();      // { hour, minute }
player.setWantedLevel(0-6);     player.getWantedLevel();
player.playSound(id, x, y, z);
player.playAudioStream(url, x, y, z, dist);  player.stopAudioStream();
player.getIp();                 player.getNetworkStats();
player.getCameraPos();          player.getCameraFrontVector();  player.getCameraMode();
player.getCameraTargetPlayer(); player.getCameraTargetVehicle();
player.getCameraTargetActor();  player.getCameraTargetObject();
player.getKeys();               player.getSpeed(magic = 180.0);
player.toggleClock(b);          player.toggleControllable(b);
player.enableCameraTarget(b);   player.setMapIcon(id, x, y, z, type, color, style);
player.removeMapIcon(id);       player.setMarker(tp, color);
player.setSkillLevel(skill, level);
player.createExplosion(x, y, z, type, radius);
player.playCrimeReport(suspect, crimeId);  // 3-22

// Properties
player.id;     player.charset;     player.locale;
player.lastFps; player.isPaused;   player.isRecording;

// Static
Player.getInstance(id);       Player.getInstances();
Player.isConnected(id);       Player.getMaxPlayers();
Player.sendClientMessageToAll(color, msg);
```

## Vehicle

```typescript
import { Vehicle, VehicleEvent } from "@infernus/core";

const veh = new Vehicle({ modelId: 411, x: 0, y: 0, z: 5, zAngle: 0, color: [-1, -1] });
veh.create();

veh.setHealth(1000);          veh.getHealth();
veh.setPos(x, y, z);          veh.getPos();
veh.setVelocity(x, y, z);     veh.getVelocity();
veh.setAngularVelocity(x,y,z);
veh.getRotationQuat();        // { x, y, z, w }
veh.getModelId();
veh.changeColors(c1, c2);     veh.getColors(); // { color1, color2, ret }
veh.setNumberPlate("PLATE");  veh.getNumberPlate();
veh.setParamsEx(engine,lights,alarm,doors,bonnet,boot,objective);
veh.getParamsEx();
veh.toggleEngine(v);    veh.toggleLights(v);    veh.toggleAlarm(v);
veh.toggleDoors(v);     veh.toggleBonnet(v);    veh.toggleBoot(v);
veh.toggleObjective(v);
veh.setParamsCarDoors(d,pa,bl,br);
veh.setParamsCarWindows(d,pa,bl,br);
veh.setParamsSirenState(b);
veh.setParamsForPlayer(player, objective, doorsLocked);
veh.getDamageStatus();        veh.updateDamageStatus(p, d, l, t);
veh.changePaintjob(0-3);      veh.addComponent(id);
veh.getComponentInSlot(slot); veh.removeComponent(id);
veh.linkToInterior(id);       veh.setVirtualWorld(vw);
veh.isStreamedIn(fp);         veh.isPlayerIn(p);
veh.putPlayerIn(player, seat);
veh.attachTrailer(trailer);   veh.detachTrailer();
veh.repair();                 veh.respawn();
veh.show();                   veh.hide();
veh.destroy();

VehicleEvent.onSpawn(({ vehicle, next }) => { return next(); });
VehicleEvent.onDeath(({ vehicle, killer, next }) => { return next(); });
VehicleEvent.onMod(({ player, vehicle, componentId, next }) => { return next(); });
VehicleEvent.onDamageStatusUpdate(({ vehicle, player, next }) => { return next(); });
VehicleEvent.onPaintjob(({ player, vehicle, paintjobId, next }) => { return next(); });
VehicleEvent.onRespray(({ player, vehicle, color, next }) => { return next(); });
VehicleEvent.onSirenStateChange(({ player, vehicle, state, next }) => { return next(); });
VehicleEvent.onPlayerEnter(({ player, vehicle, isPassenger, next }) => { return next(); });
VehicleEvent.onPlayerExit(({ player, vehicle, next }) => { return next(); });
VehicleEvent.onTrailerUpdate(({ player, vehicle, next }) => { return next(); });
VehicleEvent.onUnoccupiedUpdate(({ vehicle, player, passengerSeat, newX, newY, newZ, velX, velY, velZ, next }) => { return next(); });

// Static utilities
Vehicle.getInstance(id);         Vehicle.getInstances();
Vehicle.isValid(vehicleId);
Vehicle.getModelInfo(modelId, VehicleModelInfoEnum);
Vehicle.getMaxPassengers(modelId); Vehicle.getSeats(modelId);
Vehicle.getRandomColorPair(modelId);
Vehicle.getModelCount(modelId);  Vehicle.getModelsUsed();
Vehicle.canHaveComponent(modelId, componentId);
Vehicle.colorIndexToColor(index, alpha?);
Vehicle.getComponentType(component);
```

## Actor vs NPC — Not the Same

**`Actor`** and **`Npc` are two completely different things in Infernus.** They are not interchangeable:
- `Actor` is a static character rendered by the client (shopkeepers, bystanders). No player ID, no movement.
- `Npc` is a scripted bot that connects as a real player. Has a player ID, can move/drive/fight.

## Actor

```typescript
import { Actor, ActorEvent } from "@infernus/core";

const actor = new Actor({ skin: 0, x: 0, y: 0, z: 0, rotation: 0 });
actor.create();

actor.setPos(x, y, z);          actor.getPos();
actor.setFacingAngle(a);        actor.getFacingAngle();
actor.setHealth(100);           actor.getHealth();
actor.setInvulnerable(true);    actor.isInvulnerable();
actor.setVirtualWorld(vw);      actor.getVirtualWorld();
actor.setSkin(skin);            actor.getSkin();
actor.applyAnimation(lib, name, delta, loop, lockX, lockY, freeze, time);
actor.clearAnimations();
actor.destroy();

ActorEvent.onPlayerGiveDamage(({ actor, player, amount, weapon, bodyPart, next }) => { return next(); });
ActorEvent.onStreamIn(({ actor, player, next }) => { return next(); });
ActorEvent.onStreamOut(({ actor, player, next }) => { return next(); });

// Static
Actor.getInstance(id);    Actor.getInstances();
Actor.isValid(id);
```

## NPC

```typescript
import { Npc, NpcEvent } from "@infernus/core";

const npc = new Npc("Bot");     // constructor takes name string
npc.create();                   // connects the NPC

npc.goTo(x, y, z, type, speed);  npc.stopMove();
npc.aimAt(x, y, z, shoot);       npc.stopAim();
npc.setWeapon(w);                 npc.fireWeapon();
npc.setAmmo(a);                   npc.enterVehicle(v, seat);
npc.exitVehicle();                npc.applyAnimation(lib, name, ...);
npc.startRecordingPlayback(id);   npc.stopRecordingPlayback();
npc.setInvulnerable(true);        npc.destroy();

NpcEvent.onCreate(({ npc, next }) => { return next(); });
NpcEvent.onSpawn(({ npc, next }) => { return next(); });
NpcEvent.onDeath(({ npc, reason, next }) => { return next(); });
// 20+ events for movement, combat, playback

// Static
Npc.getInstance(id);     Npc.getInstances();
Npc.isValid(id);
Npc.startRecordingPlayerData(player, recordType, recordName);
Npc.stopRecordingPlayerData(player);
```

## Object (ObjectMp)

```typescript
import { ObjectMp, ObjectMpEvent } from "@infernus/core";

const obj = new ObjectMp({ modelId: 1337, x: 0, y: 0, z: 10, rx: 0, ry: 0, rz: 0 });
obj.create();                              // global object

// Per-player — EITHER player in config OR second arg, not both
const pobj = new ObjectMp({ modelId: 1337, ..., player }, player);  // WRONG
const pobj = new ObjectMp({ modelId: 1337, ..., player });          // correct

// getInstance(objectId, player?) — lookup by numeric ID in global or per-player pool
ObjectMp.getInstance(objectId);            // global pool
ObjectMp.getInstance(objectId, player);    // player-specific pool
ObjectMp.getInstances(player?);

obj.setPos(x, y, z);          obj.getPos();
obj.setRot(rx, ry, rz);       obj.getRot();
obj.move(x, y, z, speed, rx, ry, rz);  obj.stop();
obj.attachToObject(t,...);    obj.attachToPlayer(p,...);
obj.attachToVehicle(v,...);   obj.attachCamera(player);
obj.edit(player);             obj.setCameraCollision(bool);
obj.setMaterial(slot, modelId, txd, texture, color);
obj.setMaterialText(text, slot, size, fontFace, fontSize, bold, fontColor, backColor, align);
obj.destroy();

ObjectMpEvent.onPlayerEdit(({ player, object, retType, pos, rot, next }) => { return next(); });
ObjectMpEvent.onPlayerSelect(({ player, object, modelId, pos, next }) => { return next(); });
ObjectMpEvent.onGlobalMoved(({ object, next }) => { return next(); });
ObjectMpEvent.onPlayerMoved(({ object, player, next }) => { return next(); });

// Static
ObjectMp.getInstance(objectId, player?); ObjectMp.getInstances(player?);
ObjectMp.isValid(objectId, playerId?);
ObjectMp.getPlayersInstances();  // [Player, ObjectMp[]][]
```

## Pickup

```typescript
import { Pickup, PickUpEvent } from "@infernus/core";

const pu = new Pickup({ model: 1240, type: 1, x: 0, y: 0, z: 5, virtualWorld: 0 });
pu.create();                              // global

// Per-player — player in config OR second arg
const ppu = new Pickup({ model: 1240, ..., player }, player);  // WRONG
const ppu = new Pickup({ model: 1240, ..., player });          // correct

pu.setPos(x, y, z);    pu.getPos();
pu.setModel(model);    pu.setType(type);   pu.setVirtualWorld(vw);
pu.showForPlayer(p);   pu.hideForPlayer(p);
pu.destroy();

// getInstance(pickupId, player?) — lookup by numeric ID
Pickup.getInstance(pickupId, player?);
Pickup.getInstances(player?);

PickUpEvent.onPlayerPickUpGlobal(({ player, pickup, next }) => { return next(); });
PickUpEvent.onPlayerPickupPlayer(({ player, pickup, next }) => { return next(); });

// Static
Pickup.getInstance(pickupId, player?);  Pickup.getInstances(player?);
Pickup.isValidGlobal(zoneId);           Pickup.isValidPlayer(playerId, zoneId);
Pickup.getPlayersInstances();  // [Player, Pickup[]][]
```

## GangZone

```typescript
import { GangZone, GangZoneEvent } from "@infernus/core";

const gz = new GangZone({ minX: 0, maxX: 100, minY: 0, maxY: 100 });
gz.create();                              // global

// Per-player — player in config OR second arg
const pgz = new GangZone({ minX:0, maxX:100, minY:0, maxY:100, player }, player);  // WRONG
const pgz = new GangZone({ minX:0, maxX:100, minY:0, maxY:100, player });          // correct

gz.showForAll(color);        gz.showForPlayer(player, color);
gz.hideForAll();             gz.hideForPlayer(player);
gz.flashForAll(color);       gz.flashForPlayer(player, color);
gz.stopFlashForAll();        gz.stopFlashForPlayer(player);
gz.isPlayerIn(player);       gz.isVisible(player);
gz.getColorForPlayer(player);  gz.destroy();

// getInstance(gangZoneId, player?) — lookup by numeric ID
GangZone.getInstance(gangZoneId, player?);
GangZone.getInstances(player?);

GangZoneEvent.onPlayerEnterGlobal(({ player, gangzone, next }) => { return next(); });
GangZoneEvent.onPlayerLeaveGlobal(({ player, gangzone, next }) => { return next(); });
GangZoneEvent.onPlayerClickGlobal(({ player, gangzone, next }) => { return next(); });
GangZoneEvent.onPlayerEnterPlayer(({ player, gangzone, next }) => { return next(); });
GangZoneEvent.onPlayerLeavePlayer(({ player, gangzone, next }) => { return next(); });
GangZoneEvent.onPlayerClickPlayer(({ player, gangzone, next }) => { return next(); });

// Static
GangZone.getInstance(gangZoneId, player?);  GangZone.getInstances(player?);
GangZone.isValidGlobal(zoneId);             GangZone.isValidPlayer(playerId, zoneId);
GangZone.getPlayersInstances();  // [Player, GangZone[]][]
```

## TextDraw

```typescript
import { TextDraw, TextDrawEvent } from "@infernus/core";

const td = new TextDraw({ x: 100, y: 200, text: "Hello" });
td.create();                              // global

// Per-player — player in config OR second arg
const ptd = new TextDraw({ x: 100, y: 200, text: "Hello", player }, player);  // WRONG
const ptd = new TextDraw({ x: 100, y: 200, text: "Hello", player });          // correct

td.setFont(TextDrawFontsEnum.BANK);    td.setLetterSize(w, h);
td.setTextSize(w, h);                  td.setAlignment(1|2|3);
td.setColor("#fff");                   td.setBoxColor("#000");
td.setBackgroundColor("#888");         td.setShadow(n);
td.setOutline(n);                      td.setProportional(bool);
td.setSelectable(bool);
td.setPreviewModel(modelId);           td.setPreviewRot(rx,ry,rz,zoom);
td.setPreviewVehColors(c1,c2);
td.showForPlayer(player);              td.showForAll();
td.hideForPlayer(player);              td.hideForAll();
td.destroy();

// getInstance(textDrawId, player?) — lookup by numeric ID
TextDraw.getInstance(textDrawId, player?);
TextDraw.getInstances(player?);

TextDrawEvent.onPlayerClickGlobal(({ player, textdraw, next }) => { return next(); });
TextDrawEvent.onPlayerClickPlayer(({ player, textdraw, next }) => { return next(); });

// Static
TextDraw.getInstance(textDrawId, player?);  TextDraw.getInstances(player?);
TextDraw.getPlayersInstances();  // [Player, TextDraw[]][]
```

## TextLabel (3D Text)

```typescript
import { TextLabel } from "@infernus/core";

const tl = new TextLabel({
    text: "Label", color: "#fff",
    x: 0, y: 0, z: 5, drawDistance: 100,
    virtualWorld: 0, testLOS: false,
});
tl.create();                              // global

// Per-player — player in config OR second arg
const ptl = new TextLabel({ ..., player }, player);  // WRONG
const ptl = new TextLabel({ ..., player });          // correct

tl.attachToPlayer(player, x, y, z);
tl.attachToVehicle(vehicle, x, y, z);
tl.updateText(color, text);
tl.destroy();

// getInstance(textLabelId, player?) — lookup by numeric ID
TextLabel.getInstance(textLabelId, player?);
TextLabel.getInstances(player?);

// Static
TextLabel.isValid(textLabelId, playerId?);
TextLabel.getPlayersInstances();  // [Player, TextLabel[]][]
```

## Checkpoint & RaceCheckpoint

```typescript
import { Checkpoint, RaceCheckpoint } from "@infernus/core";
import { CheckPointEvent, RaceCpEvent } from "@infernus/core";

Checkpoint.set(player, x, y, z, radius);     Checkpoint.disable(player);
Checkpoint.isPlayerIn(player);               Checkpoint.isActive(player);
Checkpoint.get(player);                      // { x, y, z, radius }

RaceCheckpoint.set(player, type, x, y, z, nx, ny, nz, radius);
RaceCheckpoint.disable(player);

CheckPointEvent.onPlayerEnter(({ player, next }) => { return next(); });
CheckPointEvent.onPlayerLeave(({ player, next }) => { return next(); });
RaceCpEvent.onPlayerEnter(({ player, next }) => { return next(); });
RaceCpEvent.onPlayerLeave(({ player, next }) => { return next(); });
```

## Menu

```typescript
import { Menu, MenuEvent } from "@infernus/core";

const menu = new Menu({ title: "Menu", columns: 2, x: 100, y: 100, colWidth: [200, 200] });
menu.create();

menu.addItem(col, "Option");          menu.setColumnHeader(col, "Header");
menu.disableRow(row);
menu.showForPlayer(player);           menu.hideForPlayer(player);
menu.destroy();

MenuEvent.onPlayerSelectedRow(({ player, menu, row, next }) => { return next(); });
MenuEvent.onPlayerExited(({ player, menu, next }) => { return next(); });

// Static
Menu.getInstance(id);     Menu.getInstances();
Menu.isValid(menuId);
Menu.getInstanceByPlayer(player);
```

## GameText

```typescript
import { GameText } from "@infernus/core";

const gt = new GameText("Hello!", 3000, 4);   // text, timeMs, style
gt.forAll();                gt.forPlayer(player);
gt.hideForPlayer(player);   GameText.hideForAll(style);
GameText.has(player, style);
```
