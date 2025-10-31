import type { Player } from "core/components/player/entity";
import type { Vehicle } from "core/components/vehicle/entity";
import type { GangZone } from "core/components/gangzone/entity";
import type { Menu } from "core/components/menu/entity";
import type { Npc } from "core/components/npc/entity";
import type { NpcNode } from "core/components/npc/node";
import type { NpcPath } from "core/components/npc/path";
import type { NpcRecord } from "core/components/npc/record";
import type { TextDraw } from "core/components/textdraw/entity";

import type { DynamicObject } from "core/wrapper/streamer/object/entity";
import type { Dynamic3DTextLabel } from "core/wrapper/streamer/3dtext/entity";
import type { DynamicActor } from "core/wrapper/streamer/actor/entity";
import type { DynamicArea } from "core/wrapper/streamer/area/entity";
import type { DynamicCheckpoint } from "core/wrapper/streamer/checkpoint/entity";
import type { DynamicMapIcon } from "core/wrapper/streamer/mapIcon/entity";
import type { DynamicPickup } from "core/wrapper/streamer/pickup/entity";
import type { DynamicRaceCP } from "core/wrapper/streamer/raceCP/entity";

import type { ObjectMp } from "core/components/object/entity";
import type { Actor } from "core/components/actor/entity";
import type { Pickup } from "core/components/pickup/entity";
import type { TextLabel } from "core/components/textlabel";

export const internalPlayerProps = Symbol("internalPlayerProps");

export const playerPool = new Map<number, Player>();
export const vehiclePool = new Map<number, Vehicle>();
export const gangZonePool = new Map<number, GangZone>();
export const playerGangZonePool = new Map<Player, Map<number, GangZone>>();
export const menuPool = new Map<number, Menu>();
export const npcPool = new Map<number, Npc>();
export const npcNodePool = new Map<number, NpcNode>();
export const npcPathPool = new Map<number, NpcPath>();
export const npcRecordPool = new Map<number, NpcRecord>();
export const textDrawPool = new Map<number, TextDraw>();
export const playerTextDrawPool = new Map<Player, Map<number, TextDraw>>();

export const dynamicObjectPool = new Map<number, DynamicObject>();
export const dynamic3DTextLabelPool = new Map<number, Dynamic3DTextLabel>();
export const dynamicActorPool = new Map<number, DynamicActor>();
export const dynamicAreasPool = new Map<number, DynamicArea>();
export const dynamicCheckpointPool = new Map<number, DynamicCheckpoint>();
export const dynamicMapIconPool = new Map<number, DynamicMapIcon>();
export const dynamicPickupPool = new Map<number, DynamicPickup>();
export const dynamicRaceCPPool = new Map<number, DynamicRaceCP>();

export const objectMpPool = new Map<number, ObjectMp>();
export const playerObjectPool = new Map<Player, Map<number, ObjectMp>>();
export const actorPool = new Map<number, Actor>();
export const pickupPool = new Map<number, Pickup>();
export const textLabelPool = new Map<number, TextLabel>();
export const playerTextLabelPool = new Map<Player, Map<number, TextLabel>>();
