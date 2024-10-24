import type {
  BodyPartsEnum,
  BulletHitTypesEnum,
  WeaponEnum,
  WeaponStatesEnum,
} from "@infernus/core";
import {
  defineEvent,
  GameMode,
  InvalidEnum,
  Player,
  Vehicle,
} from "@infernus/core";
import { FCNPCInstances } from "../pools";

GameMode.onExit(({ next }) => {
  FCNPCInstances.forEach((npc) => npc.isValid() && npc.destroy());
  FCNPCInstances.clear();
  return next();
});

const [onInit] = defineEvent({
  name: "FCNPC_OnInit",
  identifier: "",
});

const [onCreate] = defineEvent({
  name: "FCNPC_OnCreate",
  identifier: "i",
  beforeEach(npcId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
    };
  },
});

const [onDestroy] = defineEvent({
  name: "FCNPC_OnDestroy",
  identifier: "i",
  beforeEach(npcId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
    };
  },
  afterEach({ npc }) {
    if (FCNPCInstances.has(npc.id)) {
      FCNPCInstances.delete(npc.id);
    }
  },
});

const [onSpawn] = defineEvent({
  name: "FCNPC_OnSpawn",
  identifier: "i",
  beforeEach(npcId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
    };
  },
});

const [onRespawn] = defineEvent({
  name: "FCNPC_OnRespawn",
  identifier: "i",
  beforeEach(npcId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
    };
  },
});

const [onDeath] = defineEvent({
  name: "FCNPC_OnDeath",
  identifier: "i",
  beforeEach(npcId: number, killerId: number, reason: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      killer: Player.getInstance(killerId) || InvalidEnum.PLAYER_ID,
      killerId,
      reason,
    };
  },
});

const [onUpdate] = defineEvent({
  name: "FCNPC_OnUpdate",
  identifier: "i",
  beforeEach(npcId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
    };
  },
});

const [onTakeDamage] = defineEvent({
  name: "FCNPC_OnTakeDamage",
  identifier: "iifii",
  beforeEach(
    npcId: number,
    issuerId: number,
    amount: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum,
  ) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      issuer: Player.getInstance(issuerId) || InvalidEnum.PLAYER_ID,
      issuerId,
      amount,
      weapon,
      bodyPart,
    };
  },
});

const [onGiveDamage] = defineEvent({
  name: "FCNPC_OnGiveDamage",
  identifier: "iifii",
  beforeEach(
    npcId: number,
    damagedId: number,
    amount: number,
    weapon: WeaponEnum,
    bodyPart: BodyPartsEnum,
  ) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      damaged: Player.getInstance(damagedId) || InvalidEnum.PLAYER_ID,
      damagedId,
      amount,
      weapon,
      bodyPart,
    };
  },
});

const [onReachDestination] = defineEvent({
  name: "FCNPC_OnReachDestination",
  identifier: "i",
  beforeEach(npcId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
    };
  },
});

const [onWeaponShot] = defineEvent({
  name: "FCNPC_OnWeaponShot",
  identifier: "iiiifff",
  beforeEach(
    npcId: number,
    weapon: WeaponEnum,
    hitType: BulletHitTypesEnum,
    hitId: number,
    fX: number,
    fY: number,
    fZ: number,
  ) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      weapon,
      hitType,
      hitId,
      fX,
      fY,
      fZ,
    };
  },
});

const [onWeaponStateChange] = defineEvent({
  name: "FCNPC_OnWeaponStateChange",
  identifier: "ii",
  beforeEach(npcId: number, weaponState: WeaponStatesEnum) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      weaponState,
    };
  },
});

const [onStreamIn] = defineEvent({
  name: "FCNPC_OnStreamIn",
  identifier: "ii",
  beforeEach(npcId: number, forPlayerId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      forPlayer: Player.getInstance(forPlayerId)!,
    };
  },
});

const [onStreamOut] = defineEvent({
  name: "FCNPC_OnStreamOut",
  identifier: "ii",
  beforeEach(npcId: number, forPlayerId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      forPlayer: Player.getInstance(forPlayerId)!,
    };
  },
});

const [onVehicleEntryComplete] = defineEvent({
  name: "FCNPC_OnVehicleEntryComplete",
  identifier: "ii",
  beforeEach(npcId: number, vehicleId: number, seatId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      vehicle: Vehicle.getInstance(vehicleId)!,
      seatId,
    };
  },
});

const [onVehicleExitComplete] = defineEvent({
  name: "FCNPC_OnVehicleExitComplete",
  identifier: "ii",
  beforeEach(npcId: number, vehicleId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      vehicle: Vehicle.getInstance(vehicleId)!,
    };
  },
});

const [onVehicleTakeDamage] = defineEvent({
  name: "FCNPC_OnVehicleTakeDamage",
  identifier: "iiififff",
  beforeEach(
    npcId: number,
    issuerId: number,
    vehicleId: number,
    amount: number,
    weapon: WeaponEnum,
    fX: number,
    fY: number,
    fZ: number,
  ) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      issuer: Player.getInstance(issuerId) || InvalidEnum.PLAYER_ID,
      issuerId,
      vehicle: Vehicle.getInstance(vehicleId)!,
      vehicleId,
      amount,
      weapon,
      fX,
      fY,
      fZ,
    };
  },
});

const [onFinishPlayback] = defineEvent({
  name: "FCNPC_OnFinishPlayback",
  identifier: "i",
  beforeEach(npcId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
    };
  },
});

const [onFinishNode] = defineEvent({
  name: "FCNPC_OnFinishNode",
  identifier: "ii",
  beforeEach(npcId: number, nodeId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      nodeId,
    };
  },
});

const [onFinishNodePoint] = defineEvent({
  name: "FCNPC_OnFinishNodePoint",
  identifier: "iii",
  beforeEach(npcId: number, nodeId: number, pointId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      nodeId,
      pointId,
    };
  },
});

const [onChangeNode] = defineEvent({
  name: "FCNPC_OnChangeNode",
  identifier: "iii",
  beforeEach(npcId: number, newNodeId: number, oldNodeId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      newNodeId,
      oldNodeId,
    };
  },
});

const [onFinishMovePath] = defineEvent({
  name: "FCNPC_OnFinishMovePath",
  identifier: "ii",
  beforeEach(npcId: number, pathId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      pathId,
    };
  },
});

const [onFinishMovePathPoint] = defineEvent({
  name: "FCNPC_OnFinishMovePathPoint",
  identifier: "iii",
  beforeEach(npcId: number, pathId: number, pointId: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      pathId,
      pointId,
    };
  },
});

// disabled by default, see FCNPC_SetMinHeightPosCall
const [onChangeHeightPos] = defineEvent({
  name: "FCNPC_OnChangeHeightPos",
  identifier: "iff",
  beforeEach(npcId: number, newZ: number, oldZ: number) {
    return {
      npc: FCNPCInstances.get(npcId)!,
      newZ,
      oldZ,
    };
  },
});

export const FCNPCEvent = {
  onInit,
  onCreate,
  onDestroy,
  onSpawn,
  onRespawn,
  onDeath,
  onUpdate,
  onTakeDamage,
  onGiveDamage,
  onReachDestination,
  onWeaponShot,
  onWeaponStateChange,
  onStreamIn,
  onStreamOut,
  onVehicleEntryComplete,
  onVehicleExitComplete,
  onVehicleTakeDamage,
  onFinishPlayback,
  onFinishNode,
  onFinishNodePoint,
  onChangeNode,
  onFinishMovePath,
  onFinishMovePathPoint,
  onChangeHeightPos,
};
