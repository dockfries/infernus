import type { Player } from "core/controllers/player/entity";
import type { Vehicle } from "core/controllers/vehicle/entity";
import type { GangZone } from "core/controllers/gangzone/entity";
import type { Menu } from "core/controllers/menu/entity";
import type { Npc } from "core/controllers/npc/entity";
import type { NpcNode } from "core/controllers/npc/node";
import type { NpcPath } from "core/controllers/npc/path";
import type { NpcRecord } from "core/controllers/npc/record";

import type { TextDraw } from "core/controllers/textdraw/entity";
import type { DynamicObject } from "core/wrapper/streamer/object";
import type { Dynamic3DTextLabel } from "core/wrapper/streamer/3dtext";
import type { DynamicActor } from "core/wrapper/streamer/actor";
import type { DynamicArea } from "core/wrapper/streamer/area";
import type { DynamicCheckpoint } from "core/wrapper/streamer/checkpoint";
import type { DynamicMapIcon } from "core/wrapper/streamer/mapIcon";
import type { DynamicPickup } from "core/wrapper/streamer/pickup";
import type { DynamicRaceCP } from "core/wrapper/streamer/raceCP";

export interface IInnerPlayerProps {
  isAndroid: boolean;
}

export const innerPlayerProps = Symbol();

export const playerPool = new Map<number, Player>();
export const vehiclePool = new Map<number, Vehicle>();
export const globalGangZonePool = new Map<number, GangZone>();
export const playerGangZonePool = new Map<number, GangZone>();
export const menuPool = new Map<number, Menu>();
export const npcPool = new Map<number, Npc>();
export const npcNodePool = new Map<number, NpcNode>();
export const npcPathPool = new Map<number, NpcPath>();
export const npcRecordPool = new Map<number, NpcRecord>();
export const globalTextDrawPool = new Map<number, TextDraw>();
export const playerTextDrawPool = new Map<number, TextDraw>();

export const dynamicObjectPool = new Map<number, DynamicObject>();
export const dynamic3DTextLabelPool = new Map<number, Dynamic3DTextLabel>();
export const dynamicActorPool = new Map<number, DynamicActor>();
export const dynamicAreasPool = new Map<number, DynamicArea>();
export const dynamicCheckpointPool = new Map<number, DynamicCheckpoint>();
export const dynamicMapIconPool = new Map<number, DynamicMapIcon>();
export const dynamicPickupPool = new Map<number, DynamicPickup>();
export const dynamicRaceCheckpointPool = new Map<number, DynamicRaceCP>();
